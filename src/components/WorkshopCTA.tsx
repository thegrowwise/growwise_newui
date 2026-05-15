import React from 'react';
import Link from 'next/link';
import type { AwardTier } from '@/lib/award';

interface WorkshopCTAProps {
  bookingUrl?: string;
  tier?: AwardTier;
}

const CTA_COPY: Record<AwardTier, { headline: string; body: string; button: string }> = {
  double_detective: {
    headline: "You know the gap. Now let's close it.",
    body: "You and your parent already identified the problem. Our workshop teachers will fix it — with a hands-on session and a full personalized plan, at no cost.",
    button: "Reserve Your Workshop Spot →",
  },
  parent_detective: {
    headline: "Your parent saw something you didn't.",
    body: "Bring them to the workshop. Our teachers will show you both exactly what's happening and build a plan to fix it together.",
    button: "Book a Family Workshop Session →",
  },
  self_aware: {
    headline: "You already know. A teacher can fix it in weeks.",
    body: "You identified your own gap — that's rare. Our workshop teachers specialize in exactly this pattern. Come in and let's turn that awareness into action.",
    button: "Start Fixing It →",
  },
  keep_digging: {
    headline: "We found something neither of you expected.",
    body: "That's exactly why this challenge exists. The real gaps are often invisible until a trained teacher looks. Come to our free Workshop Diagnostic — you'll leave with answers.",
    button: "Uncover the Full Picture →",
  },
};

const DEFAULT_COPY = {
  headline: "Ready to Fix These Gaps for Good?",
  body: "Join our in-person Workshop Diagnostic. Our teachers go deeper and hand you a full personalized plan — at no cost.",
  button: "Reserve Your Free Workshop Spot →",
};

export default function WorkshopCTA({
  bookingUrl,
  tier,
}: WorkshopCTAProps) {
  const url = bookingUrl
    ?? process.env.NEXT_PUBLIC_WORKSHOP_BOOKING_URL
    ?? process.env.NEXT_PUBLIC_WORKSHOP_CALENDLY_URL
    ?? '/contact';
  const copy = tier ? CTA_COPY[tier] : DEFAULT_COPY;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#1F396D] to-[#29335C] p-8 text-white text-center space-y-4 shadow-lg">
      <h2 className="text-2xl font-bold">{copy.headline}</h2>
      <p className="text-white/75 max-w-md mx-auto leading-relaxed">{copy.body}</p>
      <Link
        href={url}
        target={url.startsWith('http') ? '_blank' : undefined}
        rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="inline-block rounded-lg bg-[#F16112] hover:bg-[#d54f0a] px-8 py-3 font-semibold text-white transition-colors"
      >
        {copy.button}
      </Link>
      <p className="text-xs text-white/50">Free · No obligation · Dublin, CA</p>
    </section>
  );
}
