import type { FooterData } from '@/components/layout/Footer/types';
import en from '../../public/api/mock/en/footer.json';
import es from '../../public/api/mock/es/footer.json';
import zh from '../../public/api/mock/zh/footer.json';
import hi from '../../public/api/mock/hi/footer.json';

const BY_LOCALE: Record<string, FooterData> = {
  en: en as FooterData,
  es: es as FooterData,
  zh: zh as FooterData,
  hi: hi as FooterData,
};

/** Bundled copy of public mock footers — used when the API fetch fails so the footer never stays in the pulse/blur loading shell. */
export function getFooterFallback(locale: string): FooterData {
  return BY_LOCALE[locale] ?? BY_LOCALE.en;
}
