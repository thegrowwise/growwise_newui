"use client";

import type { CampLandingPage } from "@/lib/camps/camp-types";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { SectionContainer } from "./SectionContainer";

type FAQSectionProps = {
  page: CampLandingPage;
};

export function FAQSection({ page }: FAQSectionProps) {
  return (
    <SectionContainer id="faq" className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">FAQ</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">Questions parents ask before enrolling</h2>
        <p className="mt-3 text-slate-600">
          Straight answers—especially on location, format, and expectations.
        </p>

        <Accordion type="single" collapsible className="mt-8 w-full rounded-xl bg-white p-2 ring-1 ring-slate-200 shadow-sm">
          {page.faqItems.map((item, idx) => (
            <AccordionItem key={item.question} value={`faq-${idx}`} className="border-slate-200 px-2">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-slate-600 leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
}
