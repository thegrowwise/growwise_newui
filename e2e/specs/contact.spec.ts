import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Contact form', () => {
  test('submits contact form successfully with mocked backend', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      const body = await route.request().postDataJSON();
      expect(body.name).toContain('First Last');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'OK' }),
      });
    });

    await page.goto(`/${LOCALE}/contact`);

    // Fill required fields
    await page.getByLabel(/First Name/i).fill('First');
    await page.getByLabel(/Last Name/i).fill('Last');
    await page.getByLabel(/Email Address/i).fill('first.last@example.com');
    await page.getByLabel(/Phone Number/i).fill('5551234567');
    await page.getByLabel(/^Subject \*/i).fill('Free Assessment Request');
    await page.getByLabel(/^Message \*/i).fill(
      'I would like more information about programs.',
    );

    // Consent checkbox
    await page.getByLabel(/I agree to receive/i).click();

    // Submit
    await page.getByRole('button', { name: /Send|submit/i }).click();

    // Success view shows "Send Another Message" button
    await expect(
      page.getByRole('button', { name: /Send Another Message/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});

