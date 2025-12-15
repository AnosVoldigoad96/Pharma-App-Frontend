"use client";

import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Tool } from "@/lib/supabase/types";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const toolUrl = tool.slug ? `/tools/${tool.slug}` : null;

  if (!toolUrl) {
    return (
      <div className="group relative block rounded-lg transition-all duration-500 bg-background/40 backdrop-blur-xl border border-border/50 h-full flex flex-col opacity-50">
        <div className="relative z-10 rounded-lg overflow-hidden h-full flex flex-col">
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{tool.title}</h3>
            {tool.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
                {tool.description}
              </p>
            )}
            <div className="mt-auto">
              <div className="text-xs text-muted-foreground text-center py-2">
                Tool not available (missing slug)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative block rounded-lg transition-all duration-500 bg-background/40 backdrop-blur-xl border border-border/50 lg:hover:bg-background/60 lg:hover:border-primary/50 lg:hover:shadow-2xl lg:hover:shadow-primary/10 lg:hover:-translate-y-2 h-full flex flex-col">
      <GlowingEffect
        disabled={false}
        spread={30}
        proximity={50}
        variant="default"
        glow={true}
        blur={0}
        borderWidth={1}
      />
      <div className="relative z-10 rounded-lg overflow-hidden h-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <Link href={toolUrl} className="relative z-20 block">
            <h3 className="text-lg font-semibold mb-2 lg:group-hover:text-primary transition-colors line-clamp-2">
              {tool.title}
            </h3>
          </Link>
          {tool.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
              {tool.description}
            </p>
          )}
          {!tool.description && <div className="flex-grow" />}
          <div className="mt-auto space-y-3">
            {tool.category && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs bg-primary/15 backdrop-blur-sm px-2 py-1 rounded-full border border-primary/30 text-primary font-medium">
                  {tool.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

