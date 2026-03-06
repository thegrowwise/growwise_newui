import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Academic enrollment form', () => {
  test('submits academic enrollment successfully with mocked backend', async ({ page }) => {
    await page.route('**/api/enrollment', async (route) => {
      const body = await route.request().postDataJSON();
      expect(body.fullName).toContain('Student');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(`/${LOCALE}/enroll-academic`);

    // Basic info
    await page.getByLabel(/Parent Name/i).fill('Parent Name');
    await page.getByLabel(/Student\/Candidate Name/i).fill('Student Name');

    // Subject select (Radix Select trigger with placeholder text)
    await page.getByText('Select a subject').click();
    await page.getByRole('option', { name: /^Math$/i }).click();

    // Grade select (Radix Select trigger; match by visible placeholder text)
    await page.locator('button', { hasText: 'Select grade level' }).first().click();
    await page.getByRole('option', { name: /^Grade 5$/i }).click();

    // Contact details
    await page.getByLabel(/Mobile Phone Number/i).fill('5551234567');
    await page.getByLabel(/Email Address/i).fill('parent@example.com');
    await page.getByLabel(/^City\b/i).fill('Dublin');
    await page.getByLabel(/Postal Code/i).fill('94568');

    // Consent checkbox
    await page.getByLabel(/I agree to receive/i).click();

    // Submit
    await page.getByRole('button', { name: /Complete Registration/i }).click();

    // Success
    await expect(
      page.getByRole('heading', { name: /Registration Successful!/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});

