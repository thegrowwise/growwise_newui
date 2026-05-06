import React from 'react'
import { CONTACT_INFO } from '@/lib/constants'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

interface EventSchemaProps {
  name: string
  startDate: string
  endDate: string
  description: string
  /** Canonical absolute URL for this event / landing page */
  url: string
  typicalAgeRange?: string
}

function telE164Us(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return raw.startsWith('+') ? raw : `+${digits}`
}

/** Single-session Event JSON-LD for camp week offerings (matches visible camp landing intent). */
export default function EventSchema({
  name,
  startDate,
  endDate,
  description,
  url,
  typicalAgeRange = '8-18',
}: EventSchemaProps) {
  const site = getCanonicalSiteUrl()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    endDate,
    description,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    location: {
      '@type': 'Place',
      name: 'GrowWise School',
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT_INFO.street,
        addressLocality: 'Dublin',
        addressRegion: 'CA',
        postalCode: CONTACT_INFO.zipCode,
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.7059,
        longitude: -121.8985,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'GrowWise School',
      url: site,
      telephone: telE164Us(CONTACT_INFO.phone),
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
    },
    typicalAgeRange,
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
