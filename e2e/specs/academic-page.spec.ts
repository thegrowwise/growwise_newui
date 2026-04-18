import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('Academic landing page', () => {
  test('shows key academic content and links', async ({ page }) => {
    await page.goto(localePath('/academic'));

    // Must be exact: /Our Academic Programs/i also matches “Why Choose Our Academic Programs?”
    await expect(
      page.getByRole('heading', { name: 'Our Academic Programs', exact: true }),
    ).toBeVisible();

    // Two CTAs match (hero + bottom); assert at least one is visible
    await expect(page.getByRole('button', { name: /Book.*Assessment/i }).first()).toBeVisible();

    // Hero primary enrollment CTA
    await expect(page.getByRole('button', { name: /Enroll Now/i }).first()).toBeVisible();
  });
});
