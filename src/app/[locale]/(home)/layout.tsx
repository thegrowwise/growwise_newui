import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { getValidLocale } from '@/i18n/localeConfig';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const metadata = generateMetadataFromPath('/', locale);
  return metadata || { title: 'K-12 Tutoring & STEAM | Dublin CA | GrowWise' };
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  const baseUrl = getCanonicalSiteUrl();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "GrowWise — K-12 Tutoring & STEAM Programs in Dublin, CA",
    "description": "K-12 tutoring and STEAM in Dublin, CA. Math, English, coding, SAT prep, and camps. Small groups and personalized lessons. Book a free assessment.",
    "url": baseUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "about": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {children}
    </>
  );
}
