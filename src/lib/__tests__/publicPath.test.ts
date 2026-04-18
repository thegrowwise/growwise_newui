import { publicPath, pathWithoutLocalePrefix } from '@/lib/publicPath';

describe('publicPath', () => {
  it('default locale keeps clean paths (no /en prefix)', () => {
    expect(publicPath('/courses/english', 'en')).toBe('/courses/english');
    expect(publicPath('courses/math', 'en')).toBe('/courses/math');
    expect(publicPath('/', 'en')).toBe('/');
  });

  it('trims whitespace', () => {
    expect(publicPath('  /steam/ml-ai-coding  ', 'en')).toBe('/steam/ml-ai-coding');
  });

  it('adds leading slash when missing', () => {
    expect(publicPath('workshop-calendar', 'en')).toBe('/workshop-calendar');
  });
});

describe('pathWithoutLocalePrefix', () => {
  it('strips a single leading locale segment when it is a known locale', () => {
    expect(pathWithoutLocalePrefix('/en/courses/english')).toBe('/courses/english');
  });

  it('returns root for bare locale path', () => {
    expect(pathWithoutLocalePrefix('/en')).toBe('/');
  });

  it('leaves default paths unchanged when no locale prefix', () => {
    expect(pathWithoutLocalePrefix('/courses/english')).toBe('/courses/english');
  });
});
