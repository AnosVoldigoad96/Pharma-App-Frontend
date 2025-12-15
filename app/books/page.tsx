import { getBooks, getBookCategories, getPageContent } from "@/lib/supabase/queries";
import { BooksClient } from "@/components/books-client";
import Image from "next/image";
import { LibraryHero } from "@/components/library-hero";
import { BookRequestSection } from "@/components/book-request-section";
import { QuoteSection } from "@/components/quote-section";

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }> | { category?: string; search?: string };
}) {
  // Handle both Promise and direct object (Next.js 15+ compatibility)
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const categoryId = params?.category;

  const [booksResult, categoriesResult, pageContentResult] = await Promise.all([
    getBooks(undefined, categoryId),
    getBookCategories(),
    getPageContent("books"),
  ]);

  const books = booksResult.data || [];
  const categories = categoriesResult.data || [];
  let pageContent = pageContentResult.data;

  // Fallback to "library" if "books" doesn't exist
  if (!pageContent) {
    const libraryResult = await getPageContent("library");
    pageContent = libraryResult.data;
  }

  // Extract hero section data
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heading = heroSection?.heading || heroSection?.title || null;
  const subtitle = heroSection?.subheading || heroSection?.subtitle || null;
  const image = heroSection?.image || heroSection?.background_image || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroSection && (heading || subtitle) ? (
        <LibraryHero heading={heading} subtitle={subtitle} />
      ) : (
        <LibraryHero heading="Books Library" subtitle="Explore our collection of pharmaceutical and medical books" />
      )}

      {/* Main Content */}
      <div className="relative w-full py-12 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Browse Collection
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
          </div>

          <BooksClient books={books} categories={categories} initialCategory={categoryId} />
        </div>
      </div>

      {/* Quote Section */}
      <QuoteSection />

      {/* Book Request Section */}
      <BookRequestSection />
    </div>
  );
}
