import { chatbotFormIntent, chatbotFormSource } from '@/lib/chatbotScope'

describe('chatbotFormIntent', () => {
  it('returns null for empty input', () => {
    expect(chatbotFormIntent('')).toBeNull()
    expect(chatbotFormIntent('   ')).toBeNull()
  })

  it('returns null for unrecognized text', () => {
    expect(chatbotFormIntent('what is the weather today')).toBeNull()
  })

  it('detects assessment intent', () => {
    expect(chatbotFormIntent('I want a free assessment')).toBe('assessment')
    expect(chatbotFormIntent('book a 60-minute assessment please')).toBe('assessment')
  })

  it('detects trial intent', () => {
    expect(chatbotFormIntent('can I try a 30-minute trial?')).toBe('trial')
    expect(chatbotFormIntent('demo class for my child')).toBe('trial')
  })

  it('detects camp intent', () => {
    expect(chatbotFormIntent('tell me about your summer camps')).toBe('camp')
    expect(chatbotFormIntent('We are looking at winter camp options.')).toBe('camp')
  })

  it('detects enroll intent', () => {
    expect(chatbotFormIntent('I want to enroll my son.')).toBe('enroll')
    expect(chatbotFormIntent('Where do I sign up?')).toBe('enroll')
  })

  it('detects contact intent', () => {
    expect(chatbotFormIntent('I want to talk to someone on your team.')).toBe('contact')
    expect(chatbotFormIntent('Can I send a message?')).toBe('contact')
  })

  it('honors priority: assessment beats trial when both keywords appear', () => {
    expect(chatbotFormIntent('book a free assessment after the 30-minute trial')).toBe(
      'assessment',
    )
  })

  it('honors priority: assessment beats camp when both keywords appear', () => {
    expect(chatbotFormIntent('assessment for my summer camp child')).toBe('assessment')
  })

  it('honors priority: trial beats enroll when both keywords appear', () => {
    expect(chatbotFormIntent('30-minute trial before I enroll')).toBe('trial')
  })

  it('honors priority: camp beats enroll when both keywords appear', () => {
    expect(chatbotFormIntent('I want to enroll in summer camps')).toBe('camp')
  })

  it('does NOT match "facebook" as enroll (book substring)', () => {
    expect(chatbotFormIntent('I saw your facebook page')).toBeNull()
  })

  it('does NOT trigger contact for benign uses of "contact"', () => {
    // 'contact' alone is not a phrase in CHATBOT_FORM_INTENTS.contact (we use
    // 'contact form' / 'reach out' etc), so a bare "your contact info" stays null.
    expect(chatbotFormIntent('what is your contact info')).toBeNull()
  })

  it('upgrades vague affirmatives when a page default is provided', () => {
    expect(chatbotFormIntent('yes', 'camp')).toBe('camp')
    expect(chatbotFormIntent('Tell me more!', 'assessment')).toBe('assessment')
    expect(chatbotFormIntent("I'm interested", 'enroll')).toBe('enroll')
  })

  it('does NOT upgrade vague affirmatives without a page default', () => {
    expect(chatbotFormIntent('yes')).toBeNull()
    expect(chatbotFormIntent('interested')).toBeNull()
  })

  it('explicit intent overrides page default', () => {
    expect(chatbotFormIntent('I want a free assessment', 'camp')).toBe('assessment')
  })

  it('is case-insensitive', () => {
    expect(chatbotFormIntent('I WANT A FREE ASSESSMENT')).toBe('assessment')
    expect(chatbotFormIntent('Summer Camp')).toBe('camp')
  })

  it('handles non-string input gracefully', () => {
    // @ts-expect-error testing runtime guard
    expect(chatbotFormIntent(undefined)).toBeNull()
    // @ts-expect-error testing runtime guard
    expect(chatbotFormIntent(null)).toBeNull()
  })
})

describe('chatbotFormSource', () => {
  it('produces a stable namespaced source string', () => {
    expect(chatbotFormSource('camp')).toBe('chatbot-camp')
    expect(chatbotFormSource('assessment')).toBe('chatbot-assessment')
    expect(chatbotFormSource('trial')).toBe('chatbot-trial')
    expect(chatbotFormSource('enroll')).toBe('chatbot-enroll')
    expect(chatbotFormSource('contact')).toBe('chatbot-contact')
  })
})
