import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Summer camp lottery form (UI)', () => {
  test('submits lottery form and navigates to thank-you page with mocked API', async ({ page }) => {
    await page.route('**/api/summer-camp-lottery', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      const body = route.request().postDataJSON() as {
        email?: string;
        childGrade?: string;
        campInterest?: string;
        locale?: string;
      };
      expect(body.email).toBe('lottery.e2e@example.com');
      expect(body.childGrade).toBe('5');
      expect(body.campInterest).toBe('academic');
      expect(body.locale).toBe(LOCALE);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Entry received.' }),
      });
    });

    await page.goto(`/${LOCALE}/camps/summer#lottery`);

    await page.locator('#summer-lottery-email').fill('lottery.e2e@example.com');
    await page.locator('#summer-lottery-interest').selectOption('academic');
    await page.locator('#summer-lottery-grade').selectOption('5');

    await page.getByRole('button', { name: /Enter lottery/i }).click();

    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/camps/summer/lottery-success`), {
      timeout: 15_000,
    });
    const thankYou = new URL(page.url());
    expect(thankYou.searchParams.get('interest')).toBe('academic');
    expect(thankYou.searchParams.get('grade')).toBe('5');

    await expect(page.getByRole('status')).toContainText(/entered/i);
    await expect(page.getByRole('link', { name: /Back to Summer Camp/i })).toBeVisible();
  });

  test('shows API error message when lottery endpoint returns 500 JSON', async ({ page }) => {
    await page.route('**/api/summer-camp-lottery', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'E2E mocked failure',
        }),
      });
    });

    await page.goto(`/${LOCALE}/camps/summer#lottery`);

    await page.locator('#summer-lottery-email').fill('fail@example.com');
    await page.locator('#summer-lottery-interest').selectOption('coding');
    await page.locator('#summer-lottery-grade').selectOption('3');

    await page.getByRole('button', { name: /Enter lottery/i }).click();

    // Next.js adds a second role="alert" (route announcer); target the form error only.
    await expect(
      page.locator('#lottery p[role="alert"]'),
    ).toContainText('E2E mocked failure', { timeout: 10_000 });
  });
});
