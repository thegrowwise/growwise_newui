import type { CampLandingPage } from "@/lib/camps/camp-types";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import EventSchema from "@/components/schema/EventSchema";
import { buildCampJsonLd } from "@/lib/seo/camp-jsonld";
import { absoluteSiteUrl } from "@/lib/publicPath";
import { CAMP_SLUG_SUMMER_WEEK_EVENT } from "@/lib/schema/camp-summer-week-events";
import { getCanonicalSiteUrl } from "@/lib/seo/siteUrl";

import { CampHero } from "./CampHero";
import { CampInquiryForm } from "./CampInquiryForm";
import { FAQSection } from "./FAQSection";
import { LocationSection } from "./LocationSection";
import { ProgramCardsSection } from "./ProgramCardsSection";
import { ScheduleSection } from "./ScheduleSection";
import { StickyCTA } from "./StickyCTA";
import { TrustBar } from "./TrustBar";

type CampLandingTemplateProps = {
  page: CampLandingPage;
  locale: string;
};

export function CampLandingTemplate({ page, locale }: CampLandingTemplateProps) {
  const jsonLd = buildCampJsonLd(page);
  const baseUrl = getCanonicalSiteUrl();
  const campUrl = absoluteSiteUrl(`/camps/${page.slug}`, locale, baseUrl);
  const weekEvent = CAMP_SLUG_SUMMER_WEEK_EVENT[page.slug];

  return (
    <>
      {/* Visible content first — JSON-LD was previously first in <main>, which can break React hydration (blank / flicker). */}
      <article className="relative z-10">
        <CampHero page={page} />
        <TrustBar page={page} />
        <ProgramCardsSection page={page} />
        <ScheduleSection page={page} />
        <LocationSection page={page} />
        <FAQSection page={page} />
        {/* key: fresh form state + defaultValues per slug (all CAMP_LANDING_PAGES). */}
        <CampInquiryForm key={page.slug} page={page} />
      </article>

      <StickyCTA page={page} />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: absoluteSiteUrl("/", locale, baseUrl) },
          {
            name: "Summer Camps",
            url: absoluteSiteUrl("/camps/summer", locale, baseUrl),
          },
          { name: page.h1, url: campUrl },
        ]}
      />

      {weekEvent ? (
        <EventSchema
          name={weekEvent.name}
          startDate={weekEvent.startDate}
          endDate={weekEvent.endDate}
          description={weekEvent.description}
          url={campUrl}
        />
      ) : null}

      {jsonLd.map((schema, i) => (
        <script
          key={`camp-jsonld-${page.slug}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
