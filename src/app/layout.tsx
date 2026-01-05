import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientAnalyticsProvider } from "@/components/providers/ClientAnalyticsProvider";

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
        {/* Favicon - Next.js will automatically use favicon.ico and icon.png from app directory */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://growwise-assets.s3.us-west-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://tlm2laiw0j.execute-api.us-west-1.amazonaws.com" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`} suppressHydrationWarning>
        <Script
          id="remove-extension-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeExtensionAttributes = () => {
                  const extensionAttributes = [
                    'bis_skin_checked',
                    'data-new-gr-c-s-check-loaded',
                    'data-gr-ext-installed',
                    'cz-shortcut-listen',
                  ];
                  
                  extensionAttributes.forEach(attr => {
                    const elements = document.querySelectorAll('[' + attr + ']');
                    elements.forEach(el => {
                      el.removeAttribute(attr);
                    });
                  });
                };
                
                removeExtensionAttributes();
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    removeExtensionAttributes();
                  });
                } else {
                  removeExtensionAttributes();
                }
                
                const observer = new MutationObserver(() => {
                  removeExtensionAttributes();
                });
                
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'cz-shortcut-listen'],
                });
                
                setTimeout(() => {
                  observer.disconnect();
                }, 10000);
              })();
            `,
          }}
        />
        <ClientAnalyticsProvider>
          {children}
        </ClientAnalyticsProvider>
      </body>
    </html>
  );
}
