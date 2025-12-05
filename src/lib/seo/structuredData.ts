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
  "image": "https://growwiseschool.org/logo.png",
  "telephone": CONTACT_INFO.phone,
  "email": CONTACT_INFO.email,
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
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Credit Card, Cash, Check"
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

