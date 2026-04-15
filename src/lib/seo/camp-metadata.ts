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

/** Hub page at `/camp` — lists all data-driven SEO camp landings. */
export function buildCampIndexMetadata(): Metadata {
  const url = `${base}/camp`;
  const title = "Summer camp tracks in Dublin, CA | GrowWise School";
  const description =
    "Structured summer programs at GrowWise in Dublin, CA—one campus; Tri-Valley families welcome. Browse AI Studio, robotics, game development, math, and writing tracks.";

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
