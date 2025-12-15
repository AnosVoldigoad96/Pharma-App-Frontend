"use client";

import { useState, useEffect } from "react";

export function AuthHeroBackground() {
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
        <div className="absolute inset-0 w-full h-full overflow-hidden">
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


        </div>
    );
}
