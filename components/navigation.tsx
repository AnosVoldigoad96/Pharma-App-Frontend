"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar, NavBody, NavItems, MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavbarButton } from "@/components/ui/resizable-navbar";
import { ModeToggle } from "@/components/mode-toggle";


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
    <Navbar className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop Navigation */}
      <NavBody>
        {/* Logo */}
        <Link href="/" className="relative z-20 flex items-center space-x-2 px-2 py-1">
          {brandLogo && (
            <Image
              src={brandLogo}
              alt={brandName}
              width={30}
              height={30}
              className="object-contain"
              unoptimized
            />
          )}
          <span className="font-medium text-foreground">{brandName}</span>
        </Link>

        {/* Navigation Items */}
        <NavItems items={navItems} />

        {/* Auth Buttons */}
        <div className="relative z-20 flex items-center gap-2">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                    {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <NavbarButton as="button" onClick={handleSignOut} variant="secondary">
                Sign Out
              </NavbarButton>
            </>
          ) : (
            <NavbarButton href="/login" variant="secondary">
              Sign In
            </NavbarButton>
          )}
          <ModeToggle />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" className="flex items-center space-x-2">
            {brandLogo && (
              <Image
                src={brandLogo}
                alt={brandName}
                width={24}
                height={24}
                className="object-contain"
                unoptimized
              />
            )}
            <span className="font-medium text-foreground">{brandName}</span>
          </Link>
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "text-base font-medium",
                pathname === item.link ? "text-primary" : "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-border">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 mb-4"
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "Profile"}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                      {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{profile?.full_name || user.email}</span>
                </Link>
                <Button onClick={handleSignOut} variant="destructive" className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="secondary" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
