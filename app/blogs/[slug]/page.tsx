import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug, getBlogs } from "@/lib/supabase/queries";
import { ArrowLeft, Calendar, Star, User } from "lucide-react";
import type { Metadata } from "next";
import "./blog-content.css";

interface BlogPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: blog } = await getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const blogUrl = `${siteUrl}/blogs/${blog.slug}`;
  const ogImage = blog.og_image || blog.cover_image || `${siteUrl}/og-default.jpg`;

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt || blog.subtitle || "",
    keywords: blog.meta_keywords || [],
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || blog.subtitle || "",
      url: blogUrl,
      siteName: "ePharmatica",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || blog.subtitle || "",
      images: [ogImage],
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  const { data: blogs } = await getBlogs();
  
  if (!blogs) {
    return [];
  }

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const [blogResult, otherBlogsResult] = await Promise.all([
    getBlogBySlug(resolvedParams.slug),
    getBlogs(6), // Get 6 other blogs for sidebar
  ]);

  const { data: blog, error } = blogResult;
  const { data: allBlogs } = otherBlogsResult;

  // Debug: Log blog data to see if author is present
  if (blog) {
    console.log('Blog data:', blog);
    console.log('Blog author:', blog.author);
    console.log('Blog user_id:', blog.user_id);
  }

  if (!blog || error) {
    notFound();
  }

  // Filter out current blog and get up to 5 other blogs
  const otherBlogs = (allBlogs || [])
    .filter((b) => b.id !== blog.id)
    .slice(0, 5);

  return (
    <>
      {/* Inline styles as fallback to ensure blog content renders correctly */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h1 { font-size: 1.875rem !important; font-weight: 700 !important; margin-top: 2.5rem !important; margin-bottom: 1.5rem !important; line-height: 1.2 !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h1 { font-size: 2.25rem !important; } }
        .blog-content h2 { font-size: 1.5rem !important; font-weight: 700 !important; margin-top: 2rem !important; margin-bottom: 1rem !important; line-height: 1.2 !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h2 { font-size: 1.875rem !important; } }
        .blog-content h3 { font-size: 1.25rem !important; font-weight: 600 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; line-height: 1.2 !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h3 { font-size: 1.5rem !important; } }
        .blog-content h4 { font-size: 1.125rem !important; font-weight: 600 !important; margin-top: 1.25rem !important; margin-bottom: 0.5rem !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h4 { font-size: 1.25rem !important; } }
        .blog-content h5 { font-size: 1rem !important; font-weight: 600 !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h5 { font-size: 1.125rem !important; } }
        .blog-content h6 { font-size: 0.875rem !important; font-weight: 600 !important; margin-top: 0.75rem !important; margin-bottom: 0.5rem !important; color: hsl(var(--foreground)) !important; }
        @media (min-width: 768px) { .blog-content h6 { font-size: 1rem !important; } }
        .blog-content ul { list-style-type: disc !important; list-style-position: outside !important; margin-left: 1.5rem !important; margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; padding-left: 0 !important; }
        .blog-content ol { list-style-type: decimal !important; list-style-position: outside !important; margin-left: 1.5rem !important; margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; padding-left: 0 !important; }
        .blog-content li { font-size: 1rem !important; line-height: 1.75 !important; margin: 0.5rem 0 !important; display: list-item !important; }
        @media (min-width: 768px) { .blog-content li { font-size: 1.125rem !important; line-height: 2 !important; } }
        .blog-content blockquote { border-left: 4px solid hsl(var(--primary)) !important; padding-left: 1.5rem !important; padding-right: 1rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; font-style: italic !important; color: hsl(var(--muted-foreground)) !important; margin: 1.5rem 0 !important; background-color: hsl(var(--muted) / 0.5) !important; border-radius: 0 0.5rem 0.5rem 0 !important; display: block !important; }
      ` }} />
      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blogs</span>
        </Link>
      </div>

      {/* Cover Image */}
      {blog.cover_image && (
        <div className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden mb-8">
          <Image
            src={blog.cover_image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Content */}
          <article className="lg:col-span-2">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
            {blog.author ? (
              <div className="flex items-center gap-2">
                {blog.author.avatar_url ? (
                  <Image
                    src={blog.author.avatar_url}
                    alt={blog.author.full_name || "Author"}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                )}
                <span className="font-medium text-foreground">
                  {blog.author.full_name || blog.author.email?.split("@")[0] || "Unknown Author"}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                No author assigned
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {blog.is_featured && (
              <div className="flex items-center gap-1 text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span>Featured</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              {blog.subtitle}
            </p>
          )}

          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Keywords as Tags */}
          {blog.meta_keywords && blog.meta_keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.meta_keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </header>

            {/* Blog Content - Optimized Typography */}
            {blog.content && (
              <div
                className="blog-content"
                style={{
                  // Ensure base styles are applied
                  color: 'hsl(var(--foreground))',
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}

            {!blog.content && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Content coming soon...</p>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Published on{" "}
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {blog.updated_at !== blog.created_at && (
                    <p className="mt-1">
                      Last updated on{" "}
                      {new Date(blog.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <Link
                  href="/blogs"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  ← Back to Blogs
                </Link>
              </div>
            </footer>
          </article>

          {/* Sidebar - Other Blogs */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-6 text-foreground">Other Blogs</h2>
                {otherBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {otherBlogs.map((otherBlog) => (
                      <Link
                        key={otherBlog.id}
                        href={`/blogs/${otherBlog.slug}`}
                        className="group block border border-border rounded-lg p-4 hover:shadow-lg transition-all hover:border-primary/50"
                      >
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                          {otherBlog.title}
                        </h3>
                        {otherBlog.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {otherBlog.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          {otherBlog.author && (
                            <div className="flex items-center gap-1.5">
                              {otherBlog.author.avatar_url ? (
                                <Image
                                  src={otherBlog.author.avatar_url}
                                  alt={otherBlog.author.full_name || "Author"}
                                  width={16}
                                  height={16}
                                  className="rounded-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <User className="h-3 w-3" />
                              )}
                              <span className="font-medium text-foreground">
                                {otherBlog.author.full_name || otherBlog.author.email?.split("@")[0] || "Author"}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <time dateTime={otherBlog.created_at}>
                              {new Date(otherBlog.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          {otherBlog.is_featured && (
                            <>
                              <span>•</span>
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span>Featured</span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No other blogs available.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    </>
  );
}

