'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question:
      'How do I know whether my child needs academic tutoring or something like coding or a summer camp?',
    answer:
      'GrowWise offers three distinct tracks. Academic support covers Math and English for Grades 1 through 12. STEAM programs cover coding, AI, and game development. Summer camps run week-long sessions in coding, robotics, math, and writing. The right starting point depends on whether your child is behind in school, wants to explore a new skill, or needs a structured summer program. A free assessment helps identify which track fits.',
  },
  {
    question:
      'My child struggles with homework every night and I cannot keep up with helping them — when is it time to get outside support?',
    answer:
      'If you are spending more than 30 minutes each night helping your child and it is still not clicking, that is a reliable signal that structured support would help more than parental re-teaching. GrowWise offers a free assessment that identifies exactly where the gap is and what format of support fits your child\u2019s learning style.',
  },
];

export function HomeFAQSection() {
  const [openValue, setOpenValue] = useState<string | undefined>('faq-0');

  return (
    <>
      <section
        className="py-16 md:py-24 bg-white border-t border-slate-200"
        aria-labelledby="home-faq-heading"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12 md:mb-14">
            <h2
              id="home-faq-heading"
              className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-slate-900 mb-3"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto">
              Quick answers about GrowWise tutoring and programs.
            </p>
          </header>

          <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={(next) =>
              setOpenValue((prev) => (next === prev ? undefined : next))
            }
            className="max-w-4xl mx-auto space-y-3"
          >
            {FAQS.map((faq, i) => (
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
        </div>
      </section>
    </>
  );
}
