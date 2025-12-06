"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MessageSquare, Eye, Heart, Calendar, User, Lock, X } from "lucide-react";
import type { Thread } from "@/lib/supabase/types";

interface ThreadsClientProps {
  threads: Thread[];
  initialSearch?: string;
}

export function ThreadsClient({ threads, initialSearch }: ThreadsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || initialSearch || "");
  const [filterFeatured, setFilterFeatured] = useState(searchParams.get("featured") === "true");

  // Get unique tags from all threads
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    threads.forEach((thread) => {
      if (thread.tags && Array.isArray(thread.tags)) {
        thread.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [threads]);

  // Filter threads based on search and featured filter
  const filteredThreads = useMemo(() => {
    let filtered = threads;

    // Filter by featured
    if (filterFeatured) {
      filtered = filtered.filter((thread) => thread.is_featured);
    }

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
  }, [threads, searchQuery, filterFeatured]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/threads?${params.toString()}`);
  };

  const handleFeaturedFilter = (value: string) => {
    const isFeatured = value === "true";
    setFilterFeatured(isFeatured);
    const params = new URLSearchParams(searchParams.toString());
    if (isFeatured) {
      params.set("featured", "true");
    } else {
      params.delete("featured");
    }
    router.push(`/threads?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterFeatured(false);
    router.push("/threads");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Column: Filters (Desktop) */}
      <div className="hidden lg:block space-y-4">
        <div className="bg-card border rounded-lg p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            {(searchQuery || filterFeatured) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                <span className="sr-only">Clear filters</span>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Featured Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by</label>
            <Select
              value={filterFeatured ? "true" : "all"}
              onValueChange={handleFeaturedFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All threads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All threads</SelectItem>
                <SelectItem value="true">Featured only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right Column: Threads List */}
      <div className="lg:col-span-3">
        {/* Mobile Search and Filters */}
        <div className="lg:hidden space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterFeatured ? "true" : "all"}
            onValueChange={handleFeaturedFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All threads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All threads</SelectItem>
              <SelectItem value="true">Featured only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Threads Grid */}
        {filteredThreads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredThreads.map((thread, index) => (
              <Link
                key={thread.id}
                href={`/threads/${thread.slug}`}
                className="group relative block bg-card border rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/50 card-hover overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient accent on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {thread.title}
                  </h3>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {thread.is_locked && (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {thread.is_featured && (
                      <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2 py-0.5 rounded shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {thread.content}
                </p>

                {/* Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {thread.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{thread.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {thread.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {thread.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {thread.view_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              {searchQuery || filterFeatured
                ? "No threads match your filters"
                : "No threads available yet"}
            </p>
            {(searchQuery || filterFeatured) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

