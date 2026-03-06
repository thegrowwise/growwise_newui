import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('About and blogs pages', () => {
  test('About page shows mission and contact CTA', async ({ page }) => {
    await page.goto(`/${LOCALE}/about`);

    await expect(
      page.getByRole('heading', { name: /About/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('banner').getByRole('link', { name: /Contact Us/i }),
    ).toBeVisible();
  });

  test('Blogs listing page loads and shows posts', async ({ page }) => {
    await page.goto(`/${LOCALE}/growwise-blogs`);

    await expect(
      page.getByRole('heading', { name: /Blogs|Articles|Resources/i }),
    ).toBeVisible();

    // At least one blog card/link should be visible
    await expect(
      page.getByRole('link').filter({ hasText: /Read More|Learn More|View/i }).first(),
    ).toBeVisible();
  });
});

