import React from 'react';
import type { Metadata } from 'next';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { CONTACT_INFO } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = generateMetadataFromPath('/self-check', locale);
  return (
    meta ?? {
      title: 'Free Math & English Self-Check | GrowWise School',
      description:
        'Find out if your child has hidden math or English gaps. Free 5-minute quiz — get a personal Mistake-Pattern Report.',
    }
  );
}

export default async function SelfCheckLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = getCanonicalSiteUrl();
  const pageUrl = absoluteSiteUrl('/self-check', locale, baseUrl);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: 'Free Math & English Self-Check',
    description:
      "A free 5-minute online self-check quiz that identifies hidden math and English learning gaps in your child and delivers a personalized Mistake-Pattern Report.",
    serviceType: 'Educational Assessment',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'GrowWise School',
      url: baseUrl,
      telephone: CONTACT_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT_INFO.street,
        addressLocality: 'Dublin',
        addressRegion: 'CA',
        postalCode: CONTACT_INFO.zipCode,
        addressCountry: 'US',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'Dublin' },
      { '@type': 'City', name: 'Pleasanton' },
      { '@type': 'City', name: 'San Ramon' },
      { '@type': 'City', name: 'Livermore' },
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      description: 'Completely free — no account, no credit card required.',
    },
    url: pageUrl,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the Self-Check really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely free. No credit card, no account, and no strings attached.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does the quiz take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The quiz is 8 questions and takes about 5 minutes to complete.',
        },
      },
      {
        '@type': 'Question',
        name: 'What grades is this Self-Check for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Self-Check covers Grades 2 through 12 in Math, English, or both.',
        },
      },
      {
        '@type': 'Question',
        name: 'What do I get at the end?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You get a personalized Mistake-Pattern Report showing exactly which learning gaps your child has, the risk level of each gap, and what it could block in future grades.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
