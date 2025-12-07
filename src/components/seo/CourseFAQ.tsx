/**
 * Course FAQ Component with FAQPage Schema
 * Improves SEO by adding FAQ structured data to course pages
 */

'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'
import { StructuredDataScript } from './StructuredDataScript'
import { generateFAQPageSchema } from '@/lib/seo/structuredData'

interface FAQ {
  question: string
  answer: string
}

interface CourseFAQProps {
  faqs: FAQ[]
  title?: string
  subtitle?: string
  className?: string
}

export function CourseFAQ({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle,
  className = ""
}: CourseFAQProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`}>
      <StructuredDataScript 
        data={generateFAQPageSchema(faqs)} 
        id="course-faq-structured-data" 
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F16112]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-[#F16112]" />
                  </div>
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

