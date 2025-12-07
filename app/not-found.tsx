"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Check if video files exist after component mounts
    const checkVideo = () => {
      const video = document.querySelector("video");
      if (video) {
        video.addEventListener("error", () => {
          setVideoError(true);
        });
      }
    };
    checkVideo();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-primary text-primary-foreground -mt-16 pt-16">
      {/* LAYER 1: The Animated Background 
         - We use a CSS radial-gradient pattern here (dots).
         - The 'animate-sliding-bg' makes the dots move.
      */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="h-full w-full animate-sliding-bg"
          style={{
            backgroundImage: "radial-gradient(currentColor 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* LAYER 2: Your Custom Mascot Video */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* The Video Container */}
        <div className="relative mb-6 h-64 w-64 md:h-96 md:w-96 flex items-center justify-center">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain pointer-events-none drop-shadow-2xl"
              style={{ 
                backgroundColor: 'transparent',
              }}
              onError={() => setVideoError(true)}
            >
              {/* Prioritize HEVC for Safari if you have it */}
              <source src="/mascot-safari.mov" type='video/mp4; codecs="hvc1"' />
              {/* WebM for Chrome/Firefox */}
              <source src="/mascot-chrome.webm" type="video/webm" />
              {/* Fallback for browsers that don't support transparent video */}
              <source src="/mascot-fallback.mp4" type="video/mp4" />
            </video>
          ) : (
            // Placeholder when video is not available
            <div className="h-full w-full flex items-center justify-center bg-primary-foreground/10 rounded-lg border-2 border-dashed border-primary-foreground/30">
              <div className="text-center">
                <div className="text-6xl mb-2">🔍</div>
                <p className="text-sm text-primary-foreground/60">
                  Add mascot video
                </p>
              </div>
            </div>
          )}
        </div>

        <h1 className="mb-2 text-5xl font-black tracking-tight md:text-7xl">
          404
        </h1>
        <p className="mb-8 max-w-md text-lg text-primary-foreground/80">
          I looked everywhere, but I couldn&apos;t find that page!
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary-foreground px-8 py-3 font-bold text-primary transition hover:bg-primary-foreground/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          Back to Safety
        </Link>
      </div>
    </div>
  );
}

