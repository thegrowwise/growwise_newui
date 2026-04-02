import { Metadata } from 'next';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { generateEventSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import { CONTACT_INFO } from '@/lib/constants';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';

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

  const eventSchema = generateEventSchema({
    name: 'Summer Camp 2026 - Math, Coding & Robotics',
    description:
      'Enrollment open for GrowWise Summer Camp 2026! Accredited courses in Math, Coding, Robotics, and more. Half-day and full-day camps. Small cohorts. Dublin, CA.',
    startDate: '2026-06-15T09:00:00-08:00',
    endDate: '2026-08-08T17:00:00-08:00',
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
    offers: {
      price: '249',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/camps/summer', locale, baseUrl),
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Camps', url: absoluteSiteUrl('/camps/summer', locale, baseUrl) },
    { name: 'Summer Camp 2026', url: absoluteSiteUrl('/camps/summer', locale, baseUrl) },
  ]);

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
      {children}
    </>
  );
}
