import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { localePath, E2E_LOCALE } from '../localePath';

/** Hash deep-link opens the modal in production; `next dev` can miss it (Strict Mode + Radix). Fall back to CTA. */
async function openSummerCampGuideModal(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog');
  await page.goto(`${localePath('/camps/summer')}#lead-capture`);
  try {
    await expect(dialog).toBeVisible({ timeout: 4_000 });
  } catch {
    await page.getByRole('button', { name: /Get guide|15%/i }).first().click();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
  }
}

test.describe('Summer camp lottery form (UI)', () => {
  test('submits lottery form and navigates to thank-you page with mocked API', async ({ page }) => {
    await page.route('**/api/summer-camp-lottery', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      const body = route.request().postDataJSON() as {
        parentName?: string;
        email?: string;
        childGrade?: string;
        campInterest?: string;
        locale?: string;
      };
      expect(body.parentName).toBe('E2E Parent');
      expect(body.email).toBe('lottery.e2e@example.com');
      expect(body.childGrade).toBe('5');
      expect(body.campInterest).toBe('academic');
      expect(body.locale).toBe(E2E_LOCALE);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Entry received.' }),
      });
    });

    await openSummerCampGuideModal(page);

    await page.locator('#summer-lead-parent').fill('E2E Parent');
    await page.locator('#summer-lottery-email').fill('lottery.e2e@example.com');
    await page.locator('#summer-lottery-grade').selectOption('5');
    await page.locator('#summer-lottery-interest').selectOption('academic');

    await page.getByRole('button', { name: /Get Guide|15%/i }).click();

    const successPath = localePath('/camps/summer/guide-success').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(page).toHaveURL(new RegExp(`${successPath}(\\?|$)`), {
      timeout: 60_000,
    });
    const thankYou = new URL(page.url());
    expect(thankYou.searchParams.get('interest')).toBe('academic');
    expect(thankYou.searchParams.get('grade')).toBe('5');

    await expect(page.getByRole('heading', { name: /camp guide is on the way/i })).toBeVisible();
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

    await openSummerCampGuideModal(page);

    await page.locator('#summer-lead-parent').fill('E2E Parent');
    await page.locator('#summer-lottery-email').fill('fail@example.com');
    await page.locator('#summer-lottery-grade').selectOption('3');
    await page.locator('#summer-lottery-interest').selectOption('coding');

    await page.getByRole('button', { name: /Get Guide|15%/i }).click();

    // Next.js adds a second role="alert" (route announcer); target the form error only.
    await expect(
      page.locator('#lead-capture p[role="alert"]'),
    ).toContainText(/E2E mocked failure/i, { timeout: 20_000 });
  });
});
