import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Enroll Phase 3 stepper', () => {
  test('enforces step order and back navigation', async ({ page, browser }) => {
    await page.goto(
      `/${LOCALE}/enroll?program=python&tier=plus&mode=live&addons=uuid1,uuid2&children=1`,
    );

    await expect(page.getByText('Review').first()).toBeVisible();
    await expect(page.getByText('Your details').first()).toBeVisible();
    await expect(page.getByText('Payment').first()).toBeVisible();

    await expect(page.getByTestId('enroll-step-circle-1')).toHaveAttribute('class', /bg-\[#F16112\]/);
    await expect(page.getByTestId('enroll-step-circle-2')).toHaveAttribute('class', /border-gray-300/);
    await expect(page.getByTestId('enroll-step-circle-3')).toHaveAttribute('class', /border-gray-300/);

    await page.getByTestId('enroll-step-next').click();
    await expect(page.getByTestId('enroll-step-circle-2')).toHaveAttribute('class', /bg-\[#F16112\]/);
    await expect(page.getByTestId('enroll-step-circle-1')).toHaveAttribute('class', /bg-green-600/);

    await page.getByTestId('enroll-step-back').click();
    await expect(page.getByTestId('enroll-step-circle-1')).toHaveAttribute('class', /bg-\[#F16112\]/);

    // Go to step 2
    await page.getByTestId('enroll-step-next').click();

    // Wait for the ChildStep heading so we know step 2 is rendered
    await expect(page.getByRole('heading', { name: /Your details/i })).toBeVisible();

    // Fill required fields on step 2 so we can continue to payment
    await page.getByLabel(/Parent name/i).fill('Parent Test');
    await page.getByLabel(/Parent email/i).fill('parent.e2e@example.com');
    await page.getByLabel(/Child name/i).fill('Child Test');
    await page.getByLabel(/Child age/i).fill('12');

    await page.getByTestId('enroll-child-continue').click();
    await expect(page.getByTestId('enroll-step-circle-3')).toHaveAttribute('class', /bg-\[#F16112\]/);
    await expect(page.getByTestId('enroll-step-circle-2')).toHaveAttribute('class', /bg-green-600/);

    // Back on step 3 returns to step 2
    await page.getByTestId('enroll-step-back').click();
    await expect(page.getByTestId('enroll-step-circle-2')).toHaveAttribute('class', /bg-\[#F16112\]/);

    // Cannot skip directly to step 3 without completing step 2
    const context = await browser.newContext();
    const p = await context.newPage();
    await p.goto(
      `/${LOCALE}/enroll?program=python&tier=plus&mode=live&addons=uuid1,uuid2&children=1&step=3`,
    );

    await expect(p.getByTestId('enroll-step-circle-1')).toHaveAttribute('class', /bg-green-600/);
    await expect(p.getByTestId('enroll-step-circle-2')).toHaveAttribute('class', /bg-\[#F16112\]/);
    await expect(p.getByTestId('enroll-step-circle-3')).toHaveAttribute('class', /border-gray-300/);
    await context.close();
  });
});

