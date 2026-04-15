import type { CampLandingPage } from "@/lib/camps/camp-types";
import { CheckCircle2 } from "lucide-react";

import { SectionContainer } from "./SectionContainer";
import { getCampThemeClasses } from "./page-theme";

type TrustBarProps = {
  page: CampLandingPage;
};

export function TrustBar({ page }: TrustBarProps) {
  const t = getCampThemeClasses(page.themeVariant);

  return (
    <SectionContainer className={t.sectionMutedBg} ariaLabel="Trust and credibility">
      <div className="max-w-5xl">
        <h2 className="sr-only">Why families choose GrowWise</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {page.trustBarItems.map((item) => (
            <li
              key={item.text}
              className="flex gap-3 rounded-xl bg-white/70 p-4 ring-1 ring-slate-200/80 shadow-sm"
            >
              <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${t.accentText}`} aria-hidden />
              <span className="text-sm sm:text-base text-slate-700 leading-snug">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
