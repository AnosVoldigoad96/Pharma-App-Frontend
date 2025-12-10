"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";
import type { Blog } from "@/lib/supabase/types";

interface ArticlesCarouselProps {
  articles: Blog[];
}

export function ArticlesCarousel({ articles }: ArticlesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Desktop Navigation Arrows (Hidden on Mobile) */}
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background hover:border-primary/50 shadow-lg -translate-x-1/2"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background hover:border-primary/50 shadow-lg translate-x-1/2"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Carousel */}
        <div className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={emblaRef}>
          <div className="flex gap-6 md:gap-8">
            {articles.map((blog, index) => (
              <div
                key={blog.id}
                className="flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                  <Card className="h-full transition-all duration-500 border border-border/50 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden">
                    {/* Article Info */}
                    <CardHeader className="space-y-4">
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        {blog.author?.avatar_url ? (
                          <img
                            src={blog.author.avatar_url}
                            alt={blog.author.full_name || 'Author'}
                            className="w-10 h-10 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-sm font-semibold text-primary">
                              {blog.author?.full_name ? blog.author.full_name.charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {blog.author?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>5 min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[56px]">
                        {blog.title}
                      </CardTitle>

                      {/* Subtitle */}
                      <div className="min-h-[48px]">
                        {blog.subtitle && (
                          <CardDescription className="text-sm line-clamp-2">
                            {blog.subtitle}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>

                    {/* Excerpt */}
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed min-h-[63px]">
                        {blog.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Controls (Below Carousel) */}
      <div className="flex md:hidden items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background hover:border-primary/50 shadow-lg"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Link href="/blogs">
          <Button variant="ghost" size="lg" className="group backdrop-blur-sm bg-background/50 border border-border/50">
            View All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background hover:border-primary/50 shadow-lg"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
