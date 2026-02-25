import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import GTM from '../components/analytics/GTM';
// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use font-display: swap for better performance
  variable: '--font-inter',
  preload: true,
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
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="dns-prefetch" href="https://growwise-assets.s3.us-west-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api.growwiseschool.org" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="absolute left-[-9999px] w-px h-px overflow-hidden focus:fixed focus:top-4 focus:left-4 focus:w-auto focus:h-auto focus:px-4 focus:py-2 focus:bg-[#1F396D] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F16112] focus:z-[100] focus:overflow-visible"
        >
          Skip to main content
        </a>
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <GTM gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        ) : null}
        {children}
        {/* If GTM isn't configured, fall back to direct GoogleAnalytics integration */}
        {!process.env.NEXT_PUBLIC_GTM_ID && process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        }
      </body>
    </html>
  );
}
