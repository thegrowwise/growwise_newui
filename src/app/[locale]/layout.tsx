import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import ContentProvider from "@/components/providers/ContentProvider";
import { CartProvider } from "@/components/gw/CartContext";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import Chatbot from "@/components/chatbot/Chatbot";
import { locales } from '@/i18n/config';
import { PageTrackingWrapper } from '@/components/analytics/PageTrackingWrapper';
import { organizationSchema, localBusinessSchema, websiteSchema } from '@/lib/seo/structuredData';

// Default metadata - can be overridden by page-specific generateMetadata
export const metadata: Metadata = {
  title: "GrowWise - K-12 Education & STEAM Programs | Dublin, CA",
  description: "Expert K-12 tutoring and STEAM programs in Dublin, CA. Math, English, coding, and SAT prep. Personalized learning for every student. Book a free assessment today!",
  keywords: "tutoring Dublin CA, K-12 education, STEAM programs, math tutor, English tutor, coding classes, SAT prep Dublin, personalized learning",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <CartProvider>
        <ChatbotProvider>
          <ContentProvider>
            <PageTrackingWrapper>
              <Header />
              <main suppressHydrationWarning>
                {children}
              </main>
              <Footer />
              <Chatbot />
            </PageTrackingWrapper>
          </ContentProvider>
        </ChatbotProvider>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
