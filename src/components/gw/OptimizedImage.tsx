/**
 * Optimized Image component using next/image with fallback support
 * Replaces ImageWithFallback for better performance and SEO
 */

'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

/** GWA-192 / TC-03: every next/image use must have `fill` or explicit `width` + `height`. */
type OptimizedImageCommon = {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
}

export type OptimizedImageProps = OptimizedImageCommon &
  (
    | {
        fill: true
        sizes?: string
        width?: never
        height?: never
      }
    | {
        fill?: false
        width: number
        height: number
        sizes?: string
      }
  )

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  fill,
  sizes,
  priority = false,
  quality = 75,
  objectFit = 'cover',
  objectPosition = 'center',
  ...rest
}: OptimizedImageProps) {
  const [didError, setDidError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    if (!didError) {
      setDidError(true)
      setImgSrc(ERROR_IMG_SRC)
    }
  }

  // If it's an external URL, we need to configure it in next.config.ts
  // For now, use unoptimized for external images
  const isExternal = imgSrc.startsWith('http') && !imgSrc.includes('growwiseschool.org')
  
  // If error occurred, use regular img tag
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt={alt || 'Error loading image'} 
            className={className}
            style={style}
            {...rest} 
          />
        </div>
      </div>
    )
  }

  // Use next/image for optimized images. Explicit fetchPriority for LCP (Lighthouse).
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        style={style}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        quality={quality}
        onError={handleError}
        unoptimized={isExternal}
        loading={priority ? undefined : 'lazy'}
        {...rest}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      quality={quality}
      onError={handleError}
      unoptimized={isExternal}
      loading={priority ? undefined : 'lazy'}
      {...rest}
    />
  )
}

