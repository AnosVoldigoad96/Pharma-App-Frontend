import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug } from "@/lib/supabase/queries";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ToolCalculator } from "@/components/tool-calculator";
import { ToolsHero } from "@/components/tools-hero";
import { RandomTools } from "@/components/random-tools";

interface ToolPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: tool } = await getToolBySlug(resolvedParams.slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.seo_title || tool.title,
    description: tool.seo_description || tool.description || undefined,
    keywords: tool.seo_keywords ? tool.seo_keywords.split(",").map((k) => k.trim()) : undefined,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: tool, error } = await getToolBySlug(resolvedParams.slug);

  if (error || !tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ToolsHero
        heading={tool.title}
        compact={true}
      />

      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
      </div>

      {/* Main Content & Sidebar */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Content (3 cols) */}
          <div className="lg:col-span-3">
            {/* Category Badge */}
            {tool.category && (
              <div className="mb-6">
                <span className="inline-block text-sm bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                  {tool.category}
                </span>
              </div>
            )}

            {/* Tool Content/Instructions */}
            {tool.content && (
              <div className="mb-8 p-6 bg-card border rounded-lg">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tool.content }}
                />
              </div>
            )}

            {/* Tool Calculator */}
            <ToolCalculator tool={tool} />
          </div>

          {/* Sidebar (1 col) - Hidden on smaller screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <RandomTools currentToolId={tool.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
