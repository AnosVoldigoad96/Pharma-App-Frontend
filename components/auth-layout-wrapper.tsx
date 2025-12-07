"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { SiteSettings } from "@/lib/supabase/types";

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  brandName: string;
  brandLogo: string | null;
  footerData: SiteSettings | null;
}

export function AuthLayoutWrapper({ children, brandName, brandLogo, footerData }: AuthLayoutWrapperProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation brandName={brandName} brandLogo={brandLogo} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer siteSettings={footerData} />
    </div>
  );
}

