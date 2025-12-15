"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Globe, MessageCircle, Share2 } from "lucide-react";

interface ThreadsHeroProps {
    heading?: string;
    subtitle?: string;
    compact?: boolean;
    className?: string;
}

interface Particle {
    id: number;
    top: number;
    left: number;
    rotation: number;
    duration: number;
    Icon: React.ComponentType<{ className?: string }>;
}

export function ThreadsHero({
    heading = "Community Discussions",
    subtitle,
    compact = false,
    className = ""
}: ThreadsHeroProps) {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate particles on client-side only to avoid hydration mismatch
    useEffect(() => {
        const icons = [MessageSquare, Users, Globe, MessageCircle, Share2];
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            top: Math.random() * 80 + 10,
            left: Math.random() * 80 + 10,
            rotation: Math.random() * 360,
            duration: 15 + Math.random() * 15,
            Icon: icons[Math.floor(Math.random() * icons.length)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <section className={`relative ${compact ? "h-[200px] md:h-[300px]" : "h-[300px] md:h-[500px]"} flex items-center overflow-hidden ${className}`}>
            {/* Background */}
            <div className="absolute inset-0 w-full h-full">
                {/* Gradient Background - Emerald/Teal Theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900" />

                {/* Grid Overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    backgroundPosition: 'center center'
                }} />

                {/* Interactive Glow */}
                <div
                    className="absolute inset-0 opacity-40 transition-all duration-300 ease-out pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.3), transparent 60%)`
                    }}
                />

                {/* Floating Elements - Community Theme */}
                <div className="absolute w-64 h-64 rounded-full opacity-10 blur-xl top-10 right-10 bg-emerald-500 animate-pulse" />
                <div className="absolute w-48 h-48 rounded-full opacity-10 blur-xl bottom-10 left-10 bg-teal-500 animate-pulse delay-700" />

                {/* Animated Particles/Icons */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute text-white/10"
                        style={{
                            top: `${particle.top}%`,
                            left: `${particle.left}%`,
                            transform: `rotate(${particle.rotation}deg)`,
                            animation: `float-particle ${particle.duration}s infinite linear`
                        }}
                    >
                        <particle.Icon className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                ))}

                {/* Wave Bottom Border */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg className="relative block w-full h-[60px]" style={{ transform: 'scaleY(-1)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 w-full relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={`${compact ? "text-2xl md:text-5xl" : "text-xl md:text-6xl"} font-bold mb-2 md:mb-6 leading-tight text-white drop-shadow-lg line-clamp-2`}>
                        {heading}
                    </h1>
                    {subtitle && (
                        <p className="text-sm md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-light mb-4 md:mb-8">
                            {subtitle}
                        </p>
                    )}

                    {!compact && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="hidden md:flex flex-wrap justify-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                                <MessageSquare className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-emerald-200">Active Discussions</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-sm">
                                <Users className="w-4 h-4 text-teal-400" />
                                <span className="text-sm text-teal-200">Expert Community</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                                <Globe className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm text-cyan-200">Global Reach</span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
