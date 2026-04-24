import type { Metadata } from 'next';
import { getFormThankYouContent } from '@/data/form-thank-you/getFormThankYouContent';
import type { FormThankYouId } from '@/data/form-thank-you/types';
import { getValidLocale } from '@/i18n/localeConfig';
import { generatePageMetadata } from '@/lib/seo/metadata';

/**
 * Robots: noindex,follow; title/description from JSON (single source of truth).
 */
export function buildFormThankYouMetadata(
  formId: FormThankYouId,
  path: string,
  rawLocale: string
): Metadata {
  const locale = getValidLocale(rawLocale);
  const c = getFormThankYouContent(formId, locale);
  return generatePageMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    locale,
    path,
    indexable: false,
  });
}
