"use client";

import { BookOpen, MessageSquare, Calculator } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Comprehensive Library",
    description: "Access extensive pharmaceutical literature, drug information, and clinical guidelines all in one place.",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AI Assistant",
    description: "Get instant answers to your pharmaceutical questions with our intelligent chatbot powered by advanced AI.",
    icon: MessageSquare,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Clinical Tools",
    description: "Calculate drug dosages, check interactions, and access essential pharmaceutical calculators.",
    icon: Calculator,
    gradient: "from-orange-500 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Pharmaceutical Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and resources designed specifically for pharmaceutical professionals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-background/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Icon Background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6`}>
                <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
