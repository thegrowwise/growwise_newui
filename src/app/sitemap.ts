import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://growwiseschool.org'
  const currentDate = new Date().toISOString()
  
  // Core pages with priorities
  const corePages = [
    { path: '', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/academic', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/enroll', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/enroll-academic', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/book-assessment', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/programs', priority: 0.8, changefreq: 'monthly' as const },
  ]
  
  // Course pages - Higher priority for SEO
  const coursePages = [
    { path: '/courses/math', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/courses/english', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/courses/sat-prep', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/courses/high-school-math', priority: 0.85, changefreq: 'monthly' as const },
  ]
  
  // STEAM pages - High priority for tech-focused searches
  const steamPages = [
    { path: '/steam', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/steam/ml-ai-coding', priority: 0.85, changefreq: 'monthly' as const },
    { path: '/steam/game-development', priority: 0.85, changefreq: 'monthly' as const },
  ]
  
  // Camp pages
  const campPages = [
    { path: '/camps/winter', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/camps/winter/calendar', priority: 0.6, changefreq: 'weekly' as const },
  ]
  
  // Generate URLs for all locales
  const urls: MetadataRoute.Sitemap = []
  
  locales.forEach(locale => {
    // Core pages
    corePages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changefreq,
        priority: page.priority,
      })
    })
    
    // Course pages - Higher priority for better indexing
    coursePages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changefreq,
        priority: page.priority,
      })
    })
    
    // STEAM pages
    steamPages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changefreq,
        priority: page.priority,
      })
    })
    
    // Camp pages
    campPages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changefreq,
        priority: page.priority,
      })
    })
  })
  
  return urls
}

