import { getThreads, getPageContent } from "@/lib/supabase/queries";
import { ThreadsClient } from "@/components/threads-client";
import { ThreadsHero } from "@/components/threads-hero";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default async function ThreadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; featured?: string }> | { search?: string; featured?: string };
}) {
  // Handle both Promise and direct object (Next.js 15+ compatibility)
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const search = params?.search;

  const [threadsResult] = await Promise.all([
    getThreads(),
  ]);

  const threads = threadsResult.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ThreadsHero
        heading="Community Discussions"
        subtitle="Join the conversation, share your knowledge, and connect with pharmaceutical professionals worldwide."
      />

      {/* Main Content */}
      <div className="relative w-full py-12 bg-background overflow-hidden">


        <div className="mx-auto max-w-7xl px-4 relative z-10">
          {/* Header with New Thread Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Latest Discussions</h2>
              <p className="text-muted-foreground">
                Browse topics or start your own conversation
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/threads/new" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                New Thread
              </Link>
            </Button>
          </div>

          {/* Threads List with Sidebar */}
          <ThreadsClient threads={threads} initialSearch={search} />
        </div>
      </div>
    </div>
  );
}

