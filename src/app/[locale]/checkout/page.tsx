'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/components/gw/CartContext';
import { createCheckoutSession } from '@/lib/paymentService';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CheckoutPage: React.FC = () => {
  const { state } = useCart();
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (state.items.length === 0) {
      router.push(createLocaleUrl('/cart'));
    }
  }, [state.items.length, locale, router]);

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Prevent multiple clicks/submissions
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createCheckoutSession({
        items: state.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: `${item.category || 'Course'}${item.level ? ` - ${item.level}` : ''}`,
          category: item.category,
          level: item.level,
          image: item.image,
        })),
        locale: locale,
      });

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      let errorMessage = 'Failed to initiate checkout. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Check if it's a network error
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={createLocaleUrl('/cart')}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and proceed to secure payment</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between pb-4 border-b last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.category && <span>{item.category}</span>}
                          {item.level && <span> • {item.level}</span>}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Processing Fee (3.5%)</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t">
                    <span>Total</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Secure payment powered by Stripe</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>You will be redirected to Stripe's secure checkout page to complete your payment.</p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading || state.items.length === 0}
                  className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white py-3 mb-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>Your payment information is encrypted and secure.</p>
                  <p className="mt-1">We never store your card details.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


