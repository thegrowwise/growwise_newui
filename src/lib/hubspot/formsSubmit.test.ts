import {
  extractContext,
  normalizeHubSpotFormBody,
} from './formsSubmit';

describe('normalizeHubSpotFormBody', () => {
  it('accepts flat object fields', () => {
    const r = normalizeHubSpotFormBody({
      fields: { email: 'a@b.com', firstname: 'Ada' },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fields).toEqual([
        { name: 'email', value: 'a@b.com' },
        { name: 'firstname', value: 'Ada' },
      ]);
    }
  });

  it('accepts HubSpot array shape', () => {
    const r = normalizeHubSpotFormBody({
      fields: [
        { name: 'email', value: 'x@y.com' },
        { name: 'lastname', value: 'Lovelace' },
      ],
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fields).toHaveLength(2);
    }
  });

  it('rejects missing fields', () => {
    const r = normalizeHubSpotFormBody({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toMatch(/Missing/);
  });

  it('rejects non-object body', () => {
    expect(normalizeHubSpotFormBody(null).ok).toBe(false);
    expect(normalizeHubSpotFormBody([]).ok).toBe(false);
  });

  it('rejects too many object keys', () => {
    const fields: Record<string, string> = {};
    for (let i = 0; i < 60; i += 1) fields[`f${i}`] = 'x';
    const r = normalizeHubSpotFormBody({ fields });
    expect(r.ok).toBe(false);
  });
});

describe('extractContext', () => {
  it('returns undefined when absent', () => {
    expect(extractContext({ fields: { a: '1' } })).toBeUndefined();
  });

  it('parses context', () => {
    expect(
      extractContext({
        fields: { email: 'a@b.com' },
        context: { pageUri: 'https://x.com/y', pageName: 'Y' },
      })
    ).toEqual({ pageUri: 'https://x.com/y', pageName: 'Y' });
  });
});
