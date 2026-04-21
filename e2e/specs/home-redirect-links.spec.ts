import { test, expect } from '@playwright/test';

/**
 * Routes that home/program sections should navigate to (CTAs and card links).
 * Smoke: each path returns a non-404 response when loaded directly.
 */
const MARKETING_ROUTES = [
  '/courses/math',
  '/courses/english',
  '/courses/sat-prep',
  '/steam/ml-ai-coding',
  '/workshop-calendar',
] as const;

test.describe('Marketing route targets (home CTAs)', () => {
  for (const path of MARKETING_ROUTES) {
    test(`${path} responds without 404`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res?.status(), `${path} status`).not.toBe(404);
    });
  }

  test('home page exposes internal links in main', async ({ page }) => {
    // domcontentloaded — avoid networkidle (analytics/third-party keeps network busy → flaky timeouts)
    const res = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(res?.status()).not.toBe(404);

    await page.locator('main').waitFor({ state: 'attached', timeout: 15_000 });
    // Home is client-heavy; links appear after hydration (not at domcontentloaded).
    await page.locator('main a[href^="/"]').first().waitFor({ state: 'visible', timeout: 20_000 });

    const internalCount = await page.locator('main a[href^="/"]').count();
    expect(internalCount, 'main should contain internal links').toBeGreaterThan(5);
  });
});
