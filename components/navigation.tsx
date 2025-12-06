"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [mounted, setMounted] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Navbar>
      <NavBody>
        <Link
          href="/"
          className="relative z-30 flex items-center space-x-2 px-2 py-1 text-sm font-bold text-foreground"
        >
          {brandLogo && (
            <LogoImage
              src={brandLogo}
              alt={brandName}
              width={30}
              height={30}
            />
          )}
          <span className="font-bold text-xl whitespace-nowrap">{brandName}</span>
        </Link>
        <NavItems items={navItems} />
        <div className="relative z-30 flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:ring-2 hover:ring-primary transition-all"
                title={profile?.full_name || user.email || "Profile"}
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <NavbarButton href="/login" variant="primary">
              Login
            </NavbarButton>
          )}
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-bold text-foreground"
          >
            {brandLogo && (
              <LogoImage
                src={brandLogo}
                alt={brandName}
                width={30}
                height={30}
              />
            )}
            <span className="font-bold text-xl">{brandName}</span>
          </Link>
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-4 flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          )}
          
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <span>{profile?.full_name || user.email?.split("@")[0] || "Profile"}</span>
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
            >
              Login
            </Link>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
