"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AboutHeroProps {
    heading: string;
    subtitle: string;
}

export function AboutHero({ heading, subtitle }: AboutHeroProps) {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Pharmacy Hero Background */}
            <div className="absolute inset-0 w-full h-full">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700" />

                {/* Enhanced Grid Overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.15) 2px, transparent 2px),
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
                    backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                    backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px'
                }} />

                {/* Interactive Grid Glow */}
                <div
                    className="absolute inset-0 opacity-30 transition-all duration-300 ease-out pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.4), rgba(6, 182, 212, 0.2) 40%, transparent 70%)`
                    }}
                />

                {/* Floating Circles */}
                <div className="absolute w-96 h-96 rounded-full opacity-10 blur-sm -top-24 -right-24" style={{ background: 'linear-gradient(135deg, #34d399, #14b8a6)', animation: 'floatRotate 25s ease-in-out infinite' }} />
                <div className="absolute w-72 h-72 rounded-full opacity-10 blur-sm -bottom-20 -left-20" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', animation: 'floatRotate 20s ease-in-out infinite reverse', animationDelay: '-5s' }} />

                {/* DNA Strands */}
                <div className="absolute w-20 h-52 opacity-15 top-[20%] right-[5%]" style={{ background: `repeating-linear-gradient(45deg, #06b6d4, #06b6d4 10px, transparent 10px, transparent 20px, #0891b2 20px, #0891b2 30px, transparent 30px, transparent 40px)`, animation: 'dnaRotate 20s linear infinite' }} />
                <div className="absolute w-20 h-52 opacity-15 bottom-[15%] left-[5%]" style={{ background: `repeating-linear-gradient(-45deg, #10b981, #10b981 10px, transparent 10px, transparent 20px, #059669 20px, #059669 30px, transparent 30px, transparent 40px)`, animation: 'dnaRotate 18s linear infinite reverse' }} />

                {/* Wave Bottom Border */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg className="relative block w-full h-[60px]" style={{ transform: 'scaleY(-1)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 w-full relative z-20 text-center pt-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                        {heading}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
