"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, TrendingUp, ThumbsUp, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Thread, Blog } from "@/lib/supabase/types";
import { ThreadsCarousel } from "@/components/threads-carousel";
import { ArticlesCarousel } from "@/components/articles-carousel";

interface CommunityHubSectionProps {
    threads: Thread[];
    blogs: Blog[];
}

export function CommunityHubSection({ threads, blogs }: CommunityHubSectionProps) {
    // Desktop Carousel Logic
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Chunk threads into pairs for the desktop vertical layout
    const threadPairs = [];
    for (let i = 0; i < threads.length; i += 2) {
        threadPairs.push(threads.slice(i, i + 2));
    }

    // Scroll Animation Logic
    const [isVisible, setIsVisible] = useState(false);
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

    return (
        <>
            {/* Mobile Layout (< lg) - Separate Sections */}
            <div className="lg:hidden">
                {/* Latest Articles Section */}
                {blogs.length > 0 && (
                    <section className="py-10 relative">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="space-y-3">
                                    <div className="inline-block">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                                            Latest Articles
                                        </h2>
                                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                                    </div>
                                    <p className="text-base text-muted-foreground">
                                        Insights and updates from the pharmaceutical world
                                    </p>
                                </div>
                            </div>
                            <ArticlesCarousel articles={blogs} />
                        </div>
                    </section>
                )}

                {/* Community Discussions Section */}
                {threads.length > 0 && (
                    <section className="py-10 relative">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="space-y-3">
                                    <div className="inline-block">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                                            Community Discussions
                                        </h2>
                                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                                    </div>
                                    <p className="text-base text-muted-foreground">
                                        Join thousands of professionals in meaningful conversations
                                    </p>
                                </div>
                            </div>
                            <ThreadsCarousel threads={threads} />
                        </div>
                    </section>
                )}
            </div>

            {/* Desktop Layout (>= lg) - Combined Hub */}
            <section ref={sectionRef} className="hidden lg:block py-14 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-3 gap-12">

                        {/* Left Column: Community Discussions (2/3 width) */}
                        <div
                            className={`col-span-2 space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                        >
                            <div className="flex items-end justify-between gap-4 h-24">
                                <div className="space-y-3 flex-1">
                                    <div className="inline-block">
                                        <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                                            Community Discussions
                                        </h2>
                                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                                    </div>
                                    <p className="text-lg text-muted-foreground max-w-xl line-clamp-2 min-h-[3.5rem]">
                                        Join thousands of professionals in meaningful conversations
                                    </p>
                                </div>

                                {/* View All Link */}
                                <div className="pb-1">
                                    <Link href="/threads">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="group text-sm backdrop-blur-sm bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all"
                                        >
                                            View All
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Carousel of Pairs */}
                            <div className="space-y-6">
                                <div className="overflow-hidden" ref={emblaRef}>
                                    <div className="flex">
                                        {threadPairs.map((pair, index) => (
                                            <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0">
                                                <div className="grid grid-rows-2 gap-6 h-full">
                                                    {pair.map((thread) => (
                                                        <Link key={thread.id} href={`/threads/${thread.slug}`} className="block group h-full">
                                                            <Card className="h-full transition-all duration-500 border border-border/50 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                                                                <CardHeader>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                                                <MessageSquare className="w-4 h-4" />
                                                                            </div>
                                                                            <span className="text-sm font-medium text-primary">Discussion</span>
                                                                        </div>
                                                                        {thread.view_count > 100 && (
                                                                            <div className="flex items-center gap-1">
                                                                                <TrendingUp className="w-3 h-3 text-orange-500" />
                                                                                <span className="text-[10px] font-medium text-orange-500">Trending</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                                                                        {thread.title}
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
                                                                        {thread.content}
                                                                    </p>
                                                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                                        <span className="text-xs text-muted-foreground">by {thread.author_name || 'Anonymous'}</span>
                                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                            <div className="flex items-center gap-1">
                                                                                <ThumbsUp className="w-3 h-3" />
                                                                                <span>{thread.like_count || 0}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Eye className="w-3 h-3" />
                                                                                <span>{thread.view_count || 0}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                    {/* Placeholder if pair has only 1 item */}
                                                    {pair.length === 1 && (
                                                        <div className="h-full border border-dashed border-border/30 rounded-xl bg-background/20 flex items-center justify-center">
                                                            <p className="text-muted-foreground text-sm">More discussions coming soon</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Carousel Controls (Bottom) */}
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 transition-all"
                                        onClick={scrollPrev}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 transition-all"
                                        onClick={scrollNext}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Latest Articles (1/3 width) */}
                        <div
                            className={`col-span-1 space-y-8 transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                        >
                            <div className="flex items-end justify-between gap-4 h-24">
                                <div className="space-y-3 flex-1">
                                    <div className="inline-block">
                                        <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2 whitespace-nowrap">
                                            Latest Articles
                                        </h2>
                                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                                    </div>
                                    <p className="text-lg text-muted-foreground line-clamp-2 min-h-[3.5rem]">
                                        Insights from experts
                                    </p>
                                </div>

                                {/* View All Button Wrapper for Symmetry */}
                                <div className="flex items-center gap-2 pb-1">
                                    <Link href="/blogs">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="group text-sm backdrop-blur-sm bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all"
                                        >
                                            View All
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Vertical Animated List */}
                            <div className="relative h-[600px] overflow-hidden rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl shadow-inner">
                                {/* Gradient Masks for smooth fade in/out */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/90 to-transparent z-10 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/90 to-transparent z-10 pointer-events-none"></div>

                                <div className="absolute inset-0 py-4 animate-vertical-scroll hover:[animation-play-state:paused]">
                                    {/* Duplicate list for infinite scroll effect - Tripled for smoothness */}
                                    {[...blogs, ...blogs, ...blogs].map((blog, index) => (
                                        <Link key={`${blog.id}-${index}`} href={`/blogs/${blog.slug}`} className="block mb-4 px-4">
                                            <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20 bg-background/20">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0">
                                                    {blog.author?.avatar_url ? (
                                                        <img
                                                            src={blog.author.avatar_url}
                                                            alt={blog.author.full_name || 'Author'}
                                                            className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-colors shadow-sm">
                                                            <span className="text-xl font-semibold text-primary">
                                                                {blog.author?.full_name ? blog.author.full_name.charAt(0).toUpperCase() : 'A'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                                                        {blog.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                                        {blog.author?.full_name || 'Anonymous'}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
