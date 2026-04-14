import type { Metadata } from "next";
import type { CampLandingPage } from "@/lib/camps/camp-types";
import { getCanonicalSiteUrl } from "@/lib/seo/siteUrl";

const base = getCanonicalSiteUrl();

export function buildCampMetadata(page: CampLandingPage): Metadata {
  const url = `${base}/camps/${page.slug}`;
  const title = page.seoTitle;
  const description = page.metaDescription;
  const ogTitle = page.ogTitle ?? title;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: "GrowWise School",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
