import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

test.describe('Academic enrollment form', () => {
  test('submits academic enrollment successfully with mocked backend', async ({ page }) => {
    await page.route('**/api/enroll', async (route) => {
      const body = await route.request().postDataJSON();
      expect(body.fullName).toContain('Student');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(localePath('/enroll-academic'));

    await page.getByLabel(/Parent Name/i).fill('Parent Name');
    await page.getByLabel(/Student\/Candidate Name/i).fill('Student Name');

    await page.getByText('Select a subject').click();
    await page.getByRole('option', { name: /^Math$/i }).click();

    await page.locator('button', { hasText: 'Select grade level' }).first().click();
    await page.getByRole('option', { name: /^Grade 5$/i }).click();

    await page.getByLabel(/Mobile Phone Number/i).fill('5551234567');
    await page.getByLabel(/Email Address/i).fill('parent@example.com');
    await page.getByLabel(/^City\b/i).fill('Dublin');
    await page.getByLabel(/Postal Code/i).fill('94568');

    await page.getByRole('checkbox', { name: /I agree to receive/i }).check();
    await page.getByRole('button', { name: /Complete Registration/i }).click();

    // Form redirects to thank-you page on success
    await expect(page).toHaveURL(/\/enroll-academic\/thank-you/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Thank you/i })).toBeVisible();
  });
});
