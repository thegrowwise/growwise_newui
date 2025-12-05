/**
 * SEO Metadata utilities
 * Helper functions for generating page-specific metadata
 */

import { Metadata } from 'next'
import { CONTACT_INFO } from '@/lib/constants'
import { getMetadataConfig, PageMetadataConfig } from './metadataConfig'

interface PageMetadataOptions {
  title: string
  description: string
  keywords?: string
  locale: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Generate metadata from a path (uses centralized config)
 * This is the preferred method - no need to pass title/description manually
 */
export function generateMetadataFromPath(
  path: string,
  locale: string,
  overrides?: Partial<PageMetadataConfig>
): Metadata | null {
  const config = getMetadataConfig(path)
  if (!config) {
    console.warn(`No metadata config found for path: ${path}`)
    return null
  }

  const finalConfig = { ...config, ...overrides }
  return generatePageMetadata({
    title: finalConfig.title,
    description: finalConfig.description,
    keywords: finalConfig.keywords,
    locale,
    path: finalConfig.path,
    image: finalConfig.image,
    type: finalConfig.type,
  })
}

/**
 * Generate metadata with explicit options (legacy method, still supported)
 */
export function generatePageMetadata({
  title,
  description,
  keywords,
  locale,
  path = '',
  image = 'https://growwiseschool.org/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const baseUrl = 'https://growwiseschool.org'
  const url = `${baseUrl}/${locale}${path}`
  
  // Default keywords if not provided
  const defaultKeywords = [
    'tutoring Dublin CA',
    'K-12 education',
    'STEAM programs',
    'math tutor',
    'English tutor',
    'coding classes',
    'SAT prep Dublin',
    'personalized learning',
  ]
  
  const finalKeywords = keywords 
    ? `${keywords}, ${defaultKeywords.join(', ')}`
    : defaultKeywords.join(', ')

  return {
    title,
    description,
    keywords: finalKeywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'GrowWise',
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: locale,
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en${path}`,
        'es': `${baseUrl}/es${path}`,
        'hi': `${baseUrl}/hi${path}`,
        'zh': `${baseUrl}/zh${path}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

