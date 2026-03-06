import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('STEAM landing page', () => {
  test('shows STEAM overview and key CTAs', async ({ page }) => {
    await page.goto(`/${LOCALE}/steam`);

    await expect(
      page.getByRole('heading', { name: 'Our STEAM Programs', exact: true }),
    ).toBeVisible();

    // Main Enroll CTA in the header/banner (not footer or sidebar)
    await expect(
      page.getByRole('banner').getByRole('link', { name: /^Enroll$/i }),
    ).toBeVisible();
  });
});

