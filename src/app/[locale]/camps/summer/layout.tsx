/**
 * Summer camp hub JSON-LD: Event, BreadcrumbList, FAQPage, WebPage, ItemList (programs with detail URLs).
 * Site-wide org graph: root `app/layout.tsx` (`LocalBusinessSchema`) + `[locale]/layout.tsx` (`websiteSchema`).
 */
import { Metadata } from 'next';
import FAQSchema from '@/components/schema/FAQSchema';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { SUMMER_HUB_PRIORITY_FAQS } from '@/lib/schema/summer-hub-jsonld-faqs';
import {
  generateEventSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
  generateWebPageJsonLd,
} from '@/lib/seo/structuredData';
import { CONTACT_INFO } from '@/lib/constants';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import {
  SUMMER_CAMP_EVENT_END_ISO,
  SUMMER_CAMP_EVENT_START_ISO,
} from '@/lib/summer-camp-week-calendar';
import { getDefaultSummerCampData, getMinimumPublishedSummerCampPriceUsd } from '@/lib/summer-camp-data';
import { getSummerCampProgramSeoLink } from '@/lib/summer-camp-seo-links';
import summerCampFaqData from '../../../../../public/api/mock/en/summer-camp-faq.json';

function mergeSummerHubJsonLdFaqs() {
  const priorityKeys = new Set(
    SUMMER_HUB_PRIORITY_FAQS.map((f) => f.question.trim().toLowerCase()),
  );
  const rest = summerCampFaqData.faqs.filter(
    (f) => !priorityKeys.has(f.question.trim().toLowerCase()),
  );
  return [...SUMMER_HUB_PRIORITY_FAQS, ...rest];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = generateMetadataFromPath('/camps/summer', locale);
  return (
    metadata || {
      title: 'Summer Camp 2026 | GrowWise',
      description: 'Summer camp programs - Math, Coding, Robotics.',
    }
  );
}

export default async function SummerCampLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = getCanonicalSiteUrl();
  const minCampPriceUsd = getMinimumPublishedSummerCampPriceUsd();
  const summerEventDescription =
    'Enrollment open for GrowWise Summer Camp 2026! Accredited courses in Math, Coding, Robotics, and more. Half-day and full-day camps. Small cohorts. Dublin, CA.';

  const eventSchema = generateEventSchema({
    name: 'Summer Camp 2026 - Math, Coding & Robotics',
    description: summerEventDescription,
    startDate: SUMMER_CAMP_EVENT_START_ISO,
    endDate: SUMMER_CAMP_EVENT_END_ISO,
    location: {
      name: 'GrowWise School',
      address: {
        streetAddress: CONTACT_INFO.street,
        addressLocality: 'Dublin',
        addressRegion: 'CA',
        postalCode: CONTACT_INFO.zipCode || '94568',
        addressCountry: 'US',
      },
    },
    organizer: {
      name: 'GrowWise',
      url: baseUrl,
    },
    image: `${baseUrl}/assets/growwise-logo.png`,
    // price = lowest published option; program/week/format prices vary on the page.
    offers: {
      price: String(minCampPriceUsd),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/camps/summer', locale, baseUrl),
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Camps', url: absoluteSiteUrl('/camps', locale, baseUrl) },
    { name: 'Summer Camp 2026', url: absoluteSiteUrl('/camps/summer', locale, baseUrl) },
  ]);

  const pageUrl = absoluteSiteUrl('/camps/summer', locale, baseUrl);
  const webPageSchema = generateWebPageJsonLd({
    name: 'Summer Camp 2026 - Math, Coding & Robotics | GrowWise',
    description: summerEventDescription,
    url: pageUrl,
  });

  const programLinks: Array<{ name: string; url: string }> = [];
  const seenUrls = new Set<string>();
  for (const p of getDefaultSummerCampData().programs) {
    const link = getSummerCampProgramSeoLink(p.id);
    if (!link) continue;
    const itemUrl = absoluteSiteUrl(`/camps/${link.slug}`, locale, baseUrl);
    if (seenUrls.has(itemUrl)) continue;
    seenUrls.add(itemUrl);
    programLinks.push({ name: p.title, url: itemUrl });
  }
  programLinks.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const programItemListSchema =
    programLinks.length > 0
      ? generateItemListSchema('Summer camp programs (Dublin, CA)', programLinks)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FAQSchema faqs={mergeSummerHubJsonLdFaqs()} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {programItemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(programItemListSchema) }}
        />
      )}
      {children}
    </>
  );
}
