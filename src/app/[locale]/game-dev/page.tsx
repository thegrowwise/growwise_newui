import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { GameDevHero } from '@/components/game-dev/GameDevHero';
import { GameDevPrograms } from '@/components/game-dev/GameDevPrograms';

export const metadata: Metadata = {
  title: 'Game Development for Kids | GrowWise School',
  description: 'Scratch, Roblox, Minecraft, and Robotics journeys for kids aged 6–16.',
};

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

