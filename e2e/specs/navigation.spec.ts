import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('Navigation and layout', () => {
  test('header links, cart icon, and enroll CTA work', async ({ page }) => {
    await page.goto(localePath('/'));

    // Header is visible
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 15000 });

    // Enroll button in header has correct href
    const enrollLink = page.getByRole('link', { name: /enroll/i }).first();
    await expect(enrollLink).toHaveAttribute('href', localePath('/enroll'));

    // Cart icon link points to cart page
    const cartLink = page.getByRole('link', { name: /shopping cart/i }).first();
    await expect(cartLink).toHaveAttribute('href', localePath('/cart'));
  });
});
