import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBookById, getBooks } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ShoppingCart, MessageSquare } from "lucide-react";
import { BookDetailClient } from "@/components/book-detail-client";
import type { Metadata } from "next";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: book } = await getBookById(resolvedParams.id);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: `${book.title}${book.author ? ` by ${book.author}` : ""} | ePharmatica`,
    description: `Explore ${book.title}${book.author ? ` by ${book.author}` : ""}${book.edition ? ` (${book.edition})` : ""} in our pharmaceutical library.`,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: book, error } = await getBookById(resolvedParams.id);

  if (error || !book) {
    notFound();
  }

  // Fetch related books (same category or featured)
  const { data: relatedBooks } = await getBooks(5, book.category_id || undefined);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Book Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Cover Image */}
                <div className="flex-shrink-0">
                  {book.cover_image ? (
                    <div className="relative w-full md:w-64 aspect-[3/4] rounded-lg overflow-hidden border-2 border-border">
                      <Image
                        src={book.cover_image}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-64 aspect-[3/4] rounded-lg bg-muted flex items-center justify-center border-2 border-border">
                      <BookOpen className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                    {book.title}
                  </h1>
                  {book.author && (
                    <p className="text-xl text-muted-foreground mb-2">
                      By {book.author}
                    </p>
                  )}
                  {book.edition && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Edition: {book.edition}
                    </p>
                  )}
                  {book.isbn && (
                    <p className="text-sm text-muted-foreground mb-4">
                      ISBN: {book.isbn}
                    </p>
                  )}
                  {book.book_categories && (
                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">
                        Category: {book.book_categories.name}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {book.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {book.purchase_link && (
                      <Button
                        asChild
                        className="flex items-center gap-2"
                      >
                        <a
                          href={book.purchase_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Purchase
                        </a>
                      </Button>
                    )}
                    {book.ai_chat_enabled && (
                      <Button
                        asChild
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Link href={`/books/${book.id}/chat`}>
                          <MessageSquare className="w-4 h-4" />
                          Chat with Book
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Actions (Download/Request) */}
            <BookDetailClient book={book} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Related Books */}
              {relatedBooks && relatedBooks.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-foreground">
                    Related Books
                  </h2>
                  <div className="space-y-4">
                    {relatedBooks
                      .filter((b) => b.id !== book.id)
                      .slice(0, 3)
                      .map((relatedBook) => (
                        <Link
                          key={relatedBook.id}
                          href={`/books/${relatedBook.id}`}
                          className="group block border border-border rounded-lg p-3 hover:shadow-lg transition-all hover:border-primary/50"
                        >
                          <div className="flex gap-3">
                            {relatedBook.cover_image ? (
                              <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                                <Image
                                  src={relatedBook.cover_image}
                                  alt={relatedBook.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-24 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                                {relatedBook.title}
                              </h3>
                              {relatedBook.author && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {relatedBook.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Back to Library */}
              <div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/books">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Back to Library
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

