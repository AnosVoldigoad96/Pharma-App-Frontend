"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Book } from "@/lib/supabase/types";

interface BooksCarouselProps {
  books: Book[];
}

export function BooksCarousel({ books }: BooksCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
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
          <div className="flex gap-4 md:gap-6">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <Link href={`/books/${book.id}`} className="group block h-full">
                  <Card className="h-full transition-all duration-500 border border-border/50 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 overflow-hidden">
                    {/* Book Cover & Info Overlay */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 backdrop-blur-sm flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary/40" />
                        </div>
                      )}

                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          {/* Tags - Staggered Reveal 1 */}
                          {book.tags && (
                            <div className="flex flex-wrap gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-2 group-hover:translate-y-0">
                              {book.tags.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-medium border border-white/30 hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-300 cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title - Staggered Reveal 2 */}
                          <h3 className="text-white font-bold leading-tight line-clamp-2 mb-1 text-base group-hover:!text-primary transition-colors duration-300">
                            {book.title}
                          </h3>

                          {/* Author - Staggered Reveal 3 */}
                          {book.author && (
                            <p className="text-white/80 text-xs line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                              By {book.author}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </div>
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
        <Link href="/books">
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
