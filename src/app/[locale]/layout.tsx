import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ContentProvider from "@/components/providers/ContentProvider";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { locales } from '@/i18n/config';
import { PageTrackingWrapper } from '@/components/analytics/PageTrackingWrapper';
import { websiteSchema } from '@/lib/seo/structuredData';

const Header = dynamic(() => import("@/components/layout/Header/Header"));
const Footer = dynamic(() => import("@/components/layout/Footer/Footer"));
const LazyChatbot = dynamic(() => import("@/components/chatbot/LazyChatbot"), { ssr: false });

// Default metadata - can be overridden by page-specific generateMetadata
export const metadata: Metadata = {
  title: "Grades 1-12 Tutoring & STEAM | Dublin CA | GrowWise",
  description:
    "Grades 1-12 tutoring and STEAM in Dublin, CA. Math, English, coding, and SAT prep. Small groups, personalized lessons. Book a free assessment.",
  keywords: "tutoring Dublin CA, Grades 1-12 education, STEAM programs, math tutor, English tutor, coding classes, SAT prep Dublin, personalized learning",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* WebSite search JSON-LD — primary EducationalOrganization lives in root layout head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* CartProvider lives in app/layout.tsx so /enroll and [locale] routes share one cart */}
      <ChatbotProvider>
        <ContentProvider>
          <PageTrackingWrapper>
            <Header />
            <main id="main-content" suppressHydrationWarning>
              {children}
            </main>
            <Footer />
            <LazyChatbot />
          </PageTrackingWrapper>
        </ContentProvider>
      </ChatbotProvider>
    </NextIntlClientProvider>
  );
}
