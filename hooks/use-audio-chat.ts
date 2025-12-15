"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type AudioChatState = "disconnected" | "connecting" | "connected" | "listening" | "speaking" | "error";

interface UseAudioChatProps {
    apiKey: string;
    voiceName?: string;
    systemInstruction?: string;
}

export function useAudioChat({ apiKey, voiceName = "Aoede", systemInstruction }: UseAudioChatProps) {
    const [state, setState] = useState<AudioChatState>("disconnected");
    const [error, setError] = useState<string | null>(null);
    const [volume, setVolume] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioQueueRef = useRef<Float32Array[]>([]);
    const isPlayingRef = useRef(false);

    const connect = useCallback(async () => {
        const proxyUrl = process.env.NEXT_PUBLIC_GEMINI_PROXY_URL;

        if (!apiKey && !proxyUrl) {
            console.error("API Key is missing");
            setError("API Key is missing");
            return;
        }
        console.log("Connecting...");

        setState("connecting");
        setError(null);

        try {
            // 1. Initialize Audio Context
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000, // Try to request 16kHz
            });
            audioContextRef.current = audioContext;

            // 2. Initialize WebSocket
            // 2. Initialize WebSocket
            const proxyUrl = process.env.NEXT_PUBLIC_GEMINI_PROXY_URL;
            let wsUrl = "";

            if (proxyUrl) {
                // Use Proxy: No API key in URL (injected by worker)
                // Ensure proxyUrl starts with wss:// and ends without slash
                const baseUrl = proxyUrl.replace(/\/$/, "");
                wsUrl = `${baseUrl}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
                console.log("Connecting via Proxy:", baseUrl);
            } else {
                // Direct Connection: Requires API Key
                wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
                console.log("Connecting directly to Google API");
            }

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = async () => {
                console.log("WebSocket Connected");
                setState("connected");

                // Send Setup Message
                const setupMessage = {
                    setup: {
                        model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
                        generation_config: {
                            response_modalities: ["AUDIO"],
                            speech_config: {
                                voice_config: {
                                    prebuilt_voice_config: { voice_name: voiceName }
                                }
                            }
                        },
                        system_instruction: systemInstruction ? {
                            parts: [{ text: systemInstruction }]
                        } : undefined
                    }
                };
                ws.send(JSON.stringify(setupMessage));

                // Start Audio Input
                await startAudioInput();
            };

            ws.onmessage = async (event) => {
                let data = event.data;
                if (data instanceof Blob) {
                    data = await data.text();
                }

                try {
                    const response = JSON.parse(data);

                    // Handle Audio Output
                    const parts = response.serverContent?.modelTurn?.parts;
                    if (parts) {
                        parts.forEach((part: any) => {
                            if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                                queueAudioChunk(part.inlineData.data);
                            }
                        });
                    }

                    // Handle Turn Complete (optional: update state)
                    if (response.serverContent?.turnComplete) {
                        // Maybe switch state back to listening if needed
                    }

                } catch (e) {
                    console.error("Error parsing WebSocket message:", e);
                }
            };

            ws.onerror = (e) => {
                console.error("WebSocket Error:", e);
                setError("Connection error");
                setState("error");
            };

            ws.onclose = (event) => {
                console.log("WebSocket Closed", event.code, event.reason);
                if (state !== "disconnected") {
                    setState("disconnected");
                }
                stopAudio();
            };

        } catch (e) {
            console.error("Connection failed:", e);
            setError("Failed to connect");
            setState("error");
        }
    }, [apiKey, voiceName, systemInstruction, state]);

    const startAudioInput = async () => {
        if (!audioContextRef.current || !wsRef.current) return;

        try {
            // Load Audio Worklet
            await audioContextRef.current.audioWorklet.addModule("/audio-processor.js");

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000,
                    channelCount: 1
                }
            });
            mediaStreamRef.current = stream;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioContextRef.current, "pcm-processor");
            workletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
                // Receive PCM data from worklet
                const pcmBuffer = event.data; // ArrayBuffer
                const b64Data = arrayBufferToBase64(pcmBuffer);

                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        realtime_input: {
                            media_chunks: [{
                                mime_type: "audio/pcm",
                                data: b64Data
                            }]
                        }
                    }));

                    // Simple volume estimation for visualizer
                    const int16 = new Int16Array(pcmBuffer);
                    let sum = 0;
                    for (let i = 0; i < int16.length; i += 10) { // sample every 10th
                        sum += Math.abs(int16[i]);
                    }
                    const avg = sum / (int16.length / 10);
                    setVolume(Math.min(100, avg / 100)); // Normalize roughly
                }
            };

            source.connect(workletNode);
            // workletNode.connect(audioContextRef.current.destination); // Don't connect to destination to avoid hearing yourself

            setState("listening");

        } catch (e) {
            console.error("Error starting audio input:", e);
            setError("Microphone access failed");
            setState("error");
        }
    };

    const queueAudioChunk = (base64Audio: string) => {
        setState("speaking");
        const float32Data = decodeBase64ToFloat32(base64Audio);
        playAudioChunk(float32Data);
    };

    const playAudioChunk = (float32Data: Float32Array) => {
        if (!audioContextRef.current) return;

        const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000); // Gemini output is 24kHz
        buffer.getChannelData(0).set(float32Data);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);

        const currentTime = audioContextRef.current.currentTime;
        if (nextStartTimeRef.current < currentTime) {
            nextStartTimeRef.current = currentTime + 0.05;
        }

        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;

        source.onended = () => {
            // Check if queue is empty to switch back to listening?
            // For now, simple state switch might be too flickery
            if (audioContextRef.current && audioContextRef.current.currentTime >= nextStartTimeRef.current - 0.1) {
                setState("listening");
            }
        };
    };

    const disconnect = useCallback(() => {
        stopAudio();
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setState("disconnected");
    }, []);

    const stopAudio = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        state,
        error,
        volume,
        connect,
        disconnect
    };
}

// Helpers
function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function decodeBase64ToFloat32(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
    }
    return float32Array;
}
