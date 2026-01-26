'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function BlogImage({
  src,
  alt,
  className = '',
  fill,
  width,
  height,
  priority = false,
  sizes,
  objectFit = 'cover'
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Fallback to a placeholder or hide the image
      setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==')
    }
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        unoptimized
        onError={handleError}
        style={{ objectFit }}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 1200}
      height={height || 675}
      className={className}
      priority={priority}
      unoptimized
      onError={handleError}
      style={{ objectFit }}
    />
  )
}

