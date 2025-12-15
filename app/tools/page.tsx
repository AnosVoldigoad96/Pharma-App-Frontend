import { getTools, getToolCategories, getPageContent } from "@/lib/supabase/queries";
import { ToolsClient } from "@/components/tools-client";
import { ToolsHero } from "@/components/tools-hero";
import { ToolRequestSection } from "@/components/tool-request-section";
import { QuoteSection } from "@/components/quote-section";

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }> | { category?: string; search?: string };
}) {
  // Handle both Promise and direct object (Next.js 15+ compatibility)
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const categoryId = params?.category;

  const [toolsResult, categoriesResult, pageContentResult] = await Promise.all([
    getTools(undefined, categoryId),
    getToolCategories(),
    getPageContent("tools"),
  ]);

  const tools = toolsResult.data || [];
  const categories = categoriesResult.data || [];
  let pageContent = pageContentResult.data;

  // Extract hero section data
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heading = heroSection?.heading || heroSection?.title || null;
  const subtitle = heroSection?.subheading || heroSection?.subtitle || null;
  const image = heroSection?.image || heroSection?.background_image || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ToolsHero
        heading={heading || "Pharmaceutical Tools"}
        subtitle={subtitle || "Access our collection of pharmaceutical tools and utilities"}
      />

      {/* Main Content */}
      <div className="relative w-full py-12 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Browse Tools
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
          </div>

          <ToolsClient tools={tools} categories={categories} initialCategory={categoryId} />
        </div>
      </div>

      {/* Quote Section */}
      <QuoteSection
        quote="Science is a way of thinking much more than it is a body of knowledge."
        author="Carl Sagan"
      />

      {/* Tool Request Section */}
      <ToolRequestSection />
    </div>
  );
}

