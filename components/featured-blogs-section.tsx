"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticlesCarousel } from "@/components/articles-carousel";
import type { Blog } from "@/lib/supabase/types";

interface FeaturedBlogsSectionProps {
    blogs: Blog[];
}

export function FeaturedBlogsSection({ blogs }: FeaturedBlogsSectionProps) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="pt-14 pb-8 md:pt-20 md:pb-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                    <div className="space-y-3">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                                Latest Articles
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            Insights and updates from the pharmaceutical world
                        </p>
                    </div>
                    <Link href="/blogs" className="hidden md:block">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="group text-base backdrop-blur-sm bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all"
                        >
                            View All
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Articles Carousel */}
                <ArticlesCarousel articles={blogs} />
            </div>
        </section>
    );
}
