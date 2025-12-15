"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Star, User, ChevronLeft, ChevronRight, Feather } from "lucide-react";

import type { Blog } from "@/lib/supabase/types";

interface BlogsClientProps {
  blogs: Blog[];
  initialSearch?: string;
}

const ITEMS_PER_PAGE = 6;

export function BlogsClient({ blogs, initialSearch }: BlogsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || initialSearch || "");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter blogs based on search
  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

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
  }, [blogs, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
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
    router.push(`/blogs${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/blogs", { scroll: false });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Blogs Grid */}
      <div className="lg:col-span-3 order-2 lg:order-1">

        {/* Mobile Search */}
        <div className="lg:hidden mb-6">
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
          <div className="text-sm text-muted-foreground mt-2">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
          </div>
        </div>

        {/* Blogs Grid */}
        {paginatedBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    {blog.cover_image ? (
                      <Image
                        src={blog.cover_image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Feather className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    {blog.is_featured && (
                      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                      {blog.author && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[100px]">
                              {blog.author.full_name || "Author"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center text-sm font-medium text-primary">
                      Read Article
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
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
              {searchQuery.trim()
                ? "No blogs found matching your search."
                : "No blog posts available yet."}
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
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
          </div>
        </div>

        {/* Fact 1: Medical History */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Feather className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Feather className="w-5 h-5" />
              Medical History
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The "Canon of Medicine" by Avicenna (Ibn Sina), completed in 1025, remained a standard medical text in Europe and the Islamic world for over seven centuries.
            </p>
          </div>
        </div>

        {/* Fact 2: Penicillin */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-5 h-5 rounded-full border-2 border-current" />
              Discovery
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In 1928, Alexander Fleming discovered penicillin, the first true antibiotic, by accident when he noticed mold killing bacteria in a petri dish.
            </p>
          </div>
        </div>

        {/* Fact 3: Vaccines */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="w-24 h-24 rotate-45 border-r-4 border-amber-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <div className="w-5 h-5 rotate-45 border-r-2 border-current" />
              First Vaccine
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Edward Jenner developed the first successful vaccine in 1796, using material from cowpox blisters to immunize a boy against smallpox.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
