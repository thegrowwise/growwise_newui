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
