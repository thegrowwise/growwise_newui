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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
                
                // Remove Vercel Speed Insights toolbar
                const removeVercelToolbar = () => {
                  // Remove Vercel Speed Insights widget
                  const vercelWidget = document.querySelector('[data-vercel-widget]');
                  if (vercelWidget) {
                    vercelWidget.remove();
                  }
                  
                  // Remove Vercel toolbar iframe
                  const vercelToolbar = document.querySelector('iframe[src*="vercel.com"]');
                  if (vercelToolbar) {
                    vercelToolbar.remove();
                  }
                  
                  // Remove Vercel Speed Insights script
                  const vercelScripts = document.querySelectorAll('script[src*="vercel.com"], script[src*="speed-insights"]');
                  vercelScripts.forEach(script => script.remove());
                  
                  // Hide Vercel toolbar via CSS
                  const style = document.createElement('style');
                  style.textContent = \`
                    [data-vercel-widget],
                    iframe[src*="vercel.com"],
                    [id*="vercel"],
                    [class*="vercel-toolbar"],
                    [class*="speed-insights"] {
                      display: none !important;
                      visibility: hidden !important;
                      opacity: 0 !important;
                      pointer-events: none !important;
                    }
                  \`;
                  document.head.appendChild(style);
                };
                
                removeExtensionAttributes();
                removeVercelToolbar();
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    removeExtensionAttributes();
                    removeVercelToolbar();
                  });
                } else {
                  removeExtensionAttributes();
                  removeVercelToolbar();
                }
                
                // Watch for Vercel toolbar being added dynamically
                const observer = new MutationObserver(() => {
                  removeExtensionAttributes();
                  removeVercelToolbar();
                });
                
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'cz-shortcut-listen', 'data-vercel-widget'],
                });
                
                // Keep watching for a longer period to catch late-loading Vercel scripts
                setTimeout(() => {
                  removeVercelToolbar();
                }, 2000);
                
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
