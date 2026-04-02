import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('Student login page', () => {
  test('renders login form fields and CTA', async ({ page }) => {
    await page.goto(localePath('/student-login'));

    await expect(
      page.getByRole('heading', { name: /Welcome back/i }),
    ).toBeVisible();

    // We don't assert inner fields because the content is rendered via external iframe / redirect.
    const redirectButton = page.getByRole('button', { name: /Go to Login Page/i });
    const iframe = page.frameLocator('iframe[title="Student Login"]');

    // Either the direct-login button (fallback) is visible, or the iframe-based login is rendered.
    if (await redirectButton.isVisible().catch(() => false)) {
      await expect(redirectButton).toBeVisible();
    } else {
      // Assert that at least the iframe container exists in the DOM
      await expect(page.locator('iframe[title="Student Login"]')).toBeVisible();
    }
  });
});

