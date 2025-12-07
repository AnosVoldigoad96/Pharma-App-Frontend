import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/supabase/queries";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

// Social media icon mapping
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export async function Footer() {
  const { data: siteSettings } = await getSiteSettings();

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
    { name: "Forums", link: "/threads" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <footer className="relative bg-background border-t border-border mt-auto overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Branding Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {brandLogo && (
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              )}
              <h3 className="text-xl font-bold">{brandName}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your trusted partner for pharmaceutical knowledge. Dedicated to providing 
              comprehensive resources, tools, and community support for healthcare professionals 
              and students.
            </p>
            {/* Why Choose Us - Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-2xl font-bold text-primary">50k+</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-xs text-muted-foreground">Resources</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {contactAddress}
                  </span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors break-all"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Follow Us & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {socialLinks.map((link, index) => {
                  const IconComponent = socialIcons[link.platform.toLowerCase()] || ExternalLinkIcon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={link.platform}
                    >
                      {link.icon ? (
                        <Image
                          src={link.icon}
                          alt={link.platform}
                          width={20}
                          height={20}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Stay updated with the latest pharmaceutical resources and updates.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>
                © {new Date().getFullYear()} {brandName}. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground/60">•</span>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}



