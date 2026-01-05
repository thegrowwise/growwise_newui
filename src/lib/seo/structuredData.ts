/**
 * Structured Data (JSON-LD) for SEO
 * Schema.org markup for better search engine understanding
 */

import { CONTACT_INFO } from '@/lib/constants'

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "GrowWise",
  "alternateName": "GrowWise School",
  "url": "https://growwiseschool.org",
  "logo": "https://growwiseschool.org/logo.png",
  "description": "Empowering students through personalized K-12 education and innovative STEAM programs in Dublin, CA. Expert instruction, proven results, and flexible scheduling.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": CONTACT_INFO.street,
    "addressLocality": "Dublin",
    "addressRegion": "CA",
    "postalCode": CONTACT_INFO.zipCode,
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": CONTACT_INFO.phone,
    "contactType": "customer service",
    "email": CONTACT_INFO.email,
    "areaServed": "US",
    "availableLanguage": ["en", "es", "hi", "zh"]
  },
  "sameAs": [
    "https://www.facebook.com/people/GrowWise/61561059687164/",
    "https://www.instagram.com/growwise.dublin/",
    "https://www.linkedin.com/company/thegrowwise/"
  ],
  "foundingDate": "2019",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "10-50"
  }
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://growwiseschool.org/#organization",
  "name": "GrowWise",
  "alternateName": "GrowWise School",
  "image": "https://growwiseschool.org/logo.png",
  "telephone": CONTACT_INFO.phone,
  "email": CONTACT_INFO.email,
  "url": "https://growwiseschool.org",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": CONTACT_INFO.street,
    "addressLocality": "Dublin",
    "addressRegion": "CA",
    "postalCode": CONTACT_INFO.zipCode,
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7021,
    "longitude": -121.9358
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Credit Card, Cash, Check",
  "areaServed": [
    {
      "@type": "City",
      "name": "Dublin",
      "addressRegion": "CA"
    },
    {
      "@type": "City",
      "name": "Pleasanton",
      "addressRegion": "CA"
    },
    {
      "@type": "City",
      "name": "San Ramon",
      "addressRegion": "CA"
    },
    {
      "@type": "City",
      "name": "Livermore",
      "addressRegion": "CA"
    },
    {
      "@type": "City",
      "name": "Fremont",
      "addressRegion": "CA"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Educational Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Academic Programs",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Math Tutoring",
              "description": "K-12 Math courses including grade-level, accelerated, and integrated math"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "English Tutoring",
              "description": "English Language Arts courses for K-12 students"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SAT Prep",
              "description": "Comprehensive SAT test preparation courses"
            }
          }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "STEAM Programs",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "ML/AI Coding",
              "description": "Machine Learning and Artificial Intelligence coding courses"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Game Development",
              "description": "Game development courses using Roblox, Scratch, and Python"
            }
          }
        ]
      }
    ]
  }
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GrowWise",
  "url": "https://growwiseschool.org",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://growwiseschool.org/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

/**
 * Generate Course structured data
 */
export function generateCourseSchema({
  name,
  description,
  provider,
  courseCode,
  educationalLevel,
  teaches,
  coursePrerequisites,
  url,
  image,
  offers,
}: {
  name: string
  description: string
  provider?: string
  courseCode?: string
  educationalLevel?: string
  teaches?: string[]
  coursePrerequisites?: string
  url: string
  image?: string
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
    url?: string
  }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": provider || "GrowWise",
      "url": "https://growwiseschool.org",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CONTACT_INFO.street,
        "addressLocality": "Dublin",
        "addressRegion": "CA",
        "postalCode": CONTACT_INFO.zipCode,
        "addressCountry": "US"
      },
      "telephone": CONTACT_INFO.phone,
      "email": CONTACT_INFO.email,
    },
    ...(courseCode && { "courseCode": courseCode }),
    ...(educationalLevel && { "educationalLevel": educationalLevel }),
    ...(teaches && teaches.length > 0 && { "teaches": teaches }),
    ...(coursePrerequisites && { "coursePrerequisites": coursePrerequisites }),
    "url": url,
    ...(image && { "image": image }),
    "inLanguage": "en-US",
    "isAccessibleForFree": false,
    ...(offers && {
      "offers": {
        "@type": "Offer",
        ...(offers.price && { "price": offers.price }),
        ...(offers.priceCurrency && { "priceCurrency": offers.priceCurrency || "USD" }),
        ...(offers.availability && { "availability": offers.availability || "https://schema.org/InStock" }),
        ...(offers.url && { "url": offers.url }),
      }
    }),
  }
}

/**
 * Generate Event structured data
 */
export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  image,
  offers,
  eventStatus,
  eventAttendanceMode,
}: {
  name: string
  description: string
  startDate: string
  endDate: string
  location: {
    name: string
    address: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
  }
  organizer?: {
    name: string
    url: string
  }
  image?: string
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
    url?: string
  }
  eventStatus?: string
  eventAttendanceMode?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "endDate": endDate,
    "location": {
      "@type": "Place",
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": location.address.streetAddress,
        "addressLocality": location.address.addressLocality,
        "addressRegion": location.address.addressRegion,
        "postalCode": location.address.postalCode,
        "addressCountry": location.address.addressCountry,
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": organizer?.name || "GrowWise",
      "url": organizer?.url || "https://growwiseschool.org",
    },
    ...(image && { "image": image }),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        ...(offers.price && { "price": offers.price }),
        ...(offers.priceCurrency && { "priceCurrency": offers.priceCurrency || "USD" }),
        ...(offers.availability && { "availability": offers.availability || "https://schema.org/InStock" }),
        ...(offers.url && { "url": offers.url }),
      }
    }),
    ...(eventStatus && { "eventStatus": eventStatus || "https://schema.org/EventScheduled" }),
    ...(eventAttendanceMode && { "eventAttendanceMode": eventAttendanceMode || "https://schema.org/OfflineEventAttendanceMode" }),
  }
}

/**
 * Generate Review/AggregateRating structured data
 */
export function generateReviewSchema({
  itemReviewed,
  reviewRating,
  author,
  reviewBody,
  datePublished,
}: {
  itemReviewed: {
    "@type": string
    name: string
  }
  reviewRating: {
    ratingValue: number
    bestRating?: number
    worstRating?: number
  }
  author?: {
    name: string
    type?: string
  }
  reviewBody?: string
  datePublished?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": itemReviewed,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewRating.ratingValue,
      "bestRating": reviewRating.bestRating || 5,
      "worstRating": reviewRating.worstRating || 1,
    },
    ...(author && {
      "author": {
        "@type": author.type || "Person",
        "name": author.name,
      }
    }),
    ...(reviewBody && { "reviewBody": reviewBody }),
    ...(datePublished && { "datePublished": datePublished }),
  }
}

/**
 * Generate AggregateRating structured data
 */
export function generateAggregateRatingSchema({
  itemReviewed,
  ratingValue,
  reviewCount,
  bestRating,
  worstRating,
}: {
  itemReviewed: {
    "@type": string
    name: string
  }
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": itemReviewed,
    "ratingValue": ratingValue,
    "reviewCount": reviewCount,
    "bestRating": bestRating || 5,
    "worstRating": worstRating || 1,
  }
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQPageSchema(faqs: Array<{
  question: string
  answer: string
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      }
    }))
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{
  name: string
  url: string
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    }))
  }
}

