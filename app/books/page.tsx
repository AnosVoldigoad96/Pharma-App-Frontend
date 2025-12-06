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
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="mx-auto max-w-7xl px-4 text-center text-white">
                  {heading && (
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {heading}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="mx-auto max-w-7xl px-4 text-center">
                {heading && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
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
      <div className="relative w-full py-12 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.7686_0.1647_70.0804/0.06),transparent_60%)] pointer-events-none" />
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
