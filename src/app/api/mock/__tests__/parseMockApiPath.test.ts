import { parseMockApiPath } from '../parseMockApiPath';

describe('parseMockApiPath', () => {
  it('returns empty for no segments', () => {
    expect(parseMockApiPath([])).toEqual({ ok: false, reason: 'empty' });
  });

  it('single segment: default locale en, file is the segment', () => {
    expect(parseMockApiPath(['home.json'])).toEqual({
      ok: true,
      locale: 'en',
      fileName: 'home.json',
    });
  });

  it('two segments: locale + file', () => {
    expect(parseMockApiPath(['zh', 'home.json'])).toEqual({
      ok: true,
      locale: 'zh',
      fileName: 'home.json',
    });
  });
});
