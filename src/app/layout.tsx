import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConsentAndAnalytics } from '@/components/analytics/ConsentAndAnalytics';
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
        <ConsentAndAnalytics />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
