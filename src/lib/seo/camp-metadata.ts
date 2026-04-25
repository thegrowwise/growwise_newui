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

/** Hub page at `/camps` — lists all data-driven SEO camp landings. */
export function buildCampIndexMetadata(): Metadata {
  const url = `${base}/camps`;
  const title = "STEAM & Academic Summer Camps in Dublin, CA | GrowWise School";
  const description =
    "STEAM & academic summer camps in Dublin, CA. Coding, AI, robotics, math, and writing for Grades 1–12. Book a free assessment today.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "GrowWise School",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
