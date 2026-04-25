import { getFormThankYouContent } from '@/data/form-thank-you/getFormThankYouContent';
import type { FormThankYouId } from '@/data/form-thank-you/types';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { generateFormThankYouJsonLd } from '@/lib/seo/structuredData';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';

type Props = {
  formId: FormThankYouId;
  locale: string;
  /** Public path e.g. `/book-assessment/thank-you` (no locale prefix). */
  publicPagePath: string;
};

/**
 * Injects a single @graph (BreadcrumbList + WebPage) for form thank-you routes.
 */
export function FormThankYouJsonLd({ formId, locale, publicPagePath }: Props) {
  const c = getFormThankYouContent(formId, locale);
  const pageUrl = absoluteSiteUrl(publicPagePath, locale, getCanonicalSiteUrl());
  const graph = generateFormThankYouJsonLd({
    name: c.title,
    description: c.metaDescription,
    pageUrl,
    locale,
    formId,
  });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
