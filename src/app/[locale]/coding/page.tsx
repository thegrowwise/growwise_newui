import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { CodingHero } from '@/components/coding/CodingHero';
import { CodingPrograms } from '@/components/coding/CodingPrograms';
import { generateMetadataFromPath } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromPath('/coding', locale) ?? {
    title: 'Coding Classes Kids | Dublin CA | GrowWise',
    description: 'Coding classes for ages 10–18 in Dublin, CA. Python, JavaScript, and web basics in small groups. Book a free trial.',
  };
}

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
