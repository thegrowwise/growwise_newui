import type { CartItem } from '@/components/gw/CartContext';

/**
 * One-dollar line item for Stripe test-mode flows (success URL, purchase event, etc.).
 * Enable on the cart page with `NEXT_PUBLIC_ENABLE_TEST_CHECKOUT=true`.
 */
export const TEST_CHECKOUT_1USD_ITEM: CartItem = {
  id: 'gw-test-checkout-1usd',
  name: 'Test payment ($1)',
  price: 1,
  quantity: 1,
  category: 'Stripe test',
};
