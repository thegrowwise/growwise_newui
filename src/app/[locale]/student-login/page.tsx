'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';

// After installing the WordPress minimal template, update this URL to point to your new page
// Example: 'https://thegrowwise.com/student-login-minimal/'
// See: wordpress-templates/README.md for installation instructions
const STUDENT_LOGIN_MINIMAL_URL = 'https://thegrowwise.com/student-registration/'; // TODO: Update after installing minimal template
const STUDENT_REGISTRATION_URL = 'https://thegrowwise.com/student-registration/';

export default function StudentLoginPage() {
  const locale = useLocale();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [useRedirect, setUseRedirect] = useState(false);

  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  // Check if iframe loads successfully, fallback to redirect if not
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setUseRedirect(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  const handleDirectLogin = () => {
    window.location.href = STUDENT_REGISTRATION_URL;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      <div className="max-w-2xl w-full space-y-8">
        <Card className="shadow-xl">
          <CardContent className="p-0">
            <div className="p-8 pb-4 border-b border-gray-200">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hi, Welcome back!</h1>
                <p className="text-gray-600">Sign in to access your courses</p>
              </div>
            </div>

            {useRedirect ? (
              <div className="p-8">
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription data-slot="alert-description">
                    For the best login experience, please use the direct login page.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleDirectLogin}
                  className="w-full bg-[#1F396D] hover:bg-[#29335C] text-white py-6 text-base font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Login Page
                </Button>
              </div>
            ) : (
              <div className="relative" style={{ minHeight: '600px' }}>
                <iframe
                  src={STUDENT_LOGIN_MINIMAL_URL}
                  className="w-full border-0"
                  style={{ minHeight: '600px', height: '100%' }}
                  onLoad={() => setIframeLoaded(true)}
                  title="Student Login"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                />
                {/* Gradient overlay to blend with card header - remove if using minimal template */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none" />
              </div>
            )}

            <div className="p-8 pt-4 border-t border-gray-200">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      href="https://thegrowwise.com/student-registration/?action=register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F396D] hover:text-[#F16112] font-medium hover:underline"
                    >
                      Register Now
                    </Link>
                  </p>
                </div>
                <div>
                  <Link
                    href={createLocaleUrl('/')}
                    className="text-sm text-gray-600 hover:text-[#1F396D] hover:underline"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

