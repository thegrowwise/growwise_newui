import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { generateMetadataFromPath } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return (
    generateMetadataFromPath('/camps/summer/guide-success', locale) ?? {
      title: 'Camp guide sent | GrowWise Summer Camp',
      description: 'Thank you — your camp guide and early-bird details are on the way.',
    }
  );
}

export default function GuideSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
