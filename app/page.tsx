import Link from "next/link";
export const dynamic = 'force-dynamic';
import { getBlogs, getBooks, getThreads, getSiteSettings, getPageContent, getFeatures } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { FeaturesSection } from "@/components/features-section";
import { BooksCarousel } from "@/components/books-carousel";
import { FundingNoticeSection } from "@/components/funding-notice-section";
import { FeaturedBlogsSection } from "@/components/featured-blogs-section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, MessageSquare, Clock, TrendingUp, Eye, ThumbsUp } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { AiChatSection } from "@/components/ai-chat-section";
import { Ribbon } from "@/components/ui/ribbon";

export default async function Home() {
  // Fetch data from Supabase
  const [blogsResult, booksResult, threadsResult, settingsResult, pageContentResult, featuresResult] = await Promise.all([
    getBlogs(3, true),
    getBooks(5, undefined, true),
    getThreads(7, true),
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section */}
      <HeroSection
        heroHeading={heroHeading}
        heroSubtitle={heroSubtitle}
        heroImage={heroImage}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-10 md:py-14 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Enhanced Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div className="space-y-3">
                <div className="inline-block">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                    Featured Books
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                </div>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Explore our curated collection of pharmaceutical resources
                </p>
              </div>
              <Link href="/books" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="lg"
                  className="group text-base backdrop-blur-sm bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all"
                >
                  View All
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Books Carousel */}
            <BooksCarousel books={featuredBooks} />
          </div >
        </section >
      )}

      {/* AI Chat Section */}
      <AiChatSection />

      {/* Featured Blogs Section */}
      <FeaturedBlogsSection blogs={featuredBlogs} />

      {/* Funding Notice Section */}
      <FundingNoticeSection />

      {/* Enhanced CTA Section with Glassmorphism */}
      <section className="py-28 md:py-36 bg-primary text-primary-foreground relative overflow-hidden">
        <Ribbon text="Join Now" />
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px',
            animation: 'moveBackground 20s linear infinite'
          }}></div>
        </div>

        {/* Gradient overlays with blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white"></div>
              <div className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white"></div>
              <div className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white"></div>
            </div>
            <span className="text-sm font-semibold text-white">Join 10,000+ professionals</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to elevate your <span className="text-white/90">pharmaceutical practice?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Access comprehensive resources, connect with experts, and stay updated with the latest in pharmaceutical science.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-primary font-bold text-lg px-10 h-16 rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-md hover:bg-white hover:scale-105 transition-transform shadow-2xl">
                Get Started Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="ghost" className="text-lg px-10 h-16 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-xl text-white border-2 border-white/40 hover:scale-105 transition-transform shadow-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
}
