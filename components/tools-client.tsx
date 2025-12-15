"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, ChevronLeft, ChevronRight, Lightbulb, Microscope } from "lucide-react";
import type { Tool } from "@/lib/supabase/types";

interface ToolCategory {
  id: string;
  name: string;
}

interface ToolsClientProps {
  tools: Tool[];
  categories: ToolCategory[];
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 9;

export function ToolsClient({ tools, categories, initialCategory }: ToolsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description?.toLowerCase().includes(query) ||
          tool.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tools, selectedCategory, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
    updateURL(value, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
    updateURL(searchQuery, category);
  };

  const updateURL = (search: string, category: string) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (category && category !== "all") {
      params.set("category", category);
    }
    const queryString = params.toString();
    router.push(`/tools${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
    router.push("/tools", { scroll: false });
  };

  const hasActiveFilters = searchQuery.trim() || (selectedCategory && selectedCategory !== "all");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Tools Grid (Swapped from Right) */}
      <div className="lg:col-span-3 order-2 lg:order-1">

        {/* Mobile: Search and Filters (Visible only on mobile) */}
        <div className="lg:hidden space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Dropdown */}
          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters & Results Count */}
          <div className="flex items-center justify-between">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <div className="text-sm text-muted-foreground">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {paginatedTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
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
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "No tools found matching your filters."
                : "No tools available yet."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Filters & Search (Swapped from Left) */}
      <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2 space-y-6">
        <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg p-6 space-y-6 sticky top-6">
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full mt-4"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}

            {/* Results Count */}
            <div className="pt-4 border-t text-sm text-muted-foreground">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} found
            </div>
          </div>
        </div>

        {/* Interesting Fact Container */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lightbulb className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              Did You Know?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The first successful vaccine was developed by Edward Jenner in 1796 for smallpox. He used material from cowpox pustules to provide immunity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

