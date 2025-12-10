"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Star, User } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import type { Blog } from "@/lib/supabase/types";

interface BlogsClientProps {
  blogs: Blog[];
  initialSearch?: string;
}

export function BlogsClient({ blogs, initialSearch }: BlogsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || initialSearch || "");
  const [filterFeatured, setFilterFeatured] = useState(searchParams.get("featured") === "true");

  // Filter blogs based on search and featured filter
  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by featured
    if (filterFeatured) {
      filtered = filtered.filter((blog) => blog.is_featured);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.subtitle?.toLowerCase().includes(query) ||
          blog.excerpt?.toLowerCase().includes(query) ||
          blog.meta_keywords?.some((keyword) => keyword.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [blogs, filterFeatured, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== "" || filterFeatured;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateURL(value, filterFeatured);
  };

  const handleFeaturedChange = (value: string) => {
    const isFeatured = value === "featured";
    setFilterFeatured(isFeatured);
    updateURL(searchQuery, isFeatured);
  };

  const updateURL = (search: string, featured: boolean) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (featured) {
      params.set("featured", "true");
    }
    const queryString = params.toString();
    router.push(`/blogs${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterFeatured(false);
    router.push("/blogs", { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar - Desktop */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>

            {/* Search */}
            <div className="space-y-2 mb-4">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Featured Filter */}
            <div className="space-y-2">
              <label htmlFor="featured" className="text-sm font-medium">
                Filter
              </label>
              <Select
                value={filterFeatured ? "featured" : "all"}
                onValueChange={handleFeaturedChange}
              >
                <SelectTrigger id="featured">
                  <SelectValue placeholder="All Blogs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blogs</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters & Results Count */}
            <div className="pt-4 border-t space-y-4">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <div className="text-sm text-muted-foreground">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Search & Filters */}
        <div className="lg:hidden space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={filterFeatured ? "featured" : "all"}
              onValueChange={handleFeaturedChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Blogs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blogs</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
          </div>
        </div>

        {/* Blogs Bento Grid */}
        {filteredBlogs.length > 0 ? (
          <BentoGrid className="md:auto-rows-[20rem]">
            {filteredBlogs.map((blog, index) => {
              // Make featured blogs larger (span 2 rows)
              const isLarge = blog.is_featured || index % 5 === 0;
              const rowSpan = isLarge ? 2 : 1;
              const colSpan = isLarge ? 2 : 1;

              return (
                <BentoGridItem
                  key={blog.id}
                  className={`
                    ${rowSpan === 2 ? "md:row-span-2" : ""}
                    ${colSpan === 2 ? "md:col-span-2" : ""}
                    group cursor-pointer
                  `}
                  title={
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {blog.title}
                    </Link>
                  }
                  description={
                    <div className="space-y-2">
                      {blog.subtitle && (
                        <p className="text-sm font-medium text-muted-foreground">
                          {blog.subtitle}
                        </p>
                      )}
                      {blog.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
                        {blog.author && (
                          <div className="flex items-center gap-1.5">
                            {blog.author.avatar_url ? (
                              <Image
                                src={blog.author.avatar_url}
                                alt={blog.author.full_name || "Author"}
                                width={16}
                                height={16}
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                            <span className="font-medium text-foreground">
                              {blog.author.full_name || blog.author.email?.split("@")[0] || "Author"}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </div>
                        {blog.is_featured && (
                          <div className="flex items-center gap-1 text-primary">
                            <Star className="h-3 w-3 fill-primary" />
                            Featured
                          </div>
                        )}
                      </div>
                    </div>
                  }
                  header={
                    blog.cover_image ? (
                      <Link href={`/blogs/${blog.slug}`} className="block h-full w-full">
                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                          <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                          {blog.is_featured && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Featured
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary/20">
                          {blog.title[0]}
                        </div>
                      </div>
                    )
                  }
                />
              );
            })}
          </BentoGrid>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "No blogs found matching your filters."
                : "No blog posts available yet."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

