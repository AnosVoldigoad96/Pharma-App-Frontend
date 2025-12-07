"use client";

import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import type { Feature } from "@/lib/supabase/types";

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  if (!features || features.length === 0) {
    return null;
  }

  const content = features.map((feature) => ({
    title: feature.title,
    description: feature.description,
    content: feature.image ? (
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-primary/20">
        <p className="text-sm text-muted-foreground">No image available</p>
      </div>
    ),
  }));

  return (
    <section className="bg-background">
      <StickyScroll
        content={content}
        headerTitle="Our Features"
        headerDescription="Discover what makes ePharmatica the leading pharmaceutical knowledge platform"
      />
    </section>
  );
}

