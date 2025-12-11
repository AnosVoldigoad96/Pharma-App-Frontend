"use client";

import React from "react";

export function PharmaBotMascot() {
    return (
        <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-90 origin-center">
            <div className="mascot-container">
                <div className="holo-ring"></div>

                <div className="molecule" style={{ animationDelay: '0s' }}>
                    <div className="molecule-core"></div>
                </div>
                <div className="molecule" style={{ animationDelay: '-4s', animationDuration: '10s' }}>
                    <div className="molecule-core" style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}></div>
                </div>
                <div className="molecule" style={{ animationDelay: '-2s', animationDuration: '12s' }}>
                    <div className="molecule-core" style={{ background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', width: '8px', height: '8px' }}></div>
                </div>

                <div className="pill-body">
                    <div className="pill-visor"></div>

                    <div className="pill-eye left"></div>
                    <div className="pill-eye right"></div>

                    <div className="pill-core"></div>

                    <div className="circuit-line h1"></div>
                    <div className="circuit-line h2"></div>
                    <div className="circuit-line v1"></div>
                    <div className="circuit-dot" style={{ bottom: '28px', left: '33px' }}></div>
                    <div className="circuit-dot" style={{ bottom: '38px', right: '28px', animationDelay: '0.5s' }}></div>
                    <div className="circuit-dot" style={{ bottom: '43px', left: '61px', animationDelay: '1s' }}></div>
                </div>

                <div className="data-stream" style={{ left: '30px', top: '100px', animationDelay: '0s' }}></div>
                <div className="data-stream" style={{ left: '45px', top: '120px', animationDelay: '0.3s' }}></div>
                <div className="data-stream" style={{ right: '30px', top: '100px', animationDelay: '0.6s' }}></div>
                <div className="data-stream" style={{ right: '45px', top: '120px', animationDelay: '0.9s' }}></div>
            </div>
        </div>
    );
}
