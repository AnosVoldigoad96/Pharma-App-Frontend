"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Logo component with error handling
const LogoImage = ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-contain"
      unoptimized
    />
  );
};

const navItems = [
  { name: "Home", link: "/" },
  { name: "Library", link: "/books" },
  { name: "Tools", link: "/tools" },
  { name: "Blogs", link: "/blogs" },
  { name: "Forums", link: "/threads" },
  { name: "About", link: "/about" },
];

interface NavigationProps {
  brandName: string;
  brandLogo: string | null;
}

export function Navigation({ brandName, brandLogo }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="relative w-full border-b border-border bg-background shadow-sm">
      {/* Desktop Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex flex-row items-center justify-between h-16">
          {/* Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group relative">
              {brandLogo && (
                <div className="relative">
                  <LogoImage
                    src={brandLogo}
                    alt={brandName}
                    width={36}
                    height={36}
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-all duration-300 relative">
                {brandName}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </span>
            </Link>
          </div>

          {/* Navigation Links (Center) */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.link || pathname?.startsWith(item.link + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side (Auth & Theme) */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 group"
                >
                  {profile?.avatar_url ? (
                    <div className="relative">
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || "Profile"}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-chart-5/20 text-primary flex items-center justify-center font-semibold group-hover:from-primary/30 group-hover:to-chart-5/30 transition-all duration-300">
                      {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="rounded-md bg-gradient-to-r from-primary to-chart-5 hover:from-primary/90 hover:to-chart-5/90 text-white border-2 border-primary/30 hover:border-primary/50 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              {brandLogo && (
                <LogoImage
                  src={brandLogo}
                  alt={brandName}
                  width={32}
                  height={32}
                />
              )}
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                {brandName}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.link || pathname?.startsWith(item.link + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-muted/50"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-border/40">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 mb-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300"
                    >
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name || "Profile"}
                          width={44}
                          height={44}
                          className="rounded-full ring-2 ring-primary/20"
                          unoptimized
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-chart-5/20 text-primary flex items-center justify-center font-semibold">
                          {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="font-semibold block">{profile?.full_name || user.email}</span>
                        <span className="text-sm text-muted-foreground">View Profile</span>
                      </div>
                    </Link>
                    <Button onClick={handleSignOut} variant="destructive" className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-300">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-chart-5 hover:from-primary/90 hover:to-chart-5/90 text-white border-2 border-primary/30 hover:border-primary/50 transition-all duration-300">
                      Get Started
                    </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
