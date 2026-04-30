import raw from './resources.json'

/** Tab labels excluding “All”. Must match `category` in resources.json. */
export const RESOURCE_CATEGORIES = [
  'Math',
  'English',
  'Coding',
  'AI & Prompts',
  'Web Dev',
  'Parent Guides',
] as const

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]

export const FREE_RESOURCES_TAB_IDS = ['All', ...RESOURCE_CATEGORIES] as const

export type FreeResourcesTabId = (typeof FREE_RESOURCES_TAB_IDS)[number]

export interface FreeResource {
  id: string
  name: string
  category: ResourceCategory
  grade: string
  description: string
  driveUrl: string
}

function isResourceCategory(v: string): v is ResourceCategory {
  return (RESOURCE_CATEGORIES as readonly string[]).includes(v)
}

function parseResources(data: unknown): FreeResource[] {
  if (!Array.isArray(data)) return []
  const out: FreeResource[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = typeof o.id === 'string' ? o.id.trim() : ''
    const name = typeof o.name === 'string' ? o.name : ''
    const categoryRaw = typeof o.category === 'string' ? o.category : ''
    const grade = typeof o.grade === 'string' ? o.grade : ''
    const description = typeof o.description === 'string' ? o.description : ''
    const driveUrl = typeof o.driveUrl === 'string' ? o.driveUrl.trim() : ''
    if (!id || !name || !grade || !description || !driveUrl || !isResourceCategory(categoryRaw)) {
      continue
    }
    out.push({
      id,
      name,
      category: categoryRaw,
      grade,
      description,
      driveUrl,
    })
  }
  return out
}

/** Parsed, validated list (skips invalid rows). */
export const FREE_RESOURCES: FreeResource[] = parseResources(raw)

export function getResourceBySlug(slug: string): FreeResource | undefined {
  const s = slug.trim()
  return FREE_RESOURCES.find((r) => r.id === s)
}

/**
 * Confirms client-supplied id + driveUrl match a single catalog row.
 * Email body must use `matched.driveUrl` from the return value (canonical).
 */
export function matchResourceForCapture(
  resourceId: string,
  driveUrl: string
): FreeResource | undefined {
  const r = getResourceBySlug(resourceId)
  if (!r) return undefined
  if (r.driveUrl.trim() !== driveUrl.trim()) return undefined
  return r
}

/** Required by POST /api/capture-lead — same normalization as DB. */
export function normalizeLeadEmail(email: string): string {
  return email.trim().toLowerCase()
}
