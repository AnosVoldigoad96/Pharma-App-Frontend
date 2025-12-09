"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LiquidEther from "@/components/LiquidEther";

interface HeroSectionProps {
  heroHeading: string;
  heroSubtitle: string;
  heroImage: string | null;
}

export function HeroSection({ heroHeading, heroSubtitle, heroImage }: HeroSectionProps) {
  // Use LiquidEther background instead of Vortex
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther
          colors={['#3ECF8E', '#10B981', '#059669']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20 pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
            {heroHeading}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 h-14 rounded-md bg-white text-primary hover:bg-white/90 border-2 border-white/30">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg" className="text-lg px-8 h-14 bg-white/30 backdrop-blur-sm hover:bg-white/40 rounded-md text-white border-2 border-white/40">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

