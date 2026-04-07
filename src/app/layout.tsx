import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import GTM from '../components/analytics/GTM';
import MetaPixel from '../components/analytics/MetaPixel';
import { CartProvider } from '@/components/gw/CartContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
});

export const metadata: Metadata = {
  title: "GrowWise - Unbox Potential | K-12 Education & STEAM Programs",
  description: "Empowering students through personalized K-12 education and innovative STEAM programs. Expert instruction, proven results, and flexible scheduling.",
  keywords: "K-12 education, STEAM programs, tutoring, SAT prep, math courses, coding classes, personalized learning",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Trim so hosting/env typos (trailing space/newline) don't break gtm.js?id= requests.
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Favicon - Next.js will automatically use favicon.ico and icon.png from app directory */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        {/* next/font (Inter) self-hosts — no Google Fonts preconnect needed */}
        <link rel="dns-prefetch" href="https://growwise-assets.s3.us-west-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api.growwiseschool.org" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="absolute -left-[9999px] focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1F396D] focus:text-white focus:rounded-md focus:no-underline">
          Skip to main content
        </a>
        {/* If GTM is configured, load GTM (script + noscript) immediately after opening <body> so the noscript iframe is available for no-JS users. */}
        {/* When gtmId is set, GA4 is expected via the GTM container (GA4 Configuration tag) — not the standalone gtag.js snippet (avoids duplicate hits). */}
        {gtmId ? <GTM gtmId={gtmId} /> : null}
        {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
        <CartProvider>
          {children}
        </CartProvider>
        {/* gtag only when GTM is off — lazyOnload avoids competing with LCP (GA third-party default is afterInteractive) */}
        {!gtmId && gaId ? (
          <>
            <Script
              id="_next-ga-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
            <Script
              id="_next-ga"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
