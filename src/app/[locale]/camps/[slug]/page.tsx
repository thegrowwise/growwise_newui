import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampLandingTemplate } from "@/components/camps/CampLandingTemplate";
import { getCampPage, getCampSlugs } from "@/lib/camps/get-camp-page";
import { buildCampMetadata } from "@/lib/seo/camp-metadata";

/**
 * SEO camp landing pages live at `/camps/:slug` (canonical).
 * Slugs are data-driven from `CAMP_LANDING_PAGES`.
 */
export function generateStaticParams() {
  return getCampSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCampPage(slug);
  if (!page) return {};
  return buildCampMetadata(page);
}

export default async function CampsSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const page = getCampPage(slug);
  if (!page) {
    notFound();
  }
  return <CampLandingTemplate page={page} locale={locale} />;
}
