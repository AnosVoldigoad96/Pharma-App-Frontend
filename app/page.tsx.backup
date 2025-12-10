import Link from "next/link";
import { getBlogs, getBooks, getThreads, getSiteSettings, getPageContent, getFeatures } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, MessageSquare } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";

export default async function Home() {
  // Fetch data from Supabase
  const [blogsResult, booksResult, threadsResult, settingsResult, pageContentResult, featuresResult] = await Promise.all([
    getBlogs(3, true),
    getBooks(5, undefined, true),
    getThreads(3, true),
    getSiteSettings(),
    getPageContent("home"),
    getFeatures(),
  ]);

  const featuredBlogs = blogsResult.data || [];
  const featuredBooks = booksResult.data || [];
  const featuredThreads = threadsResult.data || [];
  const siteSettings = settingsResult.data;
  const pageContent = pageContentResult.data;
  const features = featuresResult.data || [];

  // Extract hero section data
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heroHeading = heroSection?.heading || heroSection?.title || `Welcome to ${siteSettings?.brand_name || "ePharmatica"} `;
  const heroSubtitle = heroSection?.subheading || heroSection?.subtitle || "Your comprehensive pharmaceutical knowledge platform";
  const heroImage = heroSection?.image || heroSection?.background_image || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Vortex Background */}
      <HeroSection 
        heroHeading={heroHeading}
        heroSubtitle={heroSubtitle}
        heroImage={heroImage}
      />

      {/* Features Section */}
      {features.length > 0 && <FeaturesSection features={features} />}

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
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
                  <Card className="h-full transition-all duration-300 group border-2 border-border hover:border-primary/50 bg-card">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-md">
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
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/20 text-primary font-medium border border-primary/20">
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
        <section className="py-16 md:py-24 bg-background">
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
                  <Card className="h-full transition-all duration-300 group border-2 border-border hover:border-primary/50 bg-card">
                    <div className="aspect-video relative overflow-hidden rounded-t-md">
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
        <section className="py-16 md:py-24 bg-background">
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
                  <Card className="h-full transition-all duration-300 border-2 border-border hover:border-primary/50 bg-card">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-primary/20 text-primary border border-primary/20">
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
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to elevate your practice?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Join thousands of pharmaceutical professionals who trust ePharmatica for their daily knowledge needs.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-primary font-bold text-lg px-10 h-16 rounded-md border-2 border-white/30 bg-white/90 hover:bg-white">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
