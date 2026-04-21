import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { getValidLocale } from '@/i18n/localeConfig';
import { generateFAQPageSchema } from '@/lib/seo/structuredData';

const HOME_FAQS = [
  {
    question:
      'How do I know whether my child needs academic tutoring or something like coding or a summer camp?',
    answer:
      'GrowWise offers three distinct tracks. Academic support covers Math and English for Grades 1 through 12. STEAM programs cover coding, AI, and game development. Summer camps run week-long sessions in coding, robotics, math, and writing. The right starting point depends on whether your child is behind in school, wants to explore a new skill, or needs a structured summer program. A free assessment helps identify which track fits.',
  },
  {
    question:
      'My child struggles with homework every night and I cannot keep up with helping them \u2014 when is it time to get outside support?',
    answer:
      'If you are spending more than 30 minutes each night helping your child and it is still not clicking, that is a reliable signal that structured support would help more than parental re-teaching. GrowWise offers a free assessment that identifies exactly where the gap is and what format of support fits your child\u2019s learning style.',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const metadata = generateMetadataFromPath('/', locale);
  return metadata || { title: 'Grades 1-12 Tutoring & STEAM | Dublin CA | GrowWise' };
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  const baseUrl = getCanonicalSiteUrl();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "GrowWise — Grades 1-12 Tutoring & STEAM Programs in Dublin, CA",
    "description": "Grades 1-12 tutoring and STEAM in Dublin, CA. Math, English, coding, SAT prep, and camps. Small groups and personalized lessons. Book a free assessment.",
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

  const faqSchema = generateFAQPageSchema(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
