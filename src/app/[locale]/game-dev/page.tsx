import type { Metadata } from 'next';
import React from 'react';

import { EnrollProvider } from '@/contexts/EnrollContext';
import { GameDevHero } from '@/components/game-dev/GameDevHero';
import { GameDevPrograms } from '@/components/game-dev/GameDevPrograms';

export const metadata: Metadata = {
  title: 'Game Development for Kids | GrowWise School',
  description: 'Scratch, Roblox, Minecraft, and Robotics journeys for kids aged 6–16.',
};

export default function GameDevPage() {
  return (
    <EnrollProvider>
      <main className="min-h-screen bg-white">
        <GameDevHero />
        <GameDevPrograms />
      </main>
    </EnrollProvider>
  );
}

