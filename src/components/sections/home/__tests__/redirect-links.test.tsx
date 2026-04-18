/**
 * Ensures home "Programs" / Popular Courses UIs expose real internal hrefs
 * (links styled as buttons or plain hyperlinks).
 */
import React from 'react';
import { render, screen, within } from '@/test-utils';
import { ProgramsSection } from '../ProgramsSection';
import { PopularCoursesSection } from '../PopularCoursesSection';
import { getIconComponent } from '@/lib/iconMap';
import { publicPath } from '@/lib/publicPath';
import type { ProgramVM } from '../ProgramsSection';
import type { PopularCourseVM } from '../PopularCoursesSection';

import homeEn from '../../../../../public/api/mock/en/home.json';

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

function toProgramVMs(
  rows: Array<Record<string, unknown>>,
): ProgramVM[] {
  return rows.map((p) => ({
    ...(p as ProgramVM),
    IconComponent: getIconComponent(String(p.icon)),
  }));
}

function toPopularCourseVMs(
  rows: Array<Record<string, unknown>>,
): PopularCourseVM[] {
  return rows.map((c) => ({
    ...(c as PopularCourseVM),
    IconComponent: getIconComponent(String(c.icon)),
  }));
}

function assertNoEmptyOrHashOnlyHref(links: HTMLElement[]) {
  for (const a of links) {
    const href = a.getAttribute('href');
    if (!href || href.match(/^(#|)$/)) {
      throw new Error(
        `Invalid href for link "${a.textContent?.trim()}": ${String(href)}`,
      );
    }
  }
}

describe('ProgramsSection redirect links (K-12 + STEAM)', () => {
  const locale = 'en';
  const k12 = toProgramVMs(homeEn.k12Programs as Array<Record<string, unknown>>);
  const steam = toProgramVMs(homeEn.steamPrograms as Array<Record<string, unknown>>);

  it('every link has a non-empty internal href', () => {
    render(<ProgramsSection k12={k12} steam={steam} />);
    const links = screen.getAllByRole('link');
    assertNoEmptyOrHashOnlyHref(links as HTMLElement[]);
  });

  it('K-12 card CTAs point at course routes from mock ctaUrl', () => {
    render(<ProgramsSection k12={k12} steam={steam} />);
    const k12Root = screen
      .getByRole('heading', { name: /K-12 Academic Programs/i })
      .closest('.mb-20');
    expect(k12Root).toBeTruthy();

    const ctaLinks = within(k12Root as HTMLElement).getAllByRole('link', {
      name: /^Start Learning$/i,
    });
    expect(ctaLinks).toHaveLength(k12.length);

    k12.forEach((program, i) => {
      const url = program.ctaUrl ?? program.href;
      if (!url) {
        throw new Error(`Missing ctaUrl/href for program: ${program.title}`);
      }
      expect(ctaLinks[i]).toHaveAttribute('href', publicPath(url, locale));
    });
  });

  it('STEAM card CTAs point at workshop calendar', () => {
    render(<ProgramsSection k12={k12} steam={steam} />);
    const expectedWorkshop = publicPath('/workshop-calendar', locale);
    const steamRoot = screen
      .getByRole('heading', { name: /^STEAM Programs$/i })
      .closest('.mb-16');
    expect(steamRoot).toBeTruthy();

    const ctaLinks = within(steamRoot as HTMLElement).getAllByRole('link', {
      name: /^Book Free Trial$/i,
    });
    expect(ctaLinks).toHaveLength(steam.length);
    ctaLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', expectedWorkshop);
    });
  });
});

describe('PopularCoursesSection redirect links', () => {
  const locale = 'en';
  const courses = toPopularCourseVMs(
    homeEn.popularCourses as Array<Record<string, unknown>>,
  );

  it('each popular course card is a single link with expected href', () => {
    render(
      <PopularCoursesSection courses={courses} error={null} onRetry={undefined} />,
    );
    const links = screen.getAllByRole('link');
    assertNoEmptyOrHashOnlyHref(links as HTMLElement[]);
    expect(links).toHaveLength(courses.length);

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      const href = c.href;
      if (!href) {
        throw new Error(`Missing href for popular course: ${c.name}`);
      }
      expect(links[i]).toHaveAttribute('href', publicPath(href, locale));
    }
  });
});
