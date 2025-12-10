"use client";

import Link from "next/link";
import { MessageSquare, Eye, ThumbsUp, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Thread } from "@/lib/supabase/types";

interface ThreadCardProps {
    thread: Thread;
    index?: number;
}

export function ThreadCard({ thread, index = 0 }: ThreadCardProps) {
    return (
        <Link
            href={`/threads/${thread.slug}`}
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
            }}
        >
            <Card className="h-full transition-all duration-500 border border-border/50 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/50 group hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                <CardHeader className="space-y-4">
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
                        {thread.is_featured && (
                            <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded-full shadow-lg border border-primary/30">
                                Featured
                            </span>
                        )}
                    </div>
                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{thread.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{thread.content}</p>

                    {/* Tags */}
                    {thread.tags && thread.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {thread.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-primary/15 backdrop-blur-sm text-primary px-3 py-1 rounded-full border border-primary/30"
                                >
                                    {tag}
                                </span>
                            ))}
                            {thread.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{thread.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">by {thread.author_name}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
                                <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">{thread.like_count}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">{thread.view_count}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
