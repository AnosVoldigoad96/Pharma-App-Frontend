"use client";

import { useEffect, useRef, useState } from "react";

// Shared styles for 3D capsule effect
const capsuleBaseStyle = {
  boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1), inset 5px 5px 10px rgba(255,255,255,0.2), 0 10px 15px rgba(0,0,0,0.15)',
};

const eyeStyle = {
  boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)',
};

// Mascot Components - Pure presentation (no hover logic inside)
const LibraryMascot = () => (
  <div className="relative w-10 h-14">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full overflow-hidden" style={capsuleBaseStyle}>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-8 h-6 z-20">
        <div className="absolute top-1.5 left-0 w-full flex justify-between px-0.5">
          <div className="w-2.5 h-2.5 border-[1px] border-white rounded-full bg-white/10 backdrop-blur-sm relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-black rounded-full animate-pulse"></div>
          </div>
          <div className="w-1 h-0.5 bg-white mt-1"></div>
          <div className="w-2.5 h-2.5 border-[1px] border-white rounded-full bg-white/10 backdrop-blur-sm relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-black rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 border-b-[1px] border-white rounded-full"></div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5 w-8 h-6 bg-amber-100 rounded-t-lg border-t-[1.5px] border-amber-800 z-30 flex justify-center shadow-sm">
        <div className="w-px h-full bg-amber-200/50"></div>
      </div>
    </div>
  </div>
);

const AIMascot = () => (
  <div className="relative w-10 h-14">
    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-gray-400"></div>
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_4px_rgba(239,68,68,0.8)] animate-pulse"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 rounded-full overflow-hidden border-[1.5px] border-slate-300" style={capsuleBaseStyle}>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-600">
        <div className="flex gap-1">
          <div className="w-2 h-1 bg-cyan-400 rounded-full shadow-[0_0_3px_#22d3ee] animate-pulse"></div>
          <div className="w-2 h-1 bg-cyan-400 rounded-full shadow-[0_0_3px_#22d3ee] animate-pulse"></div>
        </div>
      </div>
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-5 h-5 bg-white/30 rounded-full border border-white/50 flex items-center justify-center">
        <div className="w-3 h-3 border-[1px] border-cyan-400/50 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  </div>
);

const ClinicalMascot = () => (
  <div className="relative w-10 h-14">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-50 rounded-full overflow-hidden border border-emerald-100" style={capsuleBaseStyle}>
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gradient-to-tr from-gray-300 to-white rounded-full border-[1px] border-gray-300 shadow-sm z-30">
        <div className="absolute inset-0.5 rounded-full bg-gray-200/50"></div>
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-800 rounded-full z-20"></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full flex justify-center gap-1">
        <div className="w-1 h-1.5 bg-slate-800 rounded-full" style={eyeStyle}></div>
        <div className="w-1 h-1.5 bg-slate-800 rounded-full" style={eyeStyle}></div>
      </div>
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-5 h-2.5 bg-emerald-200 rounded-b-lg border-t border-emerald-300/50 opacity-80"></div>
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-6 h-8 border-[1px] border-slate-700 rounded-full z-30 rounded-t-none border-t-0"></div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-300 rounded-full border-[1.5px] border-slate-400 shadow-sm z-40"></div>
    </div>
  </div>
);

const CommunityMascot = () => (
  <div className="relative w-10 h-14">
    <div className="absolute top-4 -right-1.5 w-2.5 h-8 bg-orange-300 rounded-full border-[1px] border-orange-400 origin-bottom-left group-hover:rotate-12 transition-transform duration-300 z-0">
      <div className="absolute top-0 w-full h-2 bg-orange-200 rounded-full opacity-50"></div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-amber-300 to-orange-400 rounded-full overflow-hidden z-10" style={capsuleBaseStyle}>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
        <div className="flex gap-1.5 mb-1">
          <div className="w-1 h-1 border-t-[1.5px] border-amber-900 rounded-full"></div>
          <div className="w-1 h-1 border-t-[1.5px] border-amber-900 rounded-full"></div>
        </div>
        <div className="w-3 h-1.5 border-b-[1.5px] border-amber-900 rounded-full"></div>
        <div className="absolute top-1 -left-0.5 w-1 h-1 bg-pink-400/40 blur-sm rounded-full"></div>
        <div className="absolute top-1 -right-0.5 w-1 h-1 bg-pink-400/40 blur-sm rounded-full"></div>
      </div>
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2">
        <div className="relative w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-rose-500 group-hover:scale-110 transition-transform">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const features = [
  {
    id: 1,
    title: "Comprehensive Library",
    description: "Access extensive pharmaceutical literature, drug information, and clinical guidelines all in one place.",
    Mascot: LibraryMascot,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AI Assistant",
    description: "Get instant answers to your pharmaceutical questions with our intelligent chatbot powered by advanced AI.",
    Mascot: AIMascot,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Clinical Tools",
    description: "Calculate drug dosages, check interactions, and access essential pharmaceutical calculators.",
    Mascot: ClinicalMascot,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Global Community",
    description: "Connect with pharmacists worldwide, share knowledge, discuss cases, and grow your professional network.",
    Mascot: CommunityMascot,
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
              {/* Mobile Mascot - Outside card, no growth */}
              <div className="md:hidden shrink-0">
                <feature.Mascot />
              </div>

              {/* Card Container */}
              <div className="group relative w-full h-full flex flex-col p-6 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                {/* Card Background & Effects Container - CLIPS OVERFLOW */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-white/30 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-md border border-gray-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/50">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none" />

                  {/* Subtle Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                </div>

                {/* Desktop Mascot - Absolute Overlay that grows UPWARDS (Outside clipped container) */}
                <div className="hidden md:block absolute top-6 left-6 z-50 transition-all duration-500 ease-out group-hover:scale-[2.5] group-hover:-translate-y-3 origin-bottom pointer-events-none">
                  <feature.Mascot />
                </div>

                {/* Spacer to maintain layout since mascot is absolute (Desktop only) */}
                <div className="hidden md:block h-14 mb-4 w-10 relative z-10" />

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
