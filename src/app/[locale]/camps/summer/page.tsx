'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SUMMER_CAMP_PROGRAMS, type Program } from '@/lib/summer-camp-data';
import {
  ProgramList,
  SlotsPanel,
  CartDrawer,
} from '@/components/camps/SummerCampUI';

const FAQS = [
  {
    question: 'What is the student-to-teacher ratio?',
    answer:
      'We maintain small cohorts with a maximum of 8:1 ratio to ensure personalized attention.',
  },
  {
    question: 'Are the instructors qualified?',
    answer:
      'Yes, all our instructors are industry professionals or top-tier university students.',
  },
  {
    question: 'Can I switch weeks if my schedule changes?',
    answer:
      'Yes, we allow one free schedule change up to 14 days before the camp start date.',
  },
];

export default function SummerCampPage() {
  const [selectedProgram, setSelectedProgram] = useState<Program>(
    SUMMER_CAMP_PROGRAMS[0]
  );
  const slotsSectionRef = useRef<HTMLElement>(null);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
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

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-3xl opacity-60 translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-orange-100/20 rounded-full blur-3xl opacity-60 -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
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
            </motion.div>
          </div>
        </section>

        {/* Programs & Slots Section */}
        <section
          id="slots-section"
          ref={slotsSectionRef}
          className="py-20 bg-slate-50/50 border-y border-slate-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-12 gap-8 items-start relative">
              {/* Left Column: Program List */}
              <div className="lg:col-span-7">
                <div className="mb-10">
                  <h2 className="font-heading font-black text-3xl text-slate-900 mb-2 uppercase tracking-tight">
                    Choose Your Path
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Select a camp to view available weeks.
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
              <div className="lg:col-span-5 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
                <SlotsPanel program={selectedProgram} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <h2 className="font-heading font-black text-3xl text-center mb-12 uppercase tracking-tight">
              FAQ
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50/30 p-6"
                >
                  <h3 className="font-black text-sm uppercase tracking-wider mb-2 text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}
