import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeInjector } from "@/components/theme-injector";
import { ThemeScript } from "@/components/theme-script";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { getSiteSettings } from "@/lib/supabase/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ePharmatica - Pharmaceutical Knowledge Platform",
  description: "Your comprehensive pharmaceutical knowledge platform with books, articles, and community discussions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings to get theme colors
  const { data: settings } = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Inject theme colors from database as CSS variables */}
          <ThemeInjector settings={settings} />
          {/* Client-side theme updater for dynamic changes */}
          <ThemeScript settings={settings} />
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation 
                brandName={settings?.brand_name || "ePharmatica"}
                brandLogo={settings?.brand_logo}
              />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
