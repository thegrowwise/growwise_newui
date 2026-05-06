import { CONTACT_INFO } from '@/lib/constants'
import { buildEducationalOrganizationSchema } from '@/lib/seo/educationalOrganizationSchema'

/** TC-09 — JSON-LD shape (automated); Rich Results UI remains manual. */
describe('buildEducationalOrganizationSchema — GWA-192 / TC-09', () => {
  const schema = buildEducationalOrganizationSchema() as Record<string, unknown>

  it('uses EducationalOrganization and GrowWise School name', () => {
    expect(schema['@type']).toBe('EducationalOrganization')
    expect(schema.name).toBe('GrowWise School')
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
})
