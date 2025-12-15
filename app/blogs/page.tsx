import { getBlogs, getPageContent } from "@/lib/supabase/queries";
import { BlogsClient } from "@/components/blogs-client";
import { WriteBlogButton } from "@/components/write-blog-button";
import { BlogsHero } from "@/components/blogs-hero";
import { QuoteSection } from "@/components/quote-section";

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
  const heading = heroSection?.heading || heroSection?.title || "Latest Articles";
  const subtitle = heroSection?.subheading || heroSection?.subtitle || "Explore the latest insights and research in pharmaceutical science.";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <BlogsHero heading={heading} subtitle={subtitle} />

      {/* Main Content */}
      <div className="relative w-full py-12 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Browse Articles
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>
            <WriteBlogButton />
          </div>

          <BlogsClient blogs={blogs} initialSearch={search} />
        </div>
      </div>

      {/* Quote Section */}
      <QuoteSection
        quote="The art of writing is the art of discovering what you believe."
        author="Gustave Flaubert"
      />


    </div>
  );
}

