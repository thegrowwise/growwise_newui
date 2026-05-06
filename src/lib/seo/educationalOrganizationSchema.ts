import { CONTACT_INFO } from '@/lib/constants'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

/**
 * Site-wide EducationalOrganization JSON-LD (GWA-192 / local SEO).
 * Exported for unit tests and used by {@link LocalBusinessSchema}.
 */
export function buildEducationalOrganizationSchema() {
  const base = getCanonicalSiteUrl()
  const mapQuery = encodeURIComponent(
    `GrowWise School ${CONTACT_INFO.street} Dublin CA ${CONTACT_INFO.zipCode}`
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'GrowWise School',
    alternateName: 'GrowWise',
    url: base,
    logo: `${base}/logo.png`,
    image: `${base}/logo.png`,
    description:
      'K–12 STEAM enrichment and academic tutoring in Dublin, CA. Small-group, project-based programs in coding, robotics, AI, math, and writing for grades 1–12.',
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
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
    hasMap: `https://maps.google.com/?q=${mapQuery}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card',
    areaServed: [
      { '@type': 'City', name: 'Dublin', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'Pleasanton', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'San Ramon', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'Livermore', containedInPlace: { '@type': 'State', name: 'California' } },
    ],
    sameAs: [
      'https://www.facebook.com/people/GrowWise/61561059687164/',
      'https://www.instagram.com/growwise.dublin/',
      'https://www.linkedin.com/company/thegrowwise/',
      'https://www.youtube.com/@growwise.dublin',
    ],
    subOrganization: [
      { '@type': 'EducationalOrganization', name: 'GrowWise STEAM Programs' },
      { '@type': 'EducationalOrganization', name: 'GrowWise Academic Tutoring' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'GrowWise Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Summer STEAM Camps',
            description:
              'AI Studio, Game Development, Robotics, Math Olympiad, Young Authors summer camps for grades 3–12 in Dublin, CA',
            provider: { '@type': 'Organization', name: 'GrowWise School' },
            url: `${base}/camps/summer`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Math Tutoring',
            description: 'Grades 1–12 math tutoring including high school math and SAT prep in Dublin, CA',
            provider: { '@type': 'Organization', name: 'GrowWise School' },
            url: `${base}/courses/math`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'English & Reading Classes',
            description: 'Grades 1–12 English, reading and writing classes in Dublin, CA',
            provider: { '@type': 'Organization', name: 'GrowWise School' },
            url: `${base}/courses/english`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'ML & AI Coding Classes',
            description: 'Machine learning and AI coding classes for kids in Dublin, CA',
            provider: { '@type': 'Organization', name: 'GrowWise School' },
            url: `${base}/steam/ml-ai-coding`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Game Development Classes',
            description: 'Game development and coding classes for kids in Dublin, CA',
            provider: { '@type': 'Organization', name: 'GrowWise School' },
            url: `${base}/steam/game-development`,
          },
        },
      ],
    },
  }
}
