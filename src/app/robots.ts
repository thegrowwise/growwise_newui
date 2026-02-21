import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://growwiseschool.org'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/',
          '/cart/',
          '/student-login/',
          '/admin/',
          '/*.json$',
          '/*?*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

