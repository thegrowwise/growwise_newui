/**
 * Component to inject structured data (JSON-LD) into pages
 * Use this for client components that need structured data
 */

'use client'

import { useEffect } from 'react'

interface StructuredDataScriptProps {
  data: object | object[]
  id?: string
}

export function StructuredDataScript({ data, id = 'structured-data' }: StructuredDataScriptProps) {
  useEffect(() => {
    // Remove existing script if present
    const existing = document.getElementById(id)
    if (existing) {
      existing.remove()
    }

    // Create new script element
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(id)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [data, id])

  return null
}

