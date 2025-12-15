"use client";

import React from "react";
import { Quote } from "lucide-react";

interface QuoteSectionProps {
    quote?: string;
    author?: string;
}

export function QuoteSection({
    quote = "Wherever the art of Medicine is loved, there is also a love of Humanity.",
    author = "Hippocrates"
}: QuoteSectionProps) {
    return (
        <section className="relative py-20 overflow-hidden min-h-[400px] flex items-center justify-center bg-primary text-primary-foreground mask-zigzag">
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

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Quote className="w-8 h-8 text-white" />
                    </div>
                </div>

                <blockquote className="text-2xl md:text-4xl font-serif italic leading-relaxed mb-8 text-white/90 drop-shadow-md">
                    "{quote}"
                </blockquote>

                <cite className="text-lg md:text-xl font-medium text-white/80 not-italic">
                    — {author}
                </cite>
            </div>
        </section>
    );
}
