import { test, expect } from '@playwright/test';
import { localePath } from '../localePath';

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

    await page.goto(localePath('/contact'));

    const fillStable = async (re: RegExp, value: string) => {
      const loc = page.getByLabel(re);
      for (let i = 0; i < 3; i++) {
        await loc.fill(value);
        const v = await loc.inputValue();
        if (v === value) break;
      }
      await expect(loc).toHaveValue(value);
    };

    // Fill required fields
    await fillStable(/First Name/i, 'First');
    await fillStable(/Last Name/i, 'Last');
    await fillStable(/Email Address/i, 'first.last@example.com');
    await fillStable(/Phone Number/i, '5551234567');
    await fillStable(/^Subject \*/i, 'Free Assessment Request');
    await fillStable(/^Message \*/i, 'I would like more information about programs.');

    // Radix Checkbox: use role + check() so state updates (label click alone can leave submit disabled)
    await page.getByRole('checkbox', { name: /I agree to receive/i }).check();

    // Submit
    await page.getByRole('button', { name: /Send|submit/i }).click();

    // Success view shows "Send Another Message" button
    await expect(
      page.getByRole('button', { name: /Send Another Message/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});

