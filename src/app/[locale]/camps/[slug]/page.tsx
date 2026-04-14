import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampLandingTemplate } from "@/components/camps/CampLandingTemplate";
import { getCampLandingStaticParams } from "@/lib/camps/camp-routes";
import { getCampPage } from "@/lib/camps/get-camp-page";
import { buildCampMetadata } from "@/lib/seo/camp-metadata";

type CampSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getCampLandingStaticParams();
}

export async function generateMetadata({ params }: CampSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCampPage(slug);
  if (!page) {
    return {};
  }
  return buildCampMetadata(page);
}

export default async function CampsSlugLandingRoute({ params }: CampSlugPageProps) {
  const { slug } = await params;
  const page = getCampPage(slug);
  if (!page) {
    notFound();
  }

  return <CampLandingTemplate page={page} />;
}
