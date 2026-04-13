import type { CampFaqItem, CampLandingPage } from "@/lib/camps/camp-types";
import { getCanonicalSiteUrl } from "@/lib/seo/siteUrl";

const base = getCanonicalSiteUrl();

function faqSchema(items: readonly CampFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function webPageSchema(page: CampLandingPage) {
  const url = `${base}/camp/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.seoTitle,
    description: page.metaDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "GrowWise School",
      url: base,
    },
    about: {
      "@type": "EducationalOrganization",
      name: "GrowWise School",
      url: base,
    },
  };
}

/**
 * JSON-LD aligned to visible page content only (FAQ answers must match FAQ section).
 */
export function buildCampJsonLd(page: CampLandingPage): object[] {
  const out: object[] = [webPageSchema(page)];
  if (page.faqItems.length > 0) {
    out.push(faqSchema(page.faqItems));
  }
  return out;
}
