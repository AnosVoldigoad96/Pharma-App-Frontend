"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vortex } from "@/components/ui/vortex";

interface HeroSectionProps {
  heroHeading: string;
  heroSubtitle: string;
  heroImage: string | null;
}

export function HeroSection({ heroHeading, heroSubtitle, heroImage }: HeroSectionProps) {
  // Use Vortex background instead of image
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden bg-black">
      <Vortex
        className="flex items-center justify-center"
        containerClassName="absolute inset-0"
        particleCount={700}
        rangeY={100}
        baseHue={260}
        baseSpeed={0.0}
        rangeSpeed={1.5}
        baseRadius={1}
        rangeRadius={2}
        backgroundColor="#000000"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
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
      </Vortex>
    </section>
  );
}

