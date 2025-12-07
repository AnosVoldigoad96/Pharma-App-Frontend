import { getSiteSettings, getTeamMembers, getAboutUs, getPageContent, getSEOMetadata } from "@/lib/supabase/queries";
import { BookOpen, Calculator, MessageSquare, Users, Target, Lightbulb, Heart, Shield, LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  MessageSquare,
  Users,
  Target,
  Lightbulb,
  Heart,
  Shield,
};

export async function generateMetadata(): Promise<Metadata> {
  const { data: seoMetadata } = await getSEOMetadata("about");
  
  return {
    title: seoMetadata?.meta_title || "About Us | ePharmatica",
    description: seoMetadata?.meta_description || "Learn about ePharmatica - your comprehensive pharmaceutical knowledge platform",
    keywords: seoMetadata?.keywords ? seoMetadata.keywords.split(",").map(k => k.trim()) : undefined,
  };
}

export default async function AboutPage() {
  const [settingsResult, teamResult, aboutUsResult, pageContentResult] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getAboutUs(),
    getPageContent("about"),
  ]);

  const siteSettings = settingsResult.data;
  const teamMembers = teamResult.data || [];
  const aboutUs = aboutUsResult.data;
  const pageContent = pageContentResult.data;

  const brandName = siteSettings?.brand_name || "ePharmatica";

  // Extract hero section from page_content
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heroHeading = heroSection?.heading || heroSection?.title || "About ePharmatica";
  const heroSubtitle = heroSection?.subheading || heroSection?.subtitle || "Your comprehensive pharmaceutical knowledge platform";
  const heroImage = heroSection?.image || heroSection?.background_image || null;

  const missionTitle = aboutUs?.mission_title || "Our Mission";
  const missionContent = aboutUs?.mission_content || "To provide accessible, reliable, and up-to-date pharmaceutical knowledge to healthcare professionals, students, and the general public.";
  
  const visionTitle = aboutUs?.vision_title || "Our Vision";
  const visionContent = aboutUs?.vision_content || "To become the leading global platform for pharmaceutical education and knowledge sharing.";

  const featuresTitle = aboutUs?.features_section_title || "What We Offer";
  const featuresSubtitle = aboutUs?.features_section_subtitle || "Comprehensive tools and resources to support your pharmaceutical learning journey";
  const features = aboutUs?.features || [];

  const valuesTitle = aboutUs?.values_section_title || "Our Core Values";
  const valuesSubtitle = aboutUs?.values_section_subtitle || "The principles that guide everything we do";
  const values = aboutUs?.values || [];

  const ctaHeading = aboutUs?.cta_heading || "Join Our Community";
  const ctaDescription = aboutUs?.cta_description || "Whether you're a healthcare professional, student, or someone interested in pharmaceutical knowledge, we welcome you to explore, learn, and contribute to our growing community.";
  const ctaPrimaryText = aboutUs?.cta_primary_button_text || "Get Started";
  const ctaPrimaryLink = aboutUs?.cta_primary_button_link || "/signup";
  const ctaSecondaryText = aboutUs?.cta_secondary_button_text || "Contact Us";
  const ctaSecondaryLink = aboutUs?.cta_secondary_button_link || "/contact";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroImage ? (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
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
        <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/25 via-chart-5/20 to-chart-4/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.2,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--chart-4)/0.15,transparent_50%)]" />
            <div className="mx-auto max-w-7xl px-4 text-center relative z-10 py-16 md:py-24">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {heroHeading}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {(missionContent || visionContent) && (
        <section className="relative w-full py-12 md:py-16 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {missionContent && (
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">{missionTitle}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {missionContent}
                </p>
              </div>
            )}

            {visionContent && (
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">{visionTitle}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {visionContent}
                </p>
              </div>
            )}
            </div>
          </div>
        </section>
      )}

      {/* What We Offer */}
      {features.length > 0 && (
        <section className="relative w-full py-12 md:py-16 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{featuresTitle}</h2>
            {featuresSubtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {featuresSubtitle}
              </p>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || BookOpen;
              return (
                <Link
                  key={index}
                  href={feature.link || "#"}
                  className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary"
                >
                  <IconComponent className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </Link>
              );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <section className="relative w-full py-12 md:py-16 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{valuesTitle}</h2>
            {valuesSubtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {valuesSubtitle}
              </p>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {values.map((value, index) => {
              const IconComponent = iconMap[value.icon] || Shield;
              return (
                <div key={index} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 bg-muted/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals behind {brandName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border rounded-lg p-6 text-center"
              >
                {member.image_url && (
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}
                {(member.linkedin_url || member.twitter_url) && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ctaHeading}
          </h2>
          {ctaDescription && (
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {ctaDescription}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ctaPrimaryLink}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              {ctaPrimaryText}
            </Link>
            <Link
              href={ctaSecondaryLink}
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors font-medium"
            >
              {ctaSecondaryText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
