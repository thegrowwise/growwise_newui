/**
 * Contract tests for committed mock home.json files under public/api/mock (per locale).
 * Synchronous, no network — catches bad hrefs and broken JSON before deploy.
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const MOCK_ROOT = join(process.cwd(), 'public', 'api', 'mock');
const HOME_LOCALES = ['en', 'es', 'hi', 'zh'] as const;

type PopularCourse = {
  id: number;
  name?: string;
  href?: string;
  cta?: string;
};

type HeroSlide = {
  id: number;
  title?: string;
  cta?: string;
  secondaryCta?: string;
  secondaryCtaUrl?: string;
};

type HomeJson = {
  popularCourses?: PopularCourse[];
  heroSlides?: HeroSlide[];
};

function readHomeJson(locale: string): HomeJson {
  const filePath = join(MOCK_ROOT, locale, 'home.json');
  if (!existsSync(filePath)) {
    throw new Error(`Missing mock file: ${filePath}`);
  }
  const raw = readFileSync(filePath, 'utf8');
  if (!raw.trim()) {
    throw new Error(`Empty file: ${filePath}`);
  }
  return JSON.parse(raw) as HomeJson;
}

function assertInternalPath(href: string, label: string) {
  if (!/^\//.test(href)) {
    throw new Error(`${label}: href must start with /`);
  }
  if (/^\/\//.test(href)) {
    throw new Error(`${label}: href must not start with //`);
  }
  if (href.includes('http')) {
    throw new Error(`${label}: href must not contain http`);
  }
}

describe('home.json mock contracts', () => {
  describe.each([...HOME_LOCALES])('locale %s', (locale) => {
    it('parses and defines popularCourses with valid internal hrefs', () => {
      const data = readHomeJson(locale);
      const courses = data.popularCourses;
      if (!courses) {
        throw new Error(`popularCourses missing in ${locale}`);
      }
      expect(courses.length).toBeGreaterThanOrEqual(4);

      const ids = courses.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const c of courses) {
        if (typeof c.href !== 'string') {
          throw new Error(`href must be string (${locale} id=${c.id})`);
        }
        assertInternalPath(c.href, `${locale} popular id=${c.id}`);
      }

      const ela = courses.find((c) => c.id === 4);
      if (!ela) {
        throw new Error(`ELA card id=4 missing in ${locale}`);
      }
      expect(ela.href).toBe('/courses/english');
    });

    it('hero slide 1 has required marketing fields when secondary CTAs are used', () => {
      const data = readHomeJson(locale);
      const slides = data.heroSlides;
      if (!slides?.length) {
        throw new Error(`heroSlides missing or empty (${locale})`);
      }
      const first = slides[0];
      if (typeof first.title !== 'string' || first.title.length === 0) {
        throw new Error(`hero[0].title invalid (${locale})`);
      }
      if (typeof first.cta !== 'string') {
        throw new Error(`hero[0].cta invalid (${locale})`);
      }

      if (first.secondaryCta?.trim()) {
        if (!first.secondaryCtaUrl?.trim()) {
          throw new Error(`secondaryCtaUrl required when secondaryCta set (${locale})`);
        }
        assertInternalPath(first.secondaryCtaUrl, `hero secondaryCtaUrl ${locale}`);
      }
    });
  });
});
