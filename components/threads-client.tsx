"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, ChevronLeft, ChevronRight, Globe, Users, BookOpen, Activity } from "lucide-react";
import type { Thread } from "@/lib/supabase/types";
import { ThreadCard } from "@/components/thread-card";

interface ThreadsClientProps {
  threads: Thread[];
  initialSearch?: string;
}

const ITEMS_PER_PAGE = 6;

export function ThreadsClient({ threads, initialSearch }: ThreadsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || initialSearch || "");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter threads based on search
  const filteredThreads = useMemo(() => {
    let filtered = threads;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (thread) =>
          thread.title.toLowerCase().includes(query) ||
          thread.content.toLowerCase().includes(query) ||
          thread.author_name.toLowerCase().includes(query) ||
          (thread.tags && thread.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [threads, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredThreads.length / ITEMS_PER_PAGE);
  const paginatedThreads = filteredThreads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURL(value);
  };

  const updateURL = (search: string) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    const queryString = params.toString();
    router.push(`/threads${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/threads", { scroll: false });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Threads Grid */}
      <div className="lg:col-span-3 order-2 lg:order-1">

        {/* Mobile Search */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {filteredThreads.length} {filteredThreads.length === 1 ? "thread" : "threads"} found
          </div>
        </div>

        {/* Threads Grid */}
        {paginatedThreads.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedThreads.map((thread, index) => (
                <ThreadCard key={thread.id} thread={thread} index={index} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-border/50">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {searchQuery.trim()
                ? "No threads found matching your search."
                : "No threads available yet."}
            </p>
            {searchQuery.trim() && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Search & Facts */}
      <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2 space-y-6">

        {/* Search Box */}
        <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg p-6 sticky top-6 z-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredThreads.length} {filteredThreads.length === 1 ? "thread" : "threads"} found
          </div>
        </div>

        {/* Fact 1: Medical Journals */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
              Medical Journals
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The first medical journal, "Nouvelles découvertes sur toutes les parties de la médecine," was published in Paris in 1679 by Nicolas de Blégny.
            </p>
          </div>
        </div>

        {/* Fact 2: Hippocratic Oath */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
              Hippocratic Oath
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Hippocratic Oath, historically taken by physicians, requires a new physician to swear to uphold specific ethical standards.
            </p>
          </div>
        </div>

        {/* Fact 3: Global Collaboration */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="w-24 h-24 text-amber-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Globe className="w-5 h-5" />
              Global Reach
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modern pharmaceutical research relies on global collaboration, with clinical trials often conducted across dozens of countries simultaneously.
            </p>
          </div>
        </div>

        {/* Fact 4: Digital Health */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-24 h-24 text-purple-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Activity className="w-5 h-5" />
              Digital Health
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The integration of AI and telemedicine is revolutionizing patient care, allowing for real-time monitoring and personalized treatment plans.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

