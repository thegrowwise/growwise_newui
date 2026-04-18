import type { CampLandingPage } from "@/lib/camps/camp-types";
import { cn } from "@/lib/utils";

import { getCampThemeClasses } from "./page-theme";

type CampHeroProps = {
  page: CampLandingPage;
};

export function CampHero({ page }: CampHeroProps) {
  const t = getCampThemeClasses(page.themeVariant);

  return (
    <header className={cn("border-b border-slate-200/80", t.heroBg)}>
      <div className="container-7xl py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            {page.h1}
          </h1>
          <p className={cn("mt-3 text-sm font-semibold tracking-wide uppercase", t.accentText)}>{page.eyebrow}</p>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">{page.heroSubtext}</p>

          {page.badges && page.badges.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Program highlights">
              {page.badges.map((b) => (
                <li
                  key={b.text}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium text-slate-700",
                    "bg-white/80 ring-1 ring-slate-200/80",
                  )}
                >
                  {b.text}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <a
              href={page.primaryCta.href}
              className="inline-flex justify-center items-center rounded-md bg-[#F16112] px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F16112]"
            >
              {page.primaryCta.label}
            </a>
            <a
              href={page.secondaryCta.href}
              className="inline-flex justify-center items-center rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F396D]"
            >
              {page.secondaryCta.label}
            </a>
          </div>

          {page.earlyBirdText ? (
            <p className="mt-6 text-sm text-slate-600 border-l-2 border-[#1F396D]/30 pl-4">{page.earlyBirdText}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
