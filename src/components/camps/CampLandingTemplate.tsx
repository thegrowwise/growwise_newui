import type { CampLandingPage } from "@/lib/camps/camp-types";
import { buildCampJsonLd } from "@/lib/seo/camp-jsonld";

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
};

export function CampLandingTemplate({ page }: CampLandingTemplateProps) {
  const jsonLd = buildCampJsonLd(page);

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={`camp-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="pb-32 sm:pb-36">
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
    </>
  );
}
