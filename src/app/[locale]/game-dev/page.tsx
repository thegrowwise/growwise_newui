import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { GameDevHero } from '@/components/game-dev/GameDevHero';
import { GameDevPrograms } from '@/components/game-dev/GameDevPrograms';
import { generateMetadataFromPath } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromPath('/game-dev', locale) ?? {
    title: 'Game Dev for Kids | Dublin CA | GrowWise',
    description: 'Game dev for ages 6–16 in Dublin, CA. Scratch, Roblox, and project builds. Hands-on classes with expert coaches. Book a free trial.',
  };
}

export default function GameDevPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen page-bg-gamedev flex items-center justify-center text-[#1F396D]">
          Loading…
        </div>
      }
    >
      <EnrollProvider>
        <main className="min-h-screen page-bg-gamedev">
          <GameDevHero />
          <GameDevPrograms />
        </main>
      </EnrollProvider>
    </Suspense>
  );
}
