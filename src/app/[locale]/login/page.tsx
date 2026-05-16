import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import LoginFormClient from '@/components/LoginFormClient';

export const metadata: Metadata = {
  title: 'Student Login | GrowWise School',
  description: 'Sign in to your GrowWise student account to access your enrolled courses.',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already authenticated — skip the login page
  const jar = await cookies();
  if (jar.has('gw_token')) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white flex flex-col">
      {/* Slim header */}
      <header className="border-b border-[#1F396D]/10 bg-white/80 backdrop-blur-sm">
        <div className="max-w-sm mx-auto px-4 h-14 flex items-center justify-center">
          <Link href="/" aria-label="GrowWise home">
            <Image
              src="/assets/growwise-logo.png"
              alt="GrowWise"
              width={140}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Icon + heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F396D]/10 mb-1">
              <GraduationCap className="w-6 h-6 text-[#1F396D]" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-[#1F396D]">Student Login</h1>
            <p className="text-sm text-gray-500">
              Sign in to access your enrolled courses
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(31,57,109,0.15)] ring-1 ring-[#1F396D]/10 p-6">
            <LoginFormClient />
          </div>

          {/* Footer links */}
          <div className="text-center space-y-2 text-xs text-gray-500">
            <p>
              Not enrolled yet?{' '}
              <Link href="/enroll" className="text-[#1F396D] font-semibold hover:text-[#F16112] transition-colors">
                Enroll now
              </Link>
            </p>
            <p>
              <Link href="/" className="hover:text-[#1F396D] transition-colors">
                ← Back to GrowWise
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
