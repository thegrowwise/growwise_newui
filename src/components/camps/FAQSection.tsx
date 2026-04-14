"use client";

import type { CampLandingPage } from "@/lib/camps/camp-types";
import { HelpCircle } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { SectionContainer } from "./SectionContainer";

type FAQSectionProps = {
  page: CampLandingPage;
};

export function FAQSection({ page }: FAQSectionProps) {
  return (
    <SectionContainer id="faq" className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Frequently Asked <span className="text-[#F16112]">Questions</span>
        </h2>
        <p className="mt-3 text-center text-slate-600">
          Get answers to common questions about GrowWise, our programs, and enrollment process.
        </p>

        {/* NOTE: Our Accordion implementation forwards the root `className` to each Header/Trigger.
           Keep spacing on an outer wrapper so rows stay visually consistent. */}
        <div className="mt-10 space-y-3">
          <Accordion type="single" collapsible className="w-full">
            {page.faqItems.map((item, idx) => (
              <AccordionItem
                key={item.question}
                value={`faq-${idx}`}
                className="border-0 rounded-xl bg-white shadow-sm ring-1 ring-slate-200/90 overflow-hidden"
              >
                <AccordionTrigger className="px-4 sm:px-5 py-4 text-left hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F16112]/10 ring-1 ring-[#F16112]/15"
                      aria-hidden
                    >
                      <HelpCircle className="h-4 w-4 text-[#F16112]" />
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900">{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-600">Still have questions?</p>
          <a
            href="#inquiry"
            className="mt-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-[#F16112] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
