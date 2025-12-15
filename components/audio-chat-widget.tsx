"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import { useAuth } from "@/contexts/auth-context";
import { useAudioChat } from "@/hooks/use-audio-chat";
import { Button } from "@/components/ui/button";
import { Mic, X, Loader2, Volume2, StopCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PharmaBotMascot } from "@/components/pharma-bot-mascot";

export function AudioChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const isAuthenticated = !!user;

    // Get API Key from env - handling both NEXT_PUBLIC and standard
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";

    const { state, error, volume, connect, disconnect } = useAudioChat({
        apiKey,
        systemInstruction: "You are Pharma Guru, a helpful and knowledgeable pharmaceutical AI assistant. Keep your answers concise and conversational."
    });

    // Canvas for audio visualization
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerY = canvas.height / 2;

            // Simple wave visualization based on volume
            ctx.beginPath();
            ctx.moveTo(0, centerY);

            for (let i = 0; i < canvas.width; i++) {
                const amplitude = volume * 50; // Scale volume
                const frequency = 0.1;
                const y = centerY + Math.sin(i * frequency + Date.now() * 0.01) * amplitude * Math.sin(i / canvas.width * Math.PI);
                ctx.lineTo(i, y);
            }

            ctx.strokeStyle = "#4ade80"; // Green-400
            ctx.lineWidth = 2;
            ctx.stroke();

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationId);
    }, [isOpen, volume]);

    if (!isAuthenticated) return null;

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
                        >
                            <Mic className="h-6 w-6 text-primary-foreground" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-muted/30">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="font-semibold text-foreground">Pharma Guru Live</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    disconnect();
                                    setIsOpen(false);
                                }}
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] space-y-6 relative">

                            {/* Mascot */}
                            <div className="relative w-32 h-32">
                                <PharmaBotMascot />
                                {state === "speaking" && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-center gap-1">
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-150"></span>
                                    </div>
                                )}
                            </div>

                            {/* Status Text */}
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-medium text-foreground">
                                    {state === "disconnected" && "Ready to Chat"}
                                    {state === "connecting" && "Connecting..."}
                                    {state === "connected" && "Connected"}
                                    {state === "listening" && "Listening..."}
                                    {state === "speaking" && "Speaking..."}
                                    {state === "error" && "Error"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {error ? error : "Tap the microphone to start talking"}
                                </p>
                            </div>

                            {/* Visualizer */}
                            <div className="w-full h-16 bg-muted/20 rounded-xl overflow-hidden relative flex items-center justify-center">
                                {state === "listening" || state === "speaking" ? (
                                    <canvas ref={canvasRef} width={300} height={64} className="w-full h-full" />
                                ) : (
                                    <div className="h-[1px] w-full bg-primary/20"></div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex gap-4">
                                {state === "disconnected" || state === "error" ? (
                                    <Button
                                        onClick={connect}
                                        size="lg"
                                        className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                    >
                                        <Mic className="h-6 w-6" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={disconnect}
                                        size="lg"
                                        variant="destructive"
                                        className="rounded-full w-16 h-16 shadow-lg transition-all hover:scale-105"
                                    >
                                        <StopCircle className="h-8 w-8" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
