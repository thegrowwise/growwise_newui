import type { CampLandingPage } from "@/lib/camps/camp-types";

import { getCampThemeClasses } from "./page-theme";

type ServiceAreaStripProps = {
  page: CampLandingPage;
};

export function ServiceAreaStrip({ page }: ServiceAreaStripProps) {
  const { sectionMutedBg } = getCampThemeClasses(page.themeVariant);

  return (
    <div className={`rounded-2xl px-4 py-4 sm:px-6 ${sectionMutedBg} ring-1 ring-slate-200/80`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Families often join us from</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Served cities and areas">
        {page.servedCities.map((c) => (
          <li key={c.name}>
            <span
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-800 ring-1 ring-slate-200"
              title={c.note}
            >
              {c.name}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-600 leading-relaxed">
        These are common Tri-Valley origins for families who enroll at GrowWise. Instruction occurs at our Dublin campus only—we do not operate additional physical campuses in other cities.
      </p>
    </div>
  );
}
