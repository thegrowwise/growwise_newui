import { CONTACT_INFO } from '@/lib/constants'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

type CatalogCourse = {
  name: string
  description: string
  path: string
  typicalAgeRange: string
  educationalLevel: string
}

function courseOfferEntry(base: string, c: CatalogCourse) {
  const url = `${base}${c.path.startsWith('/') ? c.path : `/${c.path}`}`
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Course',
      name: c.name,
      description: c.description,
      provider: { '@type': 'Organization', name: 'GrowWise School' },
      url,
      typicalAgeRange: c.typicalAgeRange,
      educationalLevel: c.educationalLevel,
      courseMode: 'onsite',
      inLanguage: 'en',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url,
      },
    },
  }
}

const OFFER_CATALOG_COURSES: CatalogCourse[] = [
  {
    name: 'Summer STEAM Camps',
    description:
      'AI Studio, Game Development, Robotics, Math Olympiad, Young Authors summer camps for grades 3–12 in Dublin, CA',
    path: '/camps/summer',
    typicalAgeRange: '8-18',
    educationalLevel: 'Grades 3-12',
  },
  {
    name: 'Math Tutoring',
    description: 'Grades 1–12 math tutoring including high school math and SAT prep in Dublin, CA',
    path: '/courses/math',
    typicalAgeRange: '6-18',
    educationalLevel: 'Grades 1-12',
  },
  {
    name: 'English & Reading Classes',
    description: 'Grades 1–12 English, reading and writing classes in Dublin, CA',
    path: '/courses/english',
    typicalAgeRange: '6-18',
    educationalLevel: 'Grades 1-12',
  },
  {
    name: 'ML & AI Coding Classes',
    description: 'Machine learning and AI coding classes for kids in Dublin, CA',
    path: '/steam/ml-ai-coding',
    typicalAgeRange: '10-18',
    educationalLevel: 'Grades 5-12',
  },
  {
    name: 'Game Development Classes',
    description: 'Game development and coding classes for kids in Dublin, CA',
    path: '/steam/game-development',
    typicalAgeRange: '10-18',
    educationalLevel: 'Grades 5-12',
  },
]

/**
 * Site-wide EducationalOrganization + LocalBusiness JSON-LD (local SEO / entity clarity).
 * Exported for unit tests and used by {@link LocalBusinessSchema}.
 */
export function buildEducationalOrganizationSchema() {
  const base = getCanonicalSiteUrl()
  const mapQuery = encodeURIComponent(
    `GrowWise School ${CONTACT_INFO.street} Dublin CA ${CONTACT_INFO.zipCode}`
  )

  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    knowsAbout: [
      'STEAM Education for K-12',
      'Math Tutoring Dublin CA',
      'Kids Coding Classes',
      'AI and Machine Learning for Kids',
      'Game Development for Children',
      'Robotics Summer Camps',
      'Summer Camps Dublin CA Tri-Valley',
    ],
    areaServed: [
      { '@type': 'City', name: 'Dublin', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'Pleasanton', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'San Ramon', containedInPlace: { '@type': 'State', name: 'California' } },
      { '@type': 'City', name: 'Livermore', containedInPlace: { '@type': 'State', name: 'California' } },
    ],
    sameAs: [
      'https://www.youtube.com/@growwise.dublin',
      'https://www.google.com/maps/place/GrowWise+School/@37.7059,-121.8985',
      'https://www.facebook.com/growwiseschool',
      'https://www.yelp.com/biz/growwise-school-dublin',
      'https://www.instagram.com/growwiseschool',
    ],
    subOrganization: [
      { '@type': 'EducationalOrganization', name: 'GrowWise STEAM Programs' },
      { '@type': 'EducationalOrganization', name: 'GrowWise Academic Tutoring' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'GrowWise Programs',
      itemListElement: OFFER_CATALOG_COURSES.map((c) => courseOfferEntry(base, c)),
    },
  }
}
