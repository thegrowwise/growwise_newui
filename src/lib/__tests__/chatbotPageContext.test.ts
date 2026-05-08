import { resolveChatPageContext } from '@/lib/chatbotPageContext'

describe('resolveChatPageContext', () => {
  it('returns default for unknown / empty paths', () => {
    expect(resolveChatPageContext('').id).toBe('default')
    expect(resolveChatPageContext(undefined).id).toBe('default')
    expect(resolveChatPageContext(null).id).toBe('default')
    expect(resolveChatPageContext('/random-page').id).toBe('default')
  })

  it('detects camps hub', () => {
    const c = resolveChatPageContext('/camps')
    expect(c.id).toBe('campsHub')
    expect(c.defaultFormType).toBe('camp')
  })

  it('detects camps hub with trailing slash', () => {
    expect(resolveChatPageContext('/camps/').id).toBe('campsHub')
  })

  it('detects summer / winter camps', () => {
    expect(resolveChatPageContext('/camps/summer').id).toBe('campsSummer')
    expect(resolveChatPageContext('/camps/winter').id).toBe('campsWinter')
  })

  it('detects nested camp season subpages (success pages, etc)', () => {
    expect(resolveChatPageContext('/camps/summer/guide-success').id).toBe('campsSummer')
    expect(resolveChatPageContext('/camps/winter/calendar').id).toBe('campsWinter')
  })

  it('strips locale prefix before matching', () => {
    expect(resolveChatPageContext('/en/camps/summer').id).toBe('campsSummer')
    expect(resolveChatPageContext('/es/camps/winter').id).toBe('campsWinter')
    expect(resolveChatPageContext('/hi/contact').id).toBe('contact')
    expect(resolveChatPageContext('/zh/enroll').id).toBe('enroll')
  })

  it('detects a real camp slug and pre-fills campInterest', () => {
    const c = resolveChatPageContext('/camps/ai-studio-dublin-ca')
    expect(c.id).toBe('campSlug')
    expect(c.defaultFormType).toBe('camp')
    expect(c.prefill?.campInterest).toMatch(/AI Studio/i)
    expect(c.llmHint).toMatch(/AI Studio/i)
  })

  it('falls back to default for unknown camp slugs', () => {
    // Unknown slug doesn't match summer/winter and has no entry — falls to default,
    // since the resolver tries the slug branch first and bails out cleanly.
    expect(resolveChatPageContext('/camps/this-slug-does-not-exist').id).toBe('default')
  })

  it('detects assessment / enroll / contact pages', () => {
    expect(resolveChatPageContext('/book-assessment').defaultFormType).toBe('assessment')
    expect(resolveChatPageContext('/enroll').defaultFormType).toBe('enroll')
    expect(resolveChatPageContext('/enroll-academic').defaultFormType).toBe('enroll')
    expect(resolveChatPageContext('/contact').defaultFormType).toBe('contact')
  })

  it('marks course pages as informational (no default form)', () => {
    const c = resolveChatPageContext('/courses/math')
    expect(c.id).toBe('courseTopic')
    expect(c.defaultFormType).toBeNull()
  })

  it('always returns suggestion keys', () => {
    expect(resolveChatPageContext('/').suggestionKeys.length).toBeGreaterThan(0)
    expect(resolveChatPageContext('/camps/summer').suggestionKeys.length).toBeGreaterThan(0)
    expect(resolveChatPageContext('/contact').suggestionKeys.length).toBeGreaterThan(0)
  })
})
