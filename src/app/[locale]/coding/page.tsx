import type { Metadata } from 'next';
import React from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { CodingHero } from '@/components/coding/CodingHero';
import { CodingPrograms } from '@/components/coding/CodingPrograms';

export const metadata: Metadata = {
  title: 'Coding Programs for Kids | GrowWise School',
  description: 'Structured coding learning journeys for kids aged 10–18.',
};

export default function CodingPage() {
  return (
    <EnrollProvider>
      <main className="min-h-screen bg-[#F8FAFC]">
        <CodingHero />
        <CodingPrograms />
      </main>
    </EnrollProvider>
  );
}

