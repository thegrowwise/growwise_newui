import { getValidLocale } from '@/i18n/localeConfig';
import enContent from './en.json';
import type { FormThankYouContent, FormThankYouContentMap, FormThankYouId } from './types';

const en = enContent as FormThankYouContentMap;

/** Add more locale files here as they are introduced. */
const byLocale: Record<string, FormThankYouContentMap> = {
  en,
};

function isFormThankYouId(x: string): x is FormThankYouId {
  return x in en;
}

function mapForLocale(locale: string): FormThankYouContentMap {
  const key = getValidLocale(locale);
  return byLocale[key] ?? en;
}

/**
 * Resolves thank-you copy for a form. Falls back to English if the locale has no file yet.
 */
export function getFormThankYouContent(
  formId: FormThankYouId,
  locale: string
): FormThankYouContent {
  if (!isFormThankYouId(formId)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getFormThankYouContent] unknown formId: ${formId}, using book-assessment`);
    }
    return en['book-assessment'];
  }
  const map = mapForLocale(locale);
  const entry = map[formId] ?? en[formId];
  return entry;
}

export function getFormThankYouContentByKey(
  formId: string,
  locale: string
): FormThankYouContent | null {
  if (!isFormThankYouId(formId)) return null;
  return getFormThankYouContent(formId, locale);
}
