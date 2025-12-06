import { getBlogs, getPageContent } from "@/lib/supabase/queries";
import { BlogsClient } from "@/components/blogs-client";
import { WriteBlogButton } from "@/components/write-blog-button";
import Image from "next/image";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; featured?: string }> | { search?: string; featured?: string };
}) {
  // Handle both Promise and direct object (Next.js 15+ compatibility)
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const search = params?.search;

  const [blogsResult, pageContentResult] = await Promise.all([
    getBlogs(),
    getPageContent("blogs"),
  ]);

  const blogs = blogsResult.data || [];
  let pageContent = pageContentResult.data;

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
                alt={heading || "Blogs Hero"}
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
      <div className="relative w-full py-12 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.7686_0.1647_70.0804/0.05),transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          {!heroSection && (
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Blog Articles</h1>
                <p className="text-muted-foreground">
                  Stay updated with the latest pharmaceutical news and insights
                </p>
              </div>
              <WriteBlogButton />
            </div>
          )}

          {heroSection && (
            <div className="mb-6 flex justify-end">
              <WriteBlogButton />
            </div>
          )}

          <BlogsClient blogs={blogs} initialSearch={search} />
        </div>
      </div>
    </div>
  );
}

