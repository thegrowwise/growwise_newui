import type { Metadata } from "next";
import Link from "next/link";
import { getAllCampPages } from "@/lib/camps/get-camp-page";
import { buildCampIndexMetadata } from "@/lib/seo/camp-metadata";
import { getCanonicalSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = buildCampIndexMetadata();

export default function CampLandingIndexPage() {
  const pages = getAllCampPages();
  const baseUrl = getCanonicalSiteUrl();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Summer Camp Programs — Dublin, CA | GrowWise",
    "description": "Summer camp tracks for K-12 students in Dublin, CA. One campus. Families enroll from across the Tri-Valley.",
    "url": `${baseUrl}/camps`,
    "itemListElement": pages.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.h1,
      "url": `${baseUrl}/camps/${p.slug}`,
      "description": p.metaDescription,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    <article className="bg-white pb-24">
      <header className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="container-7xl py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">GrowWise School · Summer · Dublin campus</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Summer camp tracks (Dublin, CA)</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
            GrowWise operates one physical campus in Dublin, California. Families from San Ramon, Pleasanton, Livermore, Danville, and nearby Tri-Valley cities enroll here—those are served areas families travel from, not additional GrowWise locations.
          </p>
        </div>
      </header>

      <section className="container-7xl py-12 sm:py-16 lg:py-20" aria-labelledby="camp-programs-heading">
        <h2 id="camp-programs-heading" className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Program pages
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Each page uses the same enrollment funnel: program detail, schedule framing, location clarity, FAQ, and inquiry form.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {pages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/camps/${p.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1F396D]/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2"
              >
                <span className="font-semibold text-slate-900">{p.h1}</span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600 line-clamp-3">{p.metaDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
    </>
  );
}
