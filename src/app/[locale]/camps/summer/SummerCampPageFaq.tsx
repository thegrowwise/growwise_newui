'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface SummerCampFaqItem {
  question: string;
  answer: string;
}

export function SummerCampPageFaq({
  faqs,
  loading,
}: {
  faqs: SummerCampFaqItem[];
  loading: boolean;
}) {
  const t = useTranslations('summerCamp');
  const [openFaqValue, setOpenFaqValue] = useState<string | undefined>('faq-0');

  return (
    <section
      className="py-16 md:py-24 bg-white border-t border-slate-200"
      aria-labelledby="faq-heading"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-14">
          <h2
            id="faq-heading"
            className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-slate-900 mb-3"
          >
            {t('faq.title')}
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </header>
        {loading ? (
          <div
            className="max-w-4xl mx-auto space-y-3 animate-pulse"
            aria-busy="true"
            aria-label="Loading FAQs"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl" />
            ))}
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={openFaqValue}
            onValueChange={(next) =>
              setOpenFaqValue((prev) => (next === prev ? undefined : next))
            }
            className="max-w-4xl mx-auto space-y-3"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden data-[state=open]:border-[#1F396D]/30 data-[state=open]:bg-white data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-[#1F396D]/10"
              >
                <AccordionTrigger className="py-4 px-5 md:py-5 md:px-6 text-left hover:no-underline hover:bg-slate-100/50 focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-inset focus-visible:outline-none rounded-xl [&[data-state=open]]:bg-white [&[data-state=open]]:rounded-b-none">
                  <span className="font-semibold text-base md:text-lg text-slate-900 pr-6 leading-snug block">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-slate-600 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
