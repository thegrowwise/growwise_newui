/**
 * Canonical origin for metadata, sitemap, JSON-LD, and absolute URLs.
 * No trailing slash. Set NEXT_PUBLIC_SITE_URL in each environment; falls back to production host.
 */
export function getCanonicalSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://growwiseschool.org'
  return raw.replace(/\/$/, '')
}
