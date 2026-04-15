import type { CampThemeVariant } from "@/lib/camps/camp-types";

export type CampThemeClasses = {
  accentText: string;
  heroBg: string;
  sectionMutedBg: string;
  cardBorder: string;
  focusRing: string;
};

export function getCampThemeClasses(variant: CampThemeVariant): CampThemeClasses {
  switch (variant) {
    case "stem":
      return {
        accentText: "text-[#1F396D]",
        heroBg: "bg-gradient-to-b from-slate-50 via-white to-white",
        sectionMutedBg: "bg-slate-50/80",
        cardBorder: "border border-[#1F396D]/15",
        focusRing: "focus-visible:ring-[#1F396D]",
      };
    case "creative":
      return {
        accentText: "text-[#1F396D]",
        heroBg: "bg-gradient-to-b from-amber-50/40 via-white to-white",
        sectionMutedBg: "bg-amber-50/30",
        cardBorder: "border border-[#F16112]/20",
        focusRing: "focus-visible:ring-[#F16112]",
      };
    default:
      return {
        accentText: "text-[#1F396D]",
        heroBg: "bg-gradient-to-b from-white via-slate-50/50 to-white",
        sectionMutedBg: "bg-slate-50",
        cardBorder: "border border-slate-200",
        focusRing: "focus-visible:ring-[#1F396D]",
      };
  }
}
