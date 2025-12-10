"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LiquidEther from "@/components/LiquidEther";
import { HeroChat } from "@/components/hero-chat";

interface HeroSectionProps {
  heroHeading: string;
  heroSubtitle: string;
  heroImage: string | null;
}

export function HeroSection({ heroHeading, heroSubtitle, heroImage }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-black">
      {/* LiquidEther Background */}
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

      {/* Two-Column Content */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-20 pointer-events-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column (1/2) - Hero Content */}
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl leading-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                {heroHeading}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mb-10 leading-relaxed drop-shadow-lg">
                {heroSubtitle}
              </p>
              <div className="flex flex-row items-center lg:items-start gap-4">
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

            {/* Right Column (1/2) - Chat Interface */}
            <div className="hidden lg:flex flex-col justify-center">
              <HeroChat />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
