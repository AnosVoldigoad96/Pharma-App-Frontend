import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug } from "@/lib/supabase/queries";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ToolCalculator } from "@/components/tool-calculator";

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

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 pb-12">
        {/* Tool Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
          {tool.description && (
            <p className="text-lg text-muted-foreground">{tool.description}</p>
          )}
          {tool.category && (
            <span className="inline-block mt-4 text-sm bg-muted px-3 py-1 rounded-full">
              {tool.category}
            </span>
          )}
        </div>

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
    </div>
  );
}

