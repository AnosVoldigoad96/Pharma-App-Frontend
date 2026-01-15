import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import type { SiteSettings } from "@/lib/supabase/types";

// Social media icon mapping
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

interface FooterProps {
  siteSettings: SiteSettings | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const brandName = siteSettings?.brand_name || "ePharmatica";
  const brandLogo = siteSettings?.brand_logo;
  const contactEmail = siteSettings?.contact_email;
  const contactPhone = siteSettings?.contact_phone;
  const contactAddress = siteSettings?.contact_address;
  const socialLinks = siteSettings?.social_links || [];

  // Quick links matching navigation
  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "Library", link: "/books" },
    { name: "Tools", link: "/tools" },
    { name: "Blogs", link: "/blogs" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* SECTION 1: Brand, Links, Contact, Follow */}
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* 1. Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              {brandLogo && (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                  <Image
                    src={brandLogo}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="relative object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#76c7a6]">
                {brandName}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Your trusted partner for pharmaceutical knowledge. Dedicated to providing
              comprehensive resources, tools, and community support.
            </p>

            {/* Follow Us */}
            <div className="pt-2">
              <h4 className="font-semibold text-foreground/90 mb-4">Follow Us</h4>
              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = socialIcons[link.platform.toLowerCase()] || ExternalLinkIcon;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                        aria-label={link.platform}
                        title={link.platform}
                      >
                        {link.icon ? (
                          <Image
                            src={link.icon}
                            alt={link.platform}
                            width={32}
                            height={32}
                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                        ) : (
                          <IconComponent className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        )}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Connect with us on social media.</p>
              )}
            </div>
          </div>

          {/* 2. Quick Links - Horizontal on Mobile, Vertical/Grid on Desktop */}
          <div className="flex flex-col gap-6">
            <h4 className="font-semibold text-foreground/90 mb-4">Quick Links</h4>
            <ul className="flex flex-row flex-wrap gap-x-8 gap-y-3 lg:flex-col lg:gap-y-3 lg:gap-x-0">
              {quickLinks.map((link) => (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact & Follow Us */}
          <div className="flex flex-col gap-8">
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground/90 mb-6">Contact Us</h4>
              <ul className="space-y-4">
                {contactAddress && (
                  <li className="flex items-start gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed pt-1.5">
                      {contactAddress}
                    </span>
                  </li>
                )}
                {contactPhone && (
                  <li className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Phone className="h-4 w-4" />
                    </div>
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors pt-0.5"
                    >
                      {contactPhone}
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors break-all pt-0.5"
                    >
                      {contactEmail}
                    </a>
                  </li>
                )}
              </ul>
            </div>


          </div>
        </div>
      </div>

      {/* SECTION 2: Newsletter (Inspired Design) */}
      <div className="relative border-y border-white/5 bg-muted/20 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              Newsletter
            </span>
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Stay Updated with Exclusive Resources
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Subscribe to our newsletter and be the first to know about new tools,
                community discussions, and pharmaceutical updates.
              </p>
            </div>
            <div className="w-full max-w-xl mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Copyright & Legal */}
      <div className="relative bg-background/90 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/50 underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/50 underline-offset-4"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Developer Credit */}
      <div className="relative bg-muted/30 py-4">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs text-muted-foreground/80 font-medium tracking-wide">
            Envisioned and Developed by <span className="text-primary font-bold">Dr. Hassaan Ahmad Qazi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
