import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Book assessment form', () => {
  test('submits free assessment booking with mocked backend', async ({ page }) => {
    // NOTE: Currently flaky due to sticky header intercepting clicks on the Radix Select trigger.
    // Once we add a stable test id or adjust layout, remove this skip.
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (req.url().includes('/api/assessment') && req.method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`/${LOCALE}/book-assessment`);

    // Required fields
    await page.getByLabel(/Parent Name/i).fill('Parent Name');
    await page.getByLabel(/Email Address/i).fill('parent@example.com');

    // Phone uses CountryCodeSelector + input with id="phone"
    await page.getByLabel(/Phone Number/i).fill('5551234567');

    await page.getByLabel(/Student Name/i).fill('Student Name');

    // Grade select
    await page.getByTestId('assessment-grade-trigger').click();
    await page.getByRole('option', { name: /^Grade 5$/i }).click();

    // Assessment type
    await page.getByTestId('assessment-type-trigger').click();
    await page.getByRole('option', { name: /Math Skills Assessment/i }).click();

    // Mode
    await page.getByTestId('assessment-mode-online').click();

    // Schedule
    await page.getByTestId('assessment-schedule-trigger').click();
    await page
      .getByRole('option', { name: /Weekdays After School/i })
      .click();

    // Submit form (consent defaults to checked on this page)
    const submitBtn = page.getByTestId('assessment-submit');
    await expect(submitBtn).toBeEnabled({ timeout: 8000 });
    await submitBtn.click();

    // Success view (page resets form after 5s, so assert promptly)
    await expect(
      page.getByTestId('assessment-success'),
    ).toBeVisible({ timeout: 12000 });
    await expect(
      page.getByText(/free assessment booking request/i),
    ).toBeVisible();
  });
});

