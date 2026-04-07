'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getCheckoutSession, sendPaymentReceiptEmail } from '@/lib/paymentService';
import { useCart } from '@/components/gw/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, Home, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { publicPath } from '@/lib/publicPath';

const CheckoutSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const receiptRequestedRef = useRef(false);
  const purchaseFiredRef = useRef(false);

  const sessionId = searchParams.get('session_id');
  const createLocaleUrl = (path: string) => publicPath(path, locale);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched || !sessionId) {
      if (!sessionId) {
        console.error('No session ID found in URL');
        setError('No session ID found');
        setLoading(false);
      }
      return;
    }

    console.log('Fetching checkout session:', sessionId);
    setHasFetched(true);

    const fetchSession = async () => {
      try {
        let data: any;
        try {
          data = await getCheckoutSession(sessionId);
        } catch (err) {
          // Retry once to reduce missed conversions from transient network/backend failures.
          await new Promise((r) => setTimeout(r, 750));
          data = await getCheckoutSession(sessionId);
        }
        console.log('Session data received:', data);
        setSession(data.session);
        
        // Clear cart on successful payment
        if (data.session.payment_status === 'paid') {
          console.log('Payment successful, clearing cart');
          clearCart();

          if (sessionId && !receiptRequestedRef.current) {
            receiptRequestedRef.current = true;
            void sendPaymentReceiptEmail(sessionId).catch(() => {
              /* logged in paymentService */
            });
          }

          // GTM / Google Ads — fire once per successful session fetch (effect is guarded by hasFetched)
          const cents = data.session.amount_total;
          const value =
            typeof cents === 'number' && Number.isFinite(cents)
              ? parseFloat((cents / 100).toFixed(2))
              : 0;
          const transactionId = data.session.id ?? sessionId;
          if (transactionId && !purchaseFiredRef.current) {
            purchaseFiredRef.current = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: 'purchase',
              value,
              currency: (typeof data.session.currency === 'string'
                ? data.session.currency
                : 'usd'
              ).toUpperCase(),
              transaction_id: transactionId,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        // Do not assume success for conversion tracking unless we can confirm a paid session.
        setError('Unable to verify payment. Please refresh this page in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Removed clearCart from dependencies to prevent infinite loop

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#F16112] mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center px-4" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href={createLocaleUrl('/cart')}>
              <Button variant="outline">Back to Cart</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have a session ID but no session data, assume payment was successful
  // (session fetch might have failed, but we're on the success page)
  const isPaid = session?.payment_status === 'paid' || (sessionId && !error);
  const amountTotal = session?.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
  const customerEmail = session?.customer_email || session?.customer_details?.email;

  return (
    <div className="min-h-screen bg-[#ebebeb] py-12 px-4" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            {isPaid ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for your purchase. Your payment has been processed successfully.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Order ID:</div>
                      <div className="font-medium text-gray-900 break-all">
                        {session?.id || sessionId}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Amount Paid:</div>
                      <div className="font-medium text-gray-900">
                        ${amountTotal}
                      </div>
                    </div>
                    {customerEmail && (
                      <div>
                        <div className="text-gray-600 mb-1">Email:</div>
                        <div className="font-medium text-gray-900 break-all">
                          {customerEmail}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-600 mb-1">Payment Status:</div>
                      <div className="font-medium text-green-600 capitalize">
                        {session?.payment_status ?? 'paid'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    A confirmation email has been sent to {customerEmail || 'your email address'}.
                  </p>
                  <p className="text-gray-600">
                    You will receive access to your course materials shortly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                  <Link href={createLocaleUrl('/')}>
                    <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link href={createLocaleUrl('/courses/math')}>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Browse More Courses
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for your purchase. Your payment has been processed successfully.
                </p>
                {sessionId && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Session ID:</div>
                        <div className="font-medium text-gray-900 break-all">
                          {sessionId}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Status:</div>
                        <div className="font-medium text-yellow-600">
                          Processing
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-gray-600 mb-4">
                  We're verifying your payment. You'll receive a confirmation email shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                  <Link href={createLocaleUrl('/')}>
                    <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CheckoutSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#F16112] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;

