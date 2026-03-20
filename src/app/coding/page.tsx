import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DEFAULT_LOCALE } from '@/i18n/localeConfig';

export const metadata: Metadata = {
  title: 'Coding Programs for Kids | GrowWise School',
  description: 'Structured coding learning journeys for kids aged 10–18.',
};

export default function CodingPage() {
  redirect(`/${DEFAULT_LOCALE}/coding`);
}

