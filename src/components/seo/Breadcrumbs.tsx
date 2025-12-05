/**
 * Breadcrumb component with structured data
 */

'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { StructuredDataScript } from './StructuredDataScript'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Add home to the beginning if not present
  const baseUrl = 'https://growwiseschool.org'
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: `${baseUrl}/en` },
    ...items
  ]

  const structuredData = generateBreadcrumbSchema(breadcrumbItems)

  return (
    <>
      <StructuredDataScript data={structuredData} id="breadcrumb-structured-data" />
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <div key={index} className="flex items-center space-x-2">
              {index === 0 ? (
                <Link 
                  href={item.url.replace(baseUrl, '')} 
                  className="hover:text-[#F16112] transition-colors"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {isLast ? (
                    <span className="text-gray-900 font-medium">{item.name}</span>
                  ) : (
                    <Link 
                      href={item.url.replace(baseUrl, '')} 
                      className="hover:text-[#F16112] transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}

