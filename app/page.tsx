import Link from "next/link";
import { getBlogs, getBooks, getThreads, getSiteSettings, getPageContent } from "@/lib/supabase/queries";
import Image from "next/image";

export default async function Home() {
  // Fetch data from Supabase
  const [blogsResult, booksResult, threadsResult, settingsResult, pageContentResult] = await Promise.all([
    getBlogs(3, true),
    getBooks(3, undefined, true),
    getThreads(3, true),
    getSiteSettings(),
    getPageContent("home"),
  ]);

  const featuredBlogs = blogsResult.data || [];
  const featuredBooks = booksResult.data || [];
  const featuredThreads = threadsResult.data || [];
  const siteSettings = settingsResult.data;
  const pageContent = pageContentResult.data;

  // Extract hero section data
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heroHeading = heroSection?.heading || heroSection?.title || `Welcome to ${siteSettings?.brand_name || "ePharmatica"}`;
  const heroSubtitle = heroSection?.subheading || heroSection?.subtitle || "Your comprehensive pharmaceutical knowledge platform";
  const heroImage = heroSection?.image || heroSection?.background_image || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroImage ? (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src={heroImage}
            alt={heroHeading}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-accent/30 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="mx-auto max-w-7xl px-4 text-center text-white relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                {heroHeading}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.7686_0.1647_70.0804/0.1),transparent_50%)] -z-10" />
          
          <div className="text-center space-y-6 relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-float">
              {heroHeading}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          </div>
        </section>
      )}

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="relative w-full py-12 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,oklch(0.7686_0.1647_70.0804/0.08),transparent_50%)] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Featured Books
            </h2>
            <Link
              href="/books"
              className="group text-primary hover:text-primary/80 font-medium transition-all flex items-center gap-1"
            >
              View All
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {featuredBooks.map((book, index) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group relative border rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300 -z-10" />
                
                {book.cover_image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-muted-foreground mb-2 text-sm">By {book.author}</p>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {book.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section className="relative w-full py-12 bg-gradient-to-br from-muted/50 via-muted/30 to-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Latest Articles
            </h2>
            <Link
              href="/blogs"
              className="group text-primary hover:text-primary/80 font-medium transition-all flex items-center gap-1"
            >
              View All
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group relative border rounded-lg overflow-hidden bg-background hover:border-primary/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {blog.cover_image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  {blog.subtitle && (
                    <p className="text-muted-foreground mb-2 text-sm">{blog.subtitle}</p>
                  )}
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Threads */}
      {featuredThreads.length > 0 && (
        <section className="relative w-full py-12 bg-gradient-to-br from-background via-accent/5 to-background overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,oklch(0.9869_0.0214_95.2774/0.08),transparent_50%)] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Community Discussions
            </h2>
            <Link
              href="/threads"
              className="group text-primary hover:text-primary/80 font-medium transition-all flex items-center gap-1"
            >
              View All
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {featuredThreads.map((thread, index) => (
              <Link
                key={thread.id}
                href={`/threads/${thread.slug}`}
                className="group relative border rounded-lg p-6 bg-card hover:border-primary/50 transition-all duration-300 card-hover overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors relative z-10">
                  {thread.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2 relative z-10">
                  {thread.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground relative z-10">
                  <span>By {thread.author_name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-primary">{thread.like_count}</span> likes
                  </span>
                  <span>•</span>
                  <span>{thread.view_count} views</span>
                </div>
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                    {thread.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
