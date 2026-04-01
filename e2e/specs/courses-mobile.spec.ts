import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 14'] });

test.describe('Courses pages (mobile)', () => {
  const paths = [
    '/courses/math',
    '/courses/english',
    '/courses/sat-prep',
    '/courses/high-school-math',
  ];

  for (const path of paths) {
    test(`${path} does not 404`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res, `No response for ${path}`).not.toBeNull();
      expect(res!.status(), `${path} returned ${res!.status()}`).not.toBe(404);
    });
  }
});

test.describe('Camps pages (mobile)', () => {
  const paths = ['/camps/summer', '/camps/winter'];

  for (const path of paths) {
    test(`${path} does not 404`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res, `No response for ${path}`).not.toBeNull();
      expect(res!.status(), `${path} returned ${res!.status()}`).not.toBe(404);
    });
  }
});
