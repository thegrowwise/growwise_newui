import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function SelfCheckCampaignHeader() {
  const cleanPhone = CONTACT_INFO.phone.replace(/[\s()–\-]/g, '');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1F396D]/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" aria-label="GrowWise home" className="flex-shrink-0">
          <Image
            src="/assets/growwise-logo.png"
            alt="GrowWise"
            width={150}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Phone — hidden on small mobile */}
          <a
            href={`tel:${cleanPhone}`}
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1F396D] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#F16112]" aria-hidden />
            {CONTACT_INFO.phone}
          </a>

          <Link
            href="/login"
            className="text-sm font-medium text-[#1F396D] hover:text-[#F16112] transition-colors hidden md:block"
          >
            Student Login
          </Link>

          <Link
            href="/enroll"
            className="text-sm font-bold bg-[#1F396D] hover:bg-[#162d57] text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Enroll
          </Link>
        </div>
      </div>
    </header>
  );
}
