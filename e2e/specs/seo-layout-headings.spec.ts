import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

/**
 * SEO regression: headings & landmarks (originally GWA-192 — TC-01, TC-04, TC-08, partial TC-02).
 * Manual: Screaming Frog, Lighthouse CLS, Google Rich Results, GSC (TC-11).
 */

test.describe('SEO — headings & landmarks (TC-01 / TC-04 / TC-08)', () => {
  test('TC-01: no h2 in nav or footer on homepage', async ({ page }) => {
    await page.goto(localePath('/'));
    await expect(page.locator('nav h2')).toHaveCount(0);
    await expect(page.locator('footer h2')).toHaveCount(0);
  });

  test('TC-01: no h2 in nav or footer on /courses/math', async ({ page }) => {
    await page.goto(localePath('/courses/math'));
    await expect(page.locator('nav h2')).toHaveCount(0);
    await expect(page.locator('footer h2')).toHaveCount(0);
  });

  test('TC-01: no h2 in nav or footer on /about', async ({ page }) => {
    await page.goto(localePath('/about'));
    await expect(page.locator('nav h2')).toHaveCount(0);
    await expect(page.locator('footer h2')).toHaveCount(0);
  });

  test('TC-01: no h2 in nav or footer on /camps/summer', async ({ page }) => {
    await page.goto(localePath('/camps/summer'));
    await expect(page.locator('nav h2')).toHaveCount(0);
    await expect(page.locator('footer h2')).toHaveCount(0);
  });

  test('TC-04: single main h1 with exact copy on math, english, enroll', async ({ page }) => {
    await page.goto(localePath('/courses/math'));
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText(
      'Math Tutoring Classes in Dublin, CA — Grades 1–12',
    );

    await page.goto(localePath('/courses/english'));
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText(
      'English & Reading Classes in Dublin, CA — Grades 1–12',
    );

    await page.goto(localePath('/enroll'));
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText('Enroll at GrowWise School — Dublin, CA');
  });

  test('TC-08: SAT prep hero h1 reads as one line with correct spacing', async ({ page }) => {
    await page.goto(localePath('/courses/sat-prep'));
    const text = await page.locator('main h1').innerText();
    const normalized = text.replace(/\s+/g, ' ').trim();
    expect(normalized).toBe('SAT Prep Courses in Dublin, CA');
  });
});

test.describe('SEO — TC-02 partial (cart)', () => {
  test('shopping cart link in header has aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(localePath('/'));
    const cart = page.getByRole('link', { name: /shopping cart/i }).first();
    await expect(cart).toBeVisible();
    await expect(cart).toHaveAttribute('aria-label', /shopping cart/i);
  });
});
