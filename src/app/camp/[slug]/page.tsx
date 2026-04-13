import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampLandingTemplate } from "@/components/camps/CampLandingTemplate";
import { getCampPage, getCampSlugs } from "@/lib/camps/get-camp-page";
import { buildCampMetadata } from "@/lib/seo/camp-metadata";

type CampPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCampSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CampPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCampPage(slug);
  if (!page) {
    return {};
  }
  return buildCampMetadata(page);
}

export default async function CampLandingPageRoute({ params }: CampPageProps) {
  const { slug } = await params;
  const page = getCampPage(slug);
  if (!page) {
    notFound();
  }

  return <CampLandingTemplate page={page} />;
}
