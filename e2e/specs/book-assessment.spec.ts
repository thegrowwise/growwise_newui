import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

/** Click a Radix SelectTrigger reliably — scroll it into view first to avoid sticky-header interception. */
async function clickTrigger(page: import('@playwright/test').Page, testId: string) {
  const trigger = page.getByTestId(testId);
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click({ force: true });
}

test.describe('Book assessment form', () => {
  test('submits free assessment booking with mocked backend', async ({ page }) => {
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

    await page.goto(localePath('/book-assessment'));

    await page.getByLabel(/Parent Name/i).fill('Parent Name');
    await page.getByLabel(/Email Address/i).fill('parent@example.com');
    await page.getByLabel(/Phone Number/i).fill('5551234567');

    // WebKit can reset controlled inputs before hydration settles
    const studentName = page.getByLabel(/Student Name/i);
    for (let i = 0; i < 3; i++) {
      await studentName.fill('Student Name');
      if (await studentName.inputValue() === 'Student Name') break;
    }
    await expect(studentName).toHaveValue('Student Name');

    await clickTrigger(page, 'assessment-grade-trigger');
    await page.getByRole('option', { name: /^Grade 5$/i }).click();

    await clickTrigger(page, 'assessment-type-trigger');
    await page.getByRole('option', { name: /Math Skills Assessment/i }).click();

    await page.getByTestId('assessment-mode-online').click({ force: true });
    await page.getByTestId('assessment-mode-in-person').click({ force: true });

    await clickTrigger(page, 'assessment-schedule-day-trigger');
    await page.getByRole('option', { name: /Monday.*Friday/i }).click();

    await clickTrigger(page, 'assessment-schedule-time-trigger');
    await page.getByRole('option', { name: /3:00.*7:00.*pm/i }).click();

    await clickTrigger(page, 'hear-about-trigger');
    await page.getByRole('option', { name: /Google/i }).click();

    const submitBtn = page.getByTestId('assessment-submit');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.evaluate((btn) => {
      (btn as HTMLButtonElement).form?.requestSubmit(btn as HTMLButtonElement);
    });

    await page.waitForResponse(
      (r) => r.url().includes('/api/assessment') && r.request().method() === 'POST',
      { timeout: 20000 },
    );

    const successPath = localePath('/book-assessment/thank-you');
    await expect(page).toHaveURL(
      new RegExp(`${successPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\?.*)?$`),
      { timeout: 20000 },
    );
    await expect(page.getByTestId('form-thank-you')).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { level: 1, name: /thank you for your request/i })).toBeVisible();
  });
});
