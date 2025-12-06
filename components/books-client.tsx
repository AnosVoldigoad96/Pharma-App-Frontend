"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookCard } from "@/components/book-card";
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
import type { Book, BookCategory } from "@/lib/supabase/types";

interface BooksClientProps {
  books: Book[];
  categories: BookCategory[];
  initialCategory?: string;
}

export function BooksClient({ books, categories, initialCategory }: BooksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category_id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query) ||
          book.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [books, selectedCategory, searchQuery]);

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
    router.push(`/books${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    router.push("/books", { scroll: false });
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
                  placeholder="Search books..."
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
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Books Grid (Full width on mobile, 3 columns on desktop) */}
      <div className="lg:col-span-3">
        {/* Mobile: Search and Filters */}
        <div className="lg:hidden space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books..."
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
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "No books found matching your filters."
                : "No books available yet."}
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

