import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Navigation and layout', () => {
  test('header links, cart icon, and enroll CTA work', async ({ page }) => {
    await page.goto(`/${LOCALE}`);

    // Header is visible
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 15000 });

    // Enroll button in header has correct href
    const enrollLink = page.getByRole('link', { name: /enroll/i }).first();
    await expect(enrollLink).toHaveAttribute('href', new RegExp(`/${LOCALE}/enroll`));

    // Cart icon link points to cart page
    const cartLink = page.getByRole('link', { name: /shopping cart/i }).first();
    await expect(cartLink).toHaveAttribute('href', new RegExp(`/${LOCALE}/cart`));
  });
});

