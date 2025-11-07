import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ClientAnalyticsProvider } from "@/components/providers/ClientAnalyticsProvider";

export const metadata: Metadata = {
  title: "GrowWise - Unbox Potential | K-12 Education & STEAM Programs",
  description: "Empowering students through personalized K-12 education and innovative STEAM programs. Expert instruction, proven results, and flexible scheduling.",
  keywords: "K-12 education, STEAM programs, tutoring, SAT prep, math courses, coding classes, personalized learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
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
                  document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                } else {
                  removeExtensionAttributes();
                }
                
                const observer = new MutationObserver(() => {
                  removeExtensionAttributes();
                });
                
                observer.observe(document.documentElement, {
                  attributes: true,
                  attributeFilter: ['bis_skin_checked', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'cz-shortcut-listen'],
                  subtree: true
                });
                
                setTimeout(() => {
                  observer.disconnect();
                }, 5000);
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
