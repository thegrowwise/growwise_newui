import {
  FREE_RESOURCES,
  matchResourceForCapture,
  normalizeLeadEmail,
  getResourceBySlug,
} from '@/data/resources'

describe('free resources data', () => {
  it('loads at least one resource from JSON', () => {
    expect(FREE_RESOURCES.length).toBeGreaterThanOrEqual(1)
  })

  it('normalizes email with trim and lower case', () => {
    expect(normalizeLeadEmail('  Test@EXAMPLE.com \n')).toBe('test@example.com')
  })

  it('getResourceBySlug returns resource when id matches', () => {
    const first = FREE_RESOURCES[0]
    expect(first).toBeDefined()
    expect(getResourceBySlug(first!.id)?.id).toBe(first!.id)
    expect(getResourceBySlug('nonexistent-slug-xyz')).toBeUndefined()
  })

  it('matchResourceForCapture accepts matching id and driveUrl', () => {
    const r = FREE_RESOURCES[0]
    expect(r).toBeDefined()
    const m = matchResourceForCapture(r!.id, r!.driveUrl)
    expect(m?.id).toBe(r!.id)
  })

  it('matchResourceForCapture rejects wrong driveUrl', () => {
    const r = FREE_RESOURCES[0]
    expect(r).toBeDefined()
    expect(matchResourceForCapture(r!.id, 'https://evil.example/phish')).toBeUndefined()
  })

  it('matchResourceForCapture rejects unknown id', () => {
    expect(matchResourceForCapture('unknown-id', 'https://x')).toBeUndefined()
  })
})
