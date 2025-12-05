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
  
  // Course pages
  const coursePages = [
    '/courses/math',
    '/courses/english',
    '/courses/high-school-math',
    '/courses/sat-prep',
  ]
  
  // STEAM pages
  const steamPages = [
    '/steam',
    '/steam/ml-ai-coding',
    '/steam/game-development',
  ]
  
  // Camp pages
  const campPages = [
    '/camps/winter',
    '/camps/winter/calendar',
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
    
    // Course pages
    coursePages.forEach(path => {
      urls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
    
    // STEAM pages
    steamPages.forEach(path => {
      urls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
    
    // Camp pages
    campPages.forEach(path => {
      urls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })
  
  return urls
}

