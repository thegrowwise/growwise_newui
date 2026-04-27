'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { GraduationCap } from 'lucide-react'

export type BlogFaqItem = { question: string; answer: string }

type Props = {
  id: string
  heading: string
  subheading?: string
  faqs: ReadonlyArray<BlogFaqItem>
}

/**
 * Same accordion pattern as MathFinalsPracticeLanding FAQ — client-only (Radix).
 */
export function BlogFaqAccordion({ id, heading, subheading, faqs }: Props) {
  return (
    <section
      className="mt-12 bg-white py-14 px-4 sm:px-6 lg:px-8 rounded-2xl border border-gray-100 shadow-xl max-w-4xl mx-auto"
      aria-labelledby={id}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 id={id} className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {heading}
          </h2>
          {subheading ? <p className="mt-2 text-slate-600">{subheading}</p> : null}
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              value={`q-${i}`}
              key={faq.question}
              className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-4 py-4 text-left text-base hover:no-underline sm:px-6 sm:text-lg">
                <div className="flex items-center gap-3 pr-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F16112]/10">
                    <GraduationCap className="h-4 w-4 text-[#F16112]" aria-hidden />
                  </div>
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600 sm:px-6 sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
