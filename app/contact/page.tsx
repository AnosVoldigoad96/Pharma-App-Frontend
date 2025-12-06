import { getSiteSettings, getPageContent } from "@/lib/supabase/queries";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us | ePharmatica",
  description: "Get in touch with us - we'd love to hear from you",
};

export default async function ContactPage() {
  const [settingsResult, pageContentResult] = await Promise.all([
    getSiteSettings(),
    getPageContent("contact"),
  ]);

  const siteSettings = settingsResult.data;
  const pageContent = pageContentResult.data;

  // Extract hero section if available
  const heroSection = pageContent?.hero_section as Record<string, any> | null;
  const heroHeading = heroSection?.heading || heroSection?.title || "Contact Us";
  const heroSubtitle = heroSection?.subheading || heroSection?.subtitle || "Have a question or feedback? We'd love to hear from you.";
  const heroImage = heroSection?.image || heroSection?.background_image || null;

  const contactEmail = siteSettings?.contact_email;
  const contactPhone = siteSettings?.contact_phone;
  const contactAddress = siteSettings?.contact_address;
  const socialLinks = siteSettings?.social_links || [];

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
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {heroHeading}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="relative w-full py-12 md:py-16 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.7686_0.1647_70.0804/0.05),transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We're here to help! Reach out to us through any of the following channels.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              {contactEmail && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {contactPhone && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-primary hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {contactAddress && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {contactAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ExternalLink className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Follow Us</h3>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md hover:bg-muted transition-colors"
                        >
                          {link.icon && (
                            <Image
                              src={link.icon}
                              alt={link.platform}
                              width={20}
                              height={20}
                              className="object-contain"
                              unoptimized
                            />
                          )}
                          <span className="text-sm font-medium">{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
