"use client";

import type { CampLandingPage } from "@/lib/camps/camp-types";

type StickyCTAProps = {
  page: CampLandingPage;
};

export function StickyCTA({ page }: StickyCTAProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      role="region"
      aria-label="Call to action"
    >
      <div className="container-7xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left">{page.stickyCtaText}</p>
        <a
          href={page.stickyCtaButton.href}
          className="inline-flex justify-center rounded-md bg-[#1F396D] px-5 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-[#162d54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F396D]"
        >
          {page.stickyCtaButton.label}
        </a>
      </div>
    </div>
  );
}
