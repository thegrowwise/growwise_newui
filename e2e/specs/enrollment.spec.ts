import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Enrollment form', () => {
  test('submits general enrollment successfully with mocked backend', async ({ page }) => {
    await page.route('**/api/enroll', async (route) => {
      const body = await route.request().postDataJSON();
      expect(body.fullName).toContain('Test');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(`/${LOCALE}/enroll`);

    await page.getByLabel(/Your Full Name/i).fill('Test Parent');
    await page.getByLabel(/^Email\b/i).fill('test@example.com');
    await page.getByLabel(/Mobile phone number/i).fill('5551234567');
    await page.getByLabel(/^City\b/i).fill('Test City');
    await page.getByLabel(/Postal code/i).fill('12345');

    // Choose Academic program
    await page.getByRole('button', { name: /Academic\b/i }).click();

    // Select course and level
    await page.getByLabel(/^Course\b/i).click();
    await page.getByRole('option', { name: /Math Courses/i }).click();

    await page.getByLabel(/^Level\b/i).click();
    await page.getByRole('option', { name: /Elementary/i }).click();

    await page.getByRole('checkbox', { name: /I agree to receive/i }).check();

    await page.getByRole('button', { name: /Register for Assessment/i }).click();

    // Assert success banner heading is visible
    await expect(
      page.getByRole('heading', { name: /Enrollment Successful!/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});

