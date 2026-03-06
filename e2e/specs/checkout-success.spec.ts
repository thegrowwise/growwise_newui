import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Checkout success page', () => {
  test('displays payment success and clears cart with mocked session', async ({ page }) => {
    await page.route('**/api/payment/session/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: {
            id: 'cs_test_123',
            payment_status: 'paid',
            amount_total: 10000,
            currency: 'usd',
            customer_email: 'buyer@example.com',
          },
        }),
      });
    });

    // Seed cart to verify it gets cleared
    await page.goto(`/${LOCALE}`);
    await page.evaluate(() => {
      const cartState = {
        items: [
          { id: 'test-course', name: 'Test Course', price: 100, quantity: 1 },
        ],
        total: 100,
        itemCount: 1,
      };
      window.localStorage.setItem('growwise_cart', JSON.stringify(cartState));
    });

    // Visit success page with session_id in query
    await page.goto(`/${LOCALE}/checkout/success?session_id=cs_test_123`);

    // Success heading
    await expect(
      page.getByRole('heading', { name: /Payment Successful!/i }),
    ).toBeVisible({ timeout: 15000 });

    // Cart should be cleared
    const cartStorage = await page.evaluate(() =>
      window.localStorage.getItem('growwise_cart'),
    );
    expect(cartStorage).toBeNull();
  });
});

