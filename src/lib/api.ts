import { buildLocalizedMockPaths, getApiBase, getCurrentLocale, useMock } from './locale'

export async function fetchJsonWithLocale<T>(file: string, serverPath?: string): Promise<T> {
  if (useMock() || !serverPath) {
    const locale = getCurrentLocale('en')
    const paths = buildLocalizedMockPaths(locale, file)
    let lastErr: unknown = null
    for (const p of paths) {
      try {
        const res = await fetch(p, { cache: 'no-store' })
        if (res.ok) return (await res.json()) as T
        lastErr = new Error(`HTTP ${res.status}`)
      } catch (e) {
        lastErr = e
      }
    }
    throw lastErr ?? new Error('Failed to fetch mock json')
  }

  const base = getApiBase()
  const url = `${base}${serverPath}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}


