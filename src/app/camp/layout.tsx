import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ContentProvider from "@/components/providers/ContentProvider";
import { PageTrackingWrapper } from "@/components/analytics/PageTrackingWrapper";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { DEFAULT_LOCALE } from "@/i18n/localeConfig";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo/structuredData";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";

/** Keep chatbot deferred; header/footer are static imports to avoid Suspense/chunk flash on camp landings. */
const LazyChatbot = dynamic(() => import("@/components/chatbot/LazyChatbot"));

export const metadata: Metadata = {
  title: "Summer Camps | GrowWise School | Dublin, CA",
  description:
    "Summer camp landing pages for GrowWise School in Dublin, CA. One campus; Tri-Valley families welcome.",
  robots: { index: true, follow: true },
};

export default async function CampSectionLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages({ locale: DEFAULT_LOCALE });

  return (
    <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messages}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <ChatbotProvider>
        <ContentProvider>
          <PageTrackingWrapper>
            <Header />
            <main id="main-content" className="relative z-10 w-full min-h-[40vh]" suppressHydrationWarning>
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
