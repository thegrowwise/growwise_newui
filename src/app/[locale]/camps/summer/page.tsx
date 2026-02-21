'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { SUMMER_CAMP_PROGRAMS, type Program } from '@/lib/summer-camp-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProgramList = dynamic(
  () => import('@/components/camps/SummerCampUI').then((m) => ({ default: m.ProgramList })),
  { ssr: true }
);
// Radix Select/Dialog generate non-deterministic aria-controls IDs; render only on client to avoid hydration mismatch.
const SlotsPanel = dynamic(
  () => import('@/components/camps/SummerCampUI').then((m) => ({ default: m.SlotsPanel })),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border border-slate-200 bg-white/80 p-6 animate-pulse min-h-[320px]"
        aria-hidden
      />
    ),
  }
);

export interface SummerCampFaqItem {
  question: string;
  answer: string;
}

export interface SummerCampFaqData {
  faqs: SummerCampFaqItem[];
}

export default function SummerCampPage() {
  const t = useTranslations('summerCamp');
  const locale = useLocale();
  const [selectedProgram, setSelectedProgram] = useState<Program>(
    SUMMER_CAMP_PROGRAMS[0]
  );
  const [faqs, setFaqs] = useState<SummerCampFaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [openFaqValue, setOpenFaqValue] = useState<string | undefined>('faq-0');
  const slotsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadFaqs = async () => {
      setFaqsLoading(true);
      try {
        const res = await fetch(`/api/mock/${locale}/summer-camp-faq.json`);
        if (!res.ok) {
          const fallback = locale !== 'en' ? await fetch('/api/mock/en/summer-camp-faq.json') : null;
          if (fallback?.ok && !cancelled) {
            const data: SummerCampFaqData = await fallback.json();
            setFaqs(data.faqs ?? []);
          } else if (!cancelled) {
            setFaqs([]);
          }
        } else {
          const data: SummerCampFaqData = await res.json();
          if (!cancelled) setFaqs(data.faqs ?? []);
        }
      } catch {
        if (!cancelled) setFaqs([]);
      } finally {
        if (!cancelled) setFaqsLoading(false);
      }
    };
    loadFaqs();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const scrollToSlots = () => {
    slotsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && selectedProgram) {
        document.getElementById('slots-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProgram]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-[#1F396D]/20 selection:text-[#1F396D]">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-3xl opacity-60 translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-orange-100/20 rounded-full blur-3xl opacity-60 -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="container mx-auto px-4 md:px-6 text-center">
          <div
              className="max-w-3xl mx-auto animate-fade-in"
              style={{
                animation: 'fadeInUp 0.6s ease-out forwards',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1F396D] text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                Enrollment Open for Summer 2026
              </div>
              <h1 className="font-heading font-black text-5xl md:text-7xl tracking-tighter text-slate-900 mb-6 leading-none">
                Summer Camps that <br />
                <span className="text-[#1F396D]">Spark Genius.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Accredited courses in Math, Coding, and Robotics. Small cohorts
                designed to give your child a head start.
              </p>
            </div>
            <style>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </section>

        {/* Programs & Slots Section */}
        <section
          id="slots-section"
          ref={slotsSectionRef}
          className="py-20 relative border-y border-slate-100"
          style={{
            background:
              'linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #fff7ed 70%, #fed7aa 100%)',
          }}
        >
          {/* Subtle radial accents — overflow is clipped by the section's clip-path wrapper below */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0, overflow: 'clip' }}
            aria-hidden="true"
          >
            <div className="absolute top-0 left-0 w-[45%] h-[50%] rounded-full blur-3xl opacity-40 bg-[#1F396D]/20" />
            <div className="absolute bottom-0 right-0 w-[45%] h-[50%] rounded-full blur-3xl opacity-40 bg-orange-400/20" />
          </div>

          <div className="container mx-auto px-4 md:px-6" style={{ position: 'relative', zIndex: 1 }}>
            <div className="grid lg:grid-cols-12 gap-8 items-start relative">
              {/* Left Column: Program List */}
              <div className="lg:col-span-7">
                <div className="mb-10">
                  <h2 className="font-heading font-black text-3xl text-slate-900 mb-2 uppercase tracking-tight">
                    {t('page.title')}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {t('page.subtitle')}
                  </p>
                </div>
                <ProgramList
                  onSelectProgram={(p) => {
                    setSelectedProgram(p);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      document
                        .getElementById('slots-panel')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  selectedProgramId={selectedProgram.id}
                />
              </div>

              {/* Right Column: Slots Panel (Sticky) */}
              <div
                className="lg:col-span-5 lg:sticky lg:top-24"
                style={{ height: 'calc(100vh - 7rem)' }}
              >
                <SlotsPanel program={selectedProgram} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section — content from public/api/mock/{locale}/summer-camp-faq.json */}
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
            {faqsLoading ? (
              <div
                className="max-w-4xl mx-auto space-y-3 animate-pulse"
                aria-busy="true"
                aria-label="Loading FAQs"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-100 rounded-xl"
                  />
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
      </main>
    </div>
  );
}
