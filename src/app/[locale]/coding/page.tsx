import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { CodingHero } from '@/components/coding/CodingHero';
import { CodingPrograms } from '@/components/coding/CodingPrograms';

export const metadata: Metadata = {
  title: 'Coding Programs for Kids | GrowWise School',
  description: 'Structured coding learning journeys for kids aged 10–18.',
};

export default function CodingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen page-bg-coding flex items-center justify-center text-[#1F396D]">
          Loading…
        </div>
      }
    >
      <EnrollProvider>
        <main className="min-h-screen page-bg-coding">
          <CodingHero />
          <CodingPrograms />
        </main>
      </EnrollProvider>
    </Suspense>
  );
}

