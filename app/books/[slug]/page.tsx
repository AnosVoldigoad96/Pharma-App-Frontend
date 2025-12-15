import { getBookBySlug, getBooks } from "@/lib/supabase/queries";
import { BookHero } from "@/components/book-hero";
import { RelatedBooks } from "@/components/related-books";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, BookOpen, Download, MessageSquare, ArrowLeft } from "lucide-react";
import { AccessButton } from "@/components/access-button";
import Image from "next/image";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch book details
  const { data: book, error } = await getBookBySlug(slug);

  if (error || !book) {
    notFound();
  }

  // Fetch related books (same category)
  const { data: relatedBooks } = await getBooks(10, book.category_id || undefined);
  // Filter out the current book
  const filteredRelatedBooks = relatedBooks?.filter(b => b.id !== book.id) || [];

  // Check authentication for Download button
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-background">
      <BookHero
        title={book.title}
        author={book.author}
        category={book.book_categories?.name}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/books">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cover Image (3 cols) - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl border border-border/50 sticky top-24">
              {book.cover_image ? (
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Cover</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column: Details & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            {/* Mobile Header: Image + Details Side-by-Side */}
            <div className="flex gap-4 lg:hidden">
              {/* Mobile Image */}
              <div className="relative aspect-[2/3] w-28 shrink-0 rounded-lg overflow-hidden shadow-lg border border-border/50">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground text-center px-1">No Cover</span>
                  </div>
                )}
              </div>

              {/* Mobile Details */}
              <div className="flex flex-col justify-center min-w-0">
                <h2 className="text-xl font-bold mb-1 leading-tight line-clamp-3">{book.title}</h2>
                {book.author && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">by {book.author}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {book.edition && (
                    <div className="px-2 py-0.5 bg-muted rounded text-xs">
                      Ed: {book.edition}
                    </div>
                  )}
                  {book.book_categories?.name && (
                    <div className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs truncate max-w-[120px]">
                      {book.book_categories.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Details (Hidden on Mobile) */}
            <div className="hidden lg:block">
              <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
              {book.author && (
                <p className="text-xl text-muted-foreground">by {book.author}</p>
              )}
            </div>

            <div className="hidden lg:flex flex-wrap gap-4">
              {book.edition && (
                <div className="px-3 py-1 bg-muted rounded-md text-sm">
                  Edition: {book.edition}
                </div>
              )}
              {book.isbn && (
                <div className="px-3 py-1 bg-muted rounded-md text-sm">
                  ISBN: {book.isbn}
                </div>
              )}
              {book.book_categories?.name && (
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  {book.book_categories.name}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Purchase (Public) */}
              {book.purchase_link && (
                <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Link href={book.purchase_link} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="w-4 h-4" />
                    Purchase
                  </Link>
                </Button>
              )}

              {/* Read (Protected) */}
              {book.pdf_url && (
                isAuthenticated ? (
                  <Button asChild variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <Link href={`/read/${book.slug || book.id}`}>
                      <BookOpen className="w-4 h-4" />
                      Read Online
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <Link href={`/login?next=/read/${book.slug || book.id}`}>
                      <BookOpen className="w-4 h-4" />
                      Sign in to Read
                    </Link>
                  </Button>
                )
              )}

              {/* Access / Download Button */}
              {book.pdf_url && (
                <AccessButton
                  fileUrl={book.pdf_url}
                  isAuthenticated={isAuthenticated}
                />
              )}

              {/* Chat (Public if enabled) */}
              {book.ai_chat_enabled && (
                <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
                  <Link href={`/books/${book.slug || book.id}/chat`}>
                    <MessageSquare className="w-4 h-4" />
                    Chat with Book
                  </Link>
                </Button>
              )}
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-border/50">
                <h3 className="font-semibold text-sm text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary/50 dark:bg-secondary text-secondary-foreground border border-border/50 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Related Books Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <RelatedBooks books={filteredRelatedBooks} orientation="vertical" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
