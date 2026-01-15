import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./hero-animations.css";
import { AuthProvider } from "@/contexts/auth-context";
import { getSiteSettings } from "@/lib/supabase/queries";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AudioChatWidget } from "@/components/audio-chat-widget";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ePharmatica - Pharmaceutical Knowledge Platform",
  description: "Your comprehensive pharmaceutical knowledge platform with books, articles, and community discussions",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: "/site.webmanifest",
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
      <head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body
        className={`${roboto.variable} font-sans antialiased`}
        suppressHydrationWarning
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
            <AudioChatWidget />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

