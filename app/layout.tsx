import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { getSiteSettings } from "@/lib/supabase/queries";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
  // Fetch site settings to get theme colors and footer data
  const { data: settings } = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthLayoutWrapper
              brandName={settings?.brand_name || "ePharmatica"}
              brandLogo={settings?.brand_logo || null}
              footerData={settings}
            >
              {children}
            </AuthLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

