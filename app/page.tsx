import Link from "next/link";
import { getBlogs, getBooks, getThreads, getSiteSettings, getPageContent } from "@/lib/supabase/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, MessageSquare } from "lucide-react";

export default async function Home() {
  // Fetch data from Supabase
  const [blogsResult, booksResult, threadsResult, settingsResult, pageContentResult] = await Promise.all([
    getBlogs(3, true),
    getBooks(5, undefined, true),
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
  const heroHeading = heroSection?.heading || heroSection?.title || `Welcome to ${siteSettings?.brand_name || "ePharmatica"} `;
  const heroSubtitle = heroSection?.subheading || heroSection?.subtitle || "Your comprehensive pharmaceutical knowledge platform";
  const heroImage = heroSection?.image || heroSection?.background_image || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={heroHeading}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-chart-5/40 to-chart-4/40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10 py-20">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                  {heroHeading}
                </h1>
                <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
                  {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 h-14 shadow-xl shadow-primary/20 rounded-full bg-white text-primary hover:bg-white/90">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="secondary" size="lg" className="text-lg px-8 h-14 bg-white/20 backdrop-blur-sm shadow-md hover:bg-white/30 rounded-full text-white border border-white/30">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/25 via-chart-5/20 to-chart-4/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.2,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--chart-4)/0.15,transparent_50%)]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {heroHeading}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 h-14 shadow-xl shadow-primary/20 rounded-full">
                    Get Started
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="lg" className="text-lg px-8 h-14 bg-white/50 backdrop-blur-sm shadow-md hover:bg-white/80 rounded-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/30 to-chart-3/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Featured Books</h2>
                <p className="text-muted-foreground">Explore our latest pharmaceutical resources</p>
              </div>
              <Link href="/books">
                <Button variant="ghost" className="group">
                  View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {featuredBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/60 backdrop-blur-md">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
                      {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-muted-foreground">
                          <BookOpen className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">{book.title}</CardTitle>
                      {book.author && <CardDescription className="text-xs">By {book.author}</CardDescription>}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {book.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {book.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-primary/10 to-chart-4/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Latest Articles</h2>
                <p className="text-muted-foreground">Insights and updates from the industry</p>
              </div>
              <Link href="/blogs">
                <Button variant="ghost" className="group">
                  View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/60 backdrop-blur-md">
                    <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                      {blog.cover_image ? (
                        <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-muted-foreground">
                          <FileText className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</CardTitle>
                      {blog.subtitle && <CardDescription className="line-clamp-1">{blog.subtitle}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Threads Section */}
      {featuredThreads.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-chart-5/15 via-primary/10 to-chart-3/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Community Discussions</h2>
                <p className="text-muted-foreground">Join the conversation</p>
              </div>
              <Link href="/threads">
                <Button variant="ghost" className="group">
                  View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredThreads.map((thread) => (
                <Link key={thread.id} href={`/threads/${thread.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Discussion</span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{thread.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{thread.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {thread.author_name}</span>
                        <div className="flex gap-3">
                          <span>{thread.like_count} Likes</span>
                          <span>{thread.view_count} Views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-chart-5 to-chart-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--chart-2)/0.3,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,var(--chart-3)/0.25,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,var(--primary)/0.2,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to elevate your practice?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Join thousands of pharmaceutical professionals who trust ePharmatica for their daily knowledge needs.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-primary font-bold text-lg px-10 h-16 shadow-2xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
