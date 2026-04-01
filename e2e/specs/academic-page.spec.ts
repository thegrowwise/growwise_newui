import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('Academic landing page', () => {
  test('shows key academic content and links', async ({ page }) => {
    await page.goto(localePath('/academic'));

    // Hero / main heading (specific academic hero)
    await expect(
      page.getByRole('heading', { name: 'Our Academic Programs', exact: true }),
    ).toBeVisible();

    // Book assessment CTA
    await expect(
      page.getByRole('link', { name: /Book Assessment/i }),
    ).toBeVisible();

    // Main Enroll CTA in the header/banner (not footer or sidebar)
    await expect(
      page.getByRole('banner').getByRole('link', { name: /^Enroll$/i }),
    ).toBeVisible();
  });
});
