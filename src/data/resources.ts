/** Free downloadable resources (lead capture). Minimal module so Jest + capture flows have a single source. */

export type FreeResource = {
  id: string
  driveUrl: string
}

export const FREE_RESOURCES: readonly FreeResource[] = [
  {
    id: 'sample-resource',
    driveUrl: 'https://drive.google.com/file/d/sample/view',
  },
]

export function normalizeLeadEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function getResourceBySlug(slug: string): FreeResource | undefined {
  return FREE_RESOURCES.find((r) => r.id === slug)
}

export function matchResourceForCapture(
  id: string,
  driveUrl: string,
): FreeResource | undefined {
  const r = getResourceBySlug(id)
  if (!r || r.driveUrl !== driveUrl) return undefined
  return r
}
