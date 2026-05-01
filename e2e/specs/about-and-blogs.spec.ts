import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('About and blogs pages', () => {
  test('About page shows mission and contact CTA', async ({ page }) => {
    await page.goto(localePath('/about'));

    await expect(
      page.getByRole('heading', { name: /About/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('banner').getByRole('link', { name: /Contact Us/i }),
    ).toBeVisible();
  });

  test('Blogs listing page loads and shows posts', async ({ page }) => {
    await page.goto(localePath('/growwise-blogs'));

    await expect(
      page.getByRole('heading', { name: /Blogs|Articles|Resources/i }).first(),
    ).toBeVisible();

    // Card CTA is "Read article »" (growwise-blogs `readMore`); not "Read More" / "Learn More"
    await expect(page.getByRole('link', { name: /Read article/i }).first()).toBeVisible();
  });
});

