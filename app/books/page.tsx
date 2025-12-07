import { getBooks, getBookCategories, getPageContent } from "@/lib/supabase/queries";
import { BooksClient } from "@/components/books-client";
import Image from "next/image";

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
      {heroSection && (heading || subtitle) && (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
          {image ? (
            <>
              <Image
                src={image}
                alt={heading || "Library Hero"}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-chart-5/40 to-chart-4/40 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="mx-auto max-w-7xl px-4 text-center text-white relative z-10">
                  {heading && (
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                      {heading}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/25 via-chart-5/20 to-chart-4/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.2,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--chart-4)/0.15,transparent_50%)]" />
              <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
                {heading && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    {heading}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Content */}
      <div className="relative w-full py-12 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          {!heroSection && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Books Library</h1>
              <p className="text-muted-foreground">
                Explore our collection of pharmaceutical and medical books
              </p>
            </div>
          )}

          <BooksClient books={books} categories={categories} initialCategory={categoryId} />
        </div>
      </div>
    </div>
  );
}
