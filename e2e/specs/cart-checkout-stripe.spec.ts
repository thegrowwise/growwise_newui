import { test, expect } from '@playwright/test';

const LOCALE = process.env.E2E_LOCALE || 'en';

test.describe('Cart, checkout, and Stripe test checkout', () => {
  test('go to checkout from pre-filled cart and redirect to Stripe test page', async ({ page, context }) => {
    // Seed cart in localStorage before visiting cart page
    await page.goto(`/${LOCALE}`);
    await page.evaluate(() => {
      const cartState = {
        items: [
          {
            id: 'test-course',
            name: 'Test Course',
            price: 100,
            quantity: 1,
          },
        ],
        total: 100,
        itemCount: 1,
      };
      window.localStorage.setItem('growwise_cart', JSON.stringify(cartState));
    });

    // Go directly to cart; CartContext will hydrate from localStorage
    await page.goto(`/${LOCALE}/cart`);
    await expect(page.getByText(/Shopping Cart/i)).toBeVisible();

    // Proceed to checkout
    const proceedToCheckout = page.getByRole('link', {
      name: /Proceed to Checkout/i,
    });
    await proceedToCheckout.click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/checkout`));

    // Intercept create-checkout-session and return a Stripe test checkout URL
    let checkoutRequestSeen = false;
    await page.route('**/api/payment/create-checkout-session', async (route) => {
      checkoutRequestSeen = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'cs_test_123',
          url: 'https://checkout.stripe.com/pay/cs_test_123',
        }),
      });
    });

    // When clicking \"Proceed to Payment\", app should redirect to Stripe test checkout (same tab)
    await page.getByRole('button', { name: /Proceed to Payment/i }).click();

    // Assert that we were redirected to Stripe test checkout (URL from our mocked response)
    await expect(page).toHaveURL('https://checkout.stripe.com/pay/cs_test_123');

    // Note: Completing the payment flow (filling 4242… test card) can be added later
    // once the Stripe test account and form layout are fully stable.

    expect(checkoutRequestSeen).toBeTruthy();
  });
});

