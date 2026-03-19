'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-[#f9fafb]">
      <div className="max-w-xl text-center space-y-6">
        <div className="text-sm font-semibold text-[#F16112] tracking-widest uppercase">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t('title')}
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          {t('description')}
        </p>
        <div className="mt-6">
          <Button asChild className="rounded-full px-8 py-3 text-base bg-[#F16112] hover:bg-[#d54f0a]">
            <Link href="/">
              {t('backToHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

