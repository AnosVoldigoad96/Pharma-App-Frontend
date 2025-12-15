"use client";
"use client";

import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Book, Chatbot } from "@/lib/supabase/types";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group relative block rounded-lg transition-all duration-500 bg-background/40 backdrop-blur-xl border border-border/50 lg:hover:bg-background/60 lg:hover:border-primary/50 lg:hover:shadow-2xl lg:hover:shadow-primary/10 lg:hover:-translate-y-2">
      <GlowingEffect
        disabled={false}
        spread={30}
        proximity={50}
        variant="default"
        glow={true}
        blur={0}
        borderWidth={1}
      />
      <div className="relative z-10 rounded-lg overflow-hidden">
        <Link href={`/books/${book.slug || book.id}`}>
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            {book.cover_image ? (
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 lg:group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 backdrop-blur-sm flex items-center justify-center">
                <span className="text-muted-foreground text-xs md:text-base">No Cover</span>
              </div>
            )}

            {/* AI Icon in top right */}
            {book.ai_chat_enabled && (
              <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/60 backdrop-blur-md p-1 md:p-1.5 rounded-full text-white shadow-lg border border-white/20 z-20">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
            )}
          </div>
        </Link>
        <div className="p-2 md:p-4">
          <Link href={`/books/${book.slug || book.id}`}>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 lg:group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {book.title}
            </h3>
          </Link>
          {book.author && (
            <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 line-clamp-1">
              By {book.author}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
