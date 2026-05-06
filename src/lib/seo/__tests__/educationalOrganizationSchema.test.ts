import { CONTACT_INFO } from '@/lib/constants'
import { buildEducationalOrganizationSchema } from '@/lib/seo/educationalOrganizationSchema'

/** TC-09 — JSON-LD shape (automated); Rich Results UI remains manual. */
describe('buildEducationalOrganizationSchema — GWA-192 / TC-09', () => {
  const schema = buildEducationalOrganizationSchema() as Record<string, unknown>

  it('uses EducationalOrganization + LocalBusiness and GrowWise School name', () => {
    expect(schema['@type']).toEqual(['EducationalOrganization', 'LocalBusiness'])
    expect(schema.name).toBe('GrowWise School')
  })

  it('includes aggregateRating, knowsAbout, and expanded sameAs', () => {
    expect(schema.aggregateRating).toMatchObject({
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
    })
    expect(Array.isArray(schema.knowsAbout)).toBe(true)
    expect((schema.knowsAbout as unknown[]).length).toBeGreaterThanOrEqual(5)
    const sameAs = schema.sameAs as string[]
    expect(sameAs).toHaveLength(5)
    expect(sameAs.some((u) => u.includes('youtube.com'))).toBe(true)
  })

  it('uses CONTACT_INFO for telephone (single source of truth)', () => {
    expect(schema.telephone).toBe(CONTACT_INFO.phone)
  })

  it('includes Dublin street address and geo', () => {
    const addr = schema.address as Record<string, unknown>
    expect(addr.streetAddress).toBe(CONTACT_INFO.street)
    expect(addr.addressLocality).toBe('Dublin')
    const geo = schema.geo as Record<string, unknown>
    expect(typeof geo.latitude).toBe('number')
    expect(typeof geo.longitude).toBe('number')
  })

  it('hasOfferCatalog lists at least 5 course offers', () => {
    const catalog = schema.hasOfferCatalog as Record<string, unknown>
    const items = catalog.itemListElement as unknown[]
    expect(items.length).toBeGreaterThanOrEqual(5)
  })

  it('each catalog Course includes typicalAgeRange, educationalLevel, and nested offers', () => {
    const catalog = schema.hasOfferCatalog as Record<string, unknown>
    const items = catalog.itemListElement as Array<Record<string, unknown>>
    for (const offer of items) {
      const course = offer.itemOffered as Record<string, unknown>
      expect(course['@type']).toBe('Course')
      expect(course.typicalAgeRange).toMatch(/\d+-\d+/)
      expect(typeof course.educationalLevel).toBe('string')
      const nested = course.offers as Record<string, unknown>
      expect(nested['@type']).toBe('Offer')
      expect(nested.priceCurrency).toBe('USD')
      expect(nested.url).toBe(course.url)
    }
  })
})
