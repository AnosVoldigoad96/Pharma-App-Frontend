"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

// Placeholder for Lottie JSONs - Replace these with actual imports when available
import libraryAnimation from "@/public/lottie/library.json";
import aiAnimation from "@/public/lottie/ai.json";
import clinicalAnimation from "@/public/lottie/clinical.json";
import communityAnimation from "@/public/lottie/community.json";

const features = [
  {
    id: 1,
    title: "Comprehensive Library",
    description: "Access extensive pharmaceutical literature, drug information, and clinical guidelines all in one place.",
    lottieAnimation: libraryAnimation,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AI Assistant",
    description: "Get instant answers to your pharmaceutical questions with our intelligent chatbot powered by advanced AI.",
    lottieAnimation: aiAnimation,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Clinical Tools",
    description: "Calculate drug dosages, check interactions, and access essential pharmaceutical calculators.",
    lottieAnimation: clinicalAnimation,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Global Community",
    description: "Connect with pharmacists worldwide, share knowledge, discuss cases, and grow your professional network.",
    lottieAnimation: communityAnimation,
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Everything You Need for Pharmaceutical Excellence
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Powerful tools and resources designed specifically for pharmaceutical professionals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`col-start-1 row-start-1 md:col-auto md:row-auto flex md:block h-full items-center gap-4 ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'
                } ${index === activeIndex
                  ? 'opacity-100 z-10 scale-100'
                  : 'opacity-0 z-0 pointer-events-none scale-95 md:opacity-100 md:pointer-events-auto md:scale-100'
                } transition-all duration-700 ease-in-out md:transition-none ${isVisible ? 'md:animate-fade-in-up' : 'opacity-0 md:!opacity-0'}`}
              style={{
                animationDelay: isVisible ? `${index * 250 + 300}ms` : '0ms',
                animationFillMode: 'both'
              }}
            >
              {/* Card Container */}
              <div className="group relative w-full h-full flex flex-col p-6 transition-all duration-500 hover:-translate-y-2 cursor-pointer mt-8 md:mt-0">
                {/* Card Background & Effects Container - CLIPS OVERFLOW */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-white/30 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-md border border-gray-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/50">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none" />

                  {/* Subtle Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                </div>

                {/* Lottie - Absolute Overlay that grows UPWARDS (Outside clipped container) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 z-50 transition-all duration-500 ease-out group-hover:scale-110 origin-bottom pointer-events-none">
                  {feature.lottieAnimation ? (
                    <Lottie animationData={feature.lottieAnimation} loop={true} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Spacer to maintain layout since mascot is absolute */}
                <div className="h-14 mb-4 w-10 relative z-10" />

                {/* Content - Left aligned */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors relative z-10 flex-grow">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
