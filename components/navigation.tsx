"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/books" },
  { label: "Tools", href: "/tools" },
  { label: "Blogs", href: "/blogs" },
  { label: "Forums", href: "/threads" },
  { label: "About", href: "/about" },
];

interface NavigationProps {
  brandName: string;
  brandLogo: string | null;
}

export function Navigation({ brandName, brandLogo }: NavigationProps) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  // Helper component to swallow the 'visible' prop passed by NavBody
  // so it doesn't get passed to the div and cause a React warning.
  const NavbarSection = ({ visible, className, children }: { visible?: boolean; className?: string; children: React.ReactNode }) => (
    <div className={className}>{children}</div>
  );

  const rightElement = (
    <NavbarSection className="flex items-center gap-2 relative z-50">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-border hover:ring-primary transition-all">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  fill
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-lg">
                  {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </Link>
      )}
      <ModeToggle />
    </NavbarSection>
  );

  const mobileBottomElement = (
    <div className="flex flex-col gap-4 w-full mt-4 border-t border-border pt-4">
      {user ? (
        <>
          <Link href="/profile" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
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
          <div className="flex gap-2 w-full">
            <Button onClick={handleSignOut} variant="destructive" className="flex-1">
              Sign Out
            </Button>
            <ModeToggle />
          </div>
        </>
      ) : (
        <div className="flex gap-2 w-full">
          <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="secondary" className="w-full">Sign In</Button>
          </Link>
          <ModeToggle />
        </div>
      )}
    </div>
  );

  const Logo = ({ visible }: { visible?: boolean }) => (
    <Link href="/" className="flex items-center gap-2 relative z-50">
      {brandLogo && (
        <Image
          src={brandLogo}
          alt={brandName}
          width={32}
          height={32}
          className="rounded-lg"
        />
      )}
      <span
        className={`font-bold text-lg hidden sm:block transition-all duration-300 ${visible ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          }`}
      >
        {brandName}
      </span>
    </Link>
  );

  return (
    <Navbar className="w-full">
      <NavBody>
        <Logo />
        <NavItems
          items={navItems.map((item) => ({ name: item.label, link: item.href }))}
        />
        {rightElement}
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <div className="grid grid-cols-3 gap-2 w-full">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center justify-center px-2 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors text-center border border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {mobileBottomElement}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
