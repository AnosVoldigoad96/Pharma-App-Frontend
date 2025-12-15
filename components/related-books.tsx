"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Book } from "@/lib/supabase/types";
import { BookCard } from "@/components/book-card";
import { cn } from "@/lib/utils";

interface RelatedBooksProps {
    books: Book[];
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export function RelatedBooks({ books, orientation = "horizontal", className }: RelatedBooksProps) {
    const isVertical = orientation === "vertical";

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            dragFree: true,
            axis: isVertical ? 'y' : 'x',
            slidesToScroll: 1
        },
        [AutoScroll({
            playOnInit: true,
            speed: 1,
            stopOnInteraction: false,
            direction: 'forward'
        })]
    );

    if (!books || books.length === 0) return null;

    return (
        <section className={cn(
            "bg-background",
            isVertical ? "h-[600px] border-l border-border/50 pl-6" : "py-12 border-t border-border/50",
            className
        )}>
            <div className={cn("mb-6", isVertical ? "" : "container mx-auto px-4")}>
                <h2 className="text-xl font-bold mb-2">Related Books</h2>
                <div className="h-1 w-12 bg-primary rounded-full"></div>
            </div>

            <div
                className={cn("overflow-hidden", isVertical ? "h-[calc(100%-3rem)]" : "")}
                ref={emblaRef}
            >
                <div className={cn("flex", isVertical ? "flex-col gap-4" : "touch-pan-y")}>
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className={cn(
                                "min-w-0 flex-shrink-0",
                                isVertical ? "h-auto" : "flex-[0_0_280px] pl-4 md:pl-6"
                            )}
                        >
                            {isVertical ? (
                                // Compact card for sidebar
                                <div className="group relative flex gap-3 p-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-md">
                                        {book.cover_image ? (
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                No Cover
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                            {book.title}
                                        </h3>
                                        {book.author && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {book.author}
                                            </p>
                                        )}
                                        <a href={`/books/${book.slug || book.id}`} className="absolute inset-0" aria-label={`View ${book.title}`}></a>
                                    </div>
                                </div>
                            ) : (
                                <BookCard book={book} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
