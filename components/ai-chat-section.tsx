"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PharmaBotMascot } from "@/components/pharma-bot-mascot";
import { PharmaAIChat } from "@/components/pharma-ai-chat";

export function AiChatSection() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative py-20 overflow-hidden min-h-[600px] flex items-center justify-center bg-primary text-primary-foreground transition-colors duration-300 mask-zigzag">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '48px 48px',
                    animation: 'moveBackground 20s linear infinite'
                }}></div>
            </div>

            {/* Gradient overlays with blur */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* --- Background Particles --- */}
            {mounted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={`particle-${i}`}
                            className="absolute rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                            style={{
                                width: `${Math.random() * 12 + 6}px`,
                                height: `${Math.random() * 12 + 6}px`,
                                left: `${i * 7}%`,
                                animation: `float-particle ${10 + Math.random() * 5}s infinite ${Math.random() * 5}s`,
                            }}
                        ></div>
                    ))}
                </div>
            )}

            {/* --- DNA Helix Background --- */}
            <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 w-[80px] h-[360px] opacity-60 md:opacity-80 z-0 hidden sm:block">
                <div className="absolute w-full h-full animate-[dna-rotate_4s_linear_infinite]">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={`dna-${i}`}
                            className="absolute w-4 h-4 rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            style={{
                                top: `${i * 10}%`,
                                animation: `dna-wave 2s ease-in-out infinite ${i * 0.2}s`,
                                background: "rgba(255,255,255,0.5)",
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* --- Molecule Decoration --- */}
            <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 opacity-60 md:opacity-80 z-0 hidden sm:block">
                <div className="relative w-[120px] h-[120px] animate-[molecule-rotate_10s_linear_infinite]">
                    <div className="absolute w-6 h-6 bg-gradient-to-br from-white to-white/80 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] top-0 left-[48px]"></div>
                    <div className="absolute w-6 h-6 bg-gradient-to-br from-white to-white/80 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] top-[48px] left-0"></div>
                    <div className="absolute w-6 h-6 bg-gradient-to-br from-white to-white/80 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] top-[48px] right-0"></div>
                    <div className="absolute w-6 h-6 bg-gradient-to-br from-white to-white/80 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] bottom-0 left-[48px]"></div>

                    {/* Bonds */}
                    <div className="absolute bg-white/40 h-[4px] w-[55px] top-[12px] left-[12px] rotate-45"></div>
                    <div className="absolute bg-white/40 h-[4px] w-[55px] top-[12px] right-[12px] -rotate-45"></div>
                    <div className="absolute bg-white/40 h-[4px] w-[55px] bottom-[12px] left-[12px] -rotate-45"></div>
                    <div className="absolute bg-white/40 h-[4px] w-[55px] bottom-[12px] right-[12px] rotate-45"></div>
                </div>
            </div>

            {/* --- Plus Symbols Floating --- */}
            {mounted && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={`plus-${i}`}
                            className="absolute text-3xl font-bold text-white/20 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                animation: `plus-float 6s ease-in-out infinite ${i * 1}s`,
                            }}
                        >
                            +
                        </div>
                    ))}
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Mascot */}
                    <div className="hidden lg:flex justify-center lg:justify-center order-2 lg:order-1">
                        <PharmaBotMascot />
                    </div>

                    {/* Right Side - Chat Interface */}
                    <div className="flex justify-center lg:justify-start order-1 lg:order-2 w-full h-[500px]">
                        <PharmaAIChat />
                    </div>
                </div>
            </div>
        </section>
    );
}
