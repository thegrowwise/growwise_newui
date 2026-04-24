import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { FormThankYouJsonLd } from '@/components/form-thank-you/FormThankYouJsonLd';
import { buildFormThankYouMetadata } from '@/lib/seo/formThankYouMetadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildFormThankYouMetadata('enroll', '/enroll/thank-you', locale);
}

export default async function EnrollThankYouLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <FormThankYouJsonLd formId="enroll" locale={locale} publicPagePath="/enroll/thank-you" />
      {children}
    </>
  );
}
