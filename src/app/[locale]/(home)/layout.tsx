import type { ReactNode } from 'react';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';

// LCP: preload hero image only on home so first paint isn't blocked on other routes
const HERO_IMAGE_PRELOAD = '/assets/hero-master-the-core.jpg';

export default function HomeLayout({ children }: { children: ReactNode }) {
  const baseUrl = getCanonicalSiteUrl();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "GrowWise — K-12 Tutoring & STEAM Programs in Dublin, CA",
    "description": "Expert K-12 tutoring and STEAM programs in Dublin, CA. Math, English, coding, SAT prep, and camps. Personalized learning, small groups, proven results. Book a free assessment today.",
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
      <link
        rel="preload"
        as="image"
        href={HERO_IMAGE_PRELOAD}
        fetchPriority="high"
      />
      {children}
    </>
  );
}
