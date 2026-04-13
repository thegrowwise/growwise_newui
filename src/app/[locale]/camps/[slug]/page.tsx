import { notFound, redirect } from "next/navigation";
import { getCampPage, getCampSlugs } from "@/lib/camps/get-camp-page";

/**
 * Plural `/camps/:slug` is a common mistake for SEO camp landings, which live at `/camp/:slug`.
 * Redirect only when the slug matches a defined camp page so `/camps/summer` etc. stay untouched.
 */
export function generateStaticParams() {
  return getCampSlugs().map((slug) => ({ slug }));
}

export default async function CampsSlugRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  if (!getCampPage(slug)) {
    notFound();
  }
  redirect(`/camp/${slug}`);
}
