"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, MessageSquare, TrendingUp, Eye, ThumbsUp } from "lucide-react";
import type { Thread } from "@/lib/supabase/types";

interface ThreadsCarouselProps {
    threads: Thread[];
}

export function ThreadsCarousel({ threads }: ThreadsCarouselProps) {
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
                        {threads.map((thread, index) => (
                            <div
                                key={thread.id}
                                className="flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                                }}
                            >
                                <Link href={`/threads/${thread.slug}`} className="group block h-full">
                                    <Card className="h-full transition-all duration-500 border border-border/50 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
                                        <CardHeader className="space-y-4">
                                            {/* Icon and Label */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-xl bg-primary/15 backdrop-blur-sm text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-lg">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Discussion</span>
                                                        {thread.view_count > 100 && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <TrendingUp className="w-3 h-3 text-orange-500" />
                                                                <span className="text-[10px] font-medium text-orange-500">Trending</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors min-h-[56px] line-clamp-2">
                                                {thread.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Description */}
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[42px]">
                                                {thread.content}
                                            </p>

                                            {/* Footer with Author and Stats */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    by {thread.author_name || 'Anonymous'}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
                                                        <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">{thread.like_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
                                                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">{thread.view_count || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
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
                <Link href="/threads">
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
