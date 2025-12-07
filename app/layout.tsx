import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { getSiteSettings } from "@/lib/supabase/queries";

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
  // Fetch site settings to get theme colors
  const { data: settings } = await getSiteSettings();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation
              brandName={settings?.brand_name || "ePharmatica"}
              brandLogo={settings?.brand_logo || null}
            />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
