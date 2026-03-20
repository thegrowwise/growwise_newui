import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DEFAULT_LOCALE } from '@/i18n/localeConfig';

export const metadata: Metadata = {
  title: 'Game Development for Kids | GrowWise School',
  description: 'Scratch, Roblox, Minecraft, and Robotics journeys for kids aged 6–16.',
};

export default function GameDevPage() {
  redirect(`/${DEFAULT_LOCALE}/game-dev`);
}

