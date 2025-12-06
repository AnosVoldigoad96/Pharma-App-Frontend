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
import { Search, Filter, X } from "lucide-react";
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

export function ToolsClient({ tools, categories, initialCategory }: ToolsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateURL(value, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
    router.push("/tools", { scroll: false });
  };

  const hasActiveFilters = searchQuery.trim() || (selectedCategory && selectedCategory !== "all");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Column: Filters & Search (Hidden on mobile, shown on desktop) */}
      <div className="hidden lg:block">
        <div className="bg-card border rounded-lg shadow-sm p-6 space-y-6 sticky top-6">
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
      </div>

      {/* Right Column: Tools Grid (Full width on mobile, 3 columns on desktop) */}
      <div className="lg:col-span-3">
        {/* Mobile: Search and Filters */}
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
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "No tools found matching your filters."
                : "No tools available yet."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

