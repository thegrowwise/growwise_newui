/**
 * Breadcrumb component with structured data
 * Common component for all pages - automatically handles locale
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { StructuredDataScript } from './StructuredDataScript'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'

interface BreadcrumbItem {
  name: string
  url?: string // Optional - if not provided, will be auto-generated from name
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[] // Optional - if not provided, will be auto-generated from pathname
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()
  const baseUrl = 'https://growwiseschool.org'
  
  // Extract locale from pathname (first segment after /)
  const pathSegments = pathname.split('/').filter(Boolean)
  const locale = pathSegments[0] || 'en'
  
  // Auto-generate breadcrumbs from pathname if items not provided
  let breadcrumbItems: Array<{ name: string; url: string }> = []
  
  if (items && items.length > 0) {
    // Use provided items, but ensure URLs are properly formatted
    breadcrumbItems = items.map(item => ({
      name: item.name,
      url: item.url || `${baseUrl}${pathname}`
    }))
  } else {
    // Auto-generate from pathname
    let currentPath = `/${locale}`
    breadcrumbItems = [{ name: 'Home', url: `${baseUrl}${currentPath}` }]
    
    pathSegments.slice(1).forEach((segment) => {
      currentPath += `/${segment}`
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbItems.push({ name, url: `${baseUrl}${currentPath}` })
    })
  }
  
  // Ensure Home is first
  if (breadcrumbItems[0]?.name !== 'Home') {
    breadcrumbItems = [
      { name: 'Home', url: `${baseUrl}/${locale}` },
      ...breadcrumbItems
    ]
  }

  const structuredData = generateBreadcrumbSchema(breadcrumbItems)

  return (
    <>
      <StructuredDataScript data={structuredData} id="breadcrumb-structured-data" />
      <nav 
        aria-label="Breadcrumb" 
        className={`py-4 px-4 lg:px-8 bg-gray-50 ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1
              const href = item.url?.replace(baseUrl, '') || '#'
              
              return (
                <li key={index} className="flex items-center">
                  {index === 0 ? (
                    <Link 
                      href={href} 
                      className="hover:text-[#F16112] transition-colors flex items-center"
                    >
                      <Home className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                      {isLast ? (
                        <span className="text-gray-900 font-medium">{item.name}</span>
                      ) : (
                        <Link 
                          href={href} 
                          className="hover:text-[#F16112] transition-colors"
                        >
                          {item.name}
                        </Link>
                      )}
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}

