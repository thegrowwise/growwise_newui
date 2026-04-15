import type { CampLandingPage } from "@/lib/camps/camp-types";

import { SectionContainer } from "./SectionContainer";
import { getCampThemeClasses } from "./page-theme";

type ProgramCardsSectionProps = {
  page: CampLandingPage;
};

export function ProgramCardsSection({ page }: ProgramCardsSectionProps) {
  const t = getCampThemeClasses(page.themeVariant);

  return (
    <SectionContainer id="program" className="bg-white">
      <div className="max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">Program structure</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">What students work on</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Clear outcomes, explicit sequencing, and instructor-led accountability—without turning camp into a vague “activities” list.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.programCards.map((card) => (
            <article
              key={card.title}
              className={`flex flex-col rounded-2xl bg-white p-6 shadow-sm ${t.cardBorder}`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">{card.description}</p>
              {card.bullets && card.bullets.length > 0 ? (
                <ul className="mt-4 list-disc pl-5 text-sm text-slate-600 space-y-2">
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
