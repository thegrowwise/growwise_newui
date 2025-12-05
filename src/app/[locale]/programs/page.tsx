"use client";

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { generateFAQPageSchema } from '@/lib/seo/structuredData';

export default function ProgramsPage() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const createLocaleUrl = (path: string) => `/${locale}${path}`;
  
  const faqs = [
    {
      question: "What programs does GrowWise offer?",
      answer: "GrowWise offers two main program categories: Academic Programs (K-12 Math and English courses aligned with DUSD & PUSD standards) and STEAM Programs (ML/AI, Game Development, Python coding, and more). We also offer SAT Prep courses and specialized high school math programs."
    },
    {
      question: "What is the difference between Academic and STEAM programs?",
      answer: "Academic programs focus on core subjects like Math and English, aligned with school curriculum standards. STEAM programs focus on Science, Technology, Engineering, Arts, and Mathematics through hands-on projects like game development, coding, and machine learning."
    },
    {
      question: "Can students enroll in both Academic and STEAM programs?",
      answer: "Yes! Many students benefit from combining academic support with STEAM enrichment. Our flexible scheduling allows students to participate in both program types based on their interests and needs."
    },
    {
      question: "Are the programs suitable for all grade levels?",
      answer: "Yes, we offer programs for K-12 students. Academic programs are available for all grade levels, while STEAM programs are typically designed for elementary through high school students, with age-appropriate content for each level."
    },
    {
      question: "How do I choose the right program for my child?",
      answer: "We recommend booking a free assessment to evaluate your child's strengths and areas for improvement. Our team can then recommend the best combination of Academic and STEAM programs based on your child's needs, interests, and goals."
    },
    {
      question: "Do you offer trial classes or assessments?",
      answer: "Yes, we offer free academic assessments to help determine the best program fit. Contact us at connect@thegrowwise.com or (925) 456-4606 to schedule your free assessment."
    }
  ];

  return (
    <main className="section-base section-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="title-section mb-6">{t('programs')}</h1>
        <p className="subtitle-sm mb-8">Explore our academic and STEAM offerings.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href={createLocaleUrl('/academic')} className="card-base card-padding hover:shadow-xl rounded-xl border border-gray-100">
            <div className="text-strong text-lg mb-2">Academic</div>
            <div className="text-muted">K-12 Math and English programs</div>
          </Link>
          <Link href={createLocaleUrl('/steam')} className="card-base card-padding hover:shadow-xl rounded-xl border border-gray-100">
            <div className="text-strong text-lg mb-2">STEAM</div>
            <div className="text-muted">ML/AI, Game Development and more</div>
          </Link>
        </div>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-xl">
          <StructuredDataScript 
            data={generateFAQPageSchema(faqs)} 
            id="programs-faq-structured-data" 
          />
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="text-[#F16112]">Questions</span>
              </h2>
              <p className="text-lg text-gray-600">
                Learn more about our programs and find the right fit for your child.
              </p>
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
                      <div className="w-8 h-8 bg-[#F16112]/10 rounded-lg flex items-center justify-center">
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
      </div>
    </main>
  );
}



