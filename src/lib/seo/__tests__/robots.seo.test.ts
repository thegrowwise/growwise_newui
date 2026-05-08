import robots from '@/app/robots'

/** TC-07 — robots.txt policy for crawlable courses/steam (automated: built rules object). */
describe('robots() — GWA-192 / TC-07', () => {
  it('allows all, disallows only student-login and cart, and sets sitemap', () => {
    const r = robots()
    expect(r.sitemap).toMatch(/sitemap\.xml$/)

    const rules = r.rules
    if (Array.isArray(rules)) {
      throw new Error('Expected single rules object for this policy')
    }
    expect(rules.userAgent).toBe('*')
    expect(rules.allow).toBe('/')
    expect(rules.disallow).toEqual(['/student-login', '/cart'])
  })

  it('does not disallow query-param crawl hacks used previously', () => {
    const serialized = JSON.stringify(robots())
    expect(serialized).not.toContain('?type=')
    expect(serialized).not.toContain('/courses/')
    expect(serialized).not.toContain('/steam/')
    expect(serialized).not.toContain('/api/')
  })
})
