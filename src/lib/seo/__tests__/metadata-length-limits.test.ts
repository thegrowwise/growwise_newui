import enMessages from '@/i18n/messages/en.json'
import { getCampPage } from '@/lib/camps/get-camp-page'
import { getMetadataConfig } from '@/lib/seo/metadataConfig'

/** TC-05 (≤60 char titles) & TC-06 (≤155 char descriptions) — character limits only; SERP pixel width is manual. (Trace: GWA-192.) */
const MAX_TITLE_LEN = 60
const MAX_DESC_LEN = 155

function assertTitle(path: string, title: string) {
  expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LEN)
  expect(title).toMatch(/\S/)
}

function assertDesc(path: string, description: string) {
  expect(description.length).toBeLessThanOrEqual(MAX_DESC_LEN)
  expect(description).toMatch(/\S/)
}

describe('Metadata length limits — TC-05 / TC-06', () => {
  describe('metadataConfig static paths', () => {
    it.each([
      ['/camps/summer'],
      ['/enroll'],
    ] as const)('title + description for %s', (path) => {
      const config = getMetadataConfig(path)
      expect(config).not.toBeNull()
      assertTitle(path, config!.title)
      assertDesc(path, config!.description)
    })
  })

  describe('camp landing seoTitle / metaDescription', () => {
    const slugs = [
      'math-olympiad-camp-dublin-ca',
      'ai-studio-dublin-ca',
      'game-development-camp-dublin-ca',
      'young-authors-camp-dublin-ca',
    ] as const

    it.each(slugs)('%s — title and meta length', (slug) => {
      const page = getCampPage(slug)
      expect(page).toBeDefined()
      assertTitle(`/camps/${slug}`, page!.seoTitle)
      assertDesc(`/camps/${slug}`, page!.metaDescription)
    })
  })

  describe('blog posts (generateMetadata strings)', () => {
    it('high-school-math-finals-prep-dublin-tri-valley', () => {
      const title = 'High School Math Finals Prep Dublin CA | GrowWise'
      const description =
        'High school math finals prep in Dublin, CA. Exam-style practice for Algebra 1 through AP Precalculus. In-center sessions at GrowWise School.'
      assertTitle('/growwise-blogs/high-school-math-finals-prep-dublin-tri-valley', title)
      assertDesc('/growwise-blogs/high-school-math-finals-prep-dublin-tri-valley', description)
    })

    it('improve-child-focus-feel-valued', () => {
      const title = "12 Ways to Improve Your Child's Focus | GrowWise"
      const description =
        'Simple, research-backed strategies to help your child focus better in school and at home. A parent guide from GrowWise School in Dublin, CA.'
      assertTitle('/growwise-blogs/improve-child-focus-feel-valued', title)
      assertDesc('/growwise-blogs/improve-child-focus-feel-valued', description)
    })
  })

  it('en locale enroll metaDescription from messages matches length cap (used by enroll layout)', () => {
    const meta = enMessages.enrollnow?.metaDescription
    expect(typeof meta).toBe('string')
    assertDesc('/enroll (en.json)', meta as string)
  })
})
