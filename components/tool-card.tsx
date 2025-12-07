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
      <div className="group relative block rounded-md transition-all bg-card border-2 border-border h-full flex flex-col opacity-50">
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
    <div className="group relative block rounded-md transition-all bg-card border-2 border-border hover:border-primary/50 h-full flex flex-col">
      <GlowingEffect
        disabled={false}
        spread={30}
        proximity={50}
        variant="default"
        glow={true}
        blur={0}
        borderWidth={1}
      />
      <div className="relative z-10 rounded-md overflow-hidden h-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <Link href={toolUrl} className="relative z-20 block">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
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
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  {tool.category}
                </span>
              </div>
            )}
            <Link
              href={toolUrl}
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 border-2 border-primary/30 hover:border-primary/50 transition-all relative z-20 cursor-pointer"
            >
              Use Tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

