import React from 'react';
import type { AwardTier } from '@/lib/award';

const AWARDS: Record<AwardTier, {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
}> = {
  double_detective: {
    emoji: '🥇',
    title: 'Double Detective',
    subtitle: 'Both you and your parent saw it coming.',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FCD34D',
  },
  parent_detective: {
    emoji: '👁️',
    title: 'Parent Detective',
    subtitle: 'Your parent spotted it before you did.',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#93C5FD',
  },
  self_aware: {
    emoji: '🧠',
    title: 'Self-Aware Student',
    subtitle: "You knew it. Your parent didn't.",
    color: '#166534',
    bg: '#F0FDF4',
    border: '#86EFAC',
  },
  keep_digging: {
    emoji: '🔎',
    title: 'Keep Digging',
    subtitle: "Neither of you predicted this. That's exactly what the challenge is for.",
    color: '#9A3412',
    bg: '#FFF7ED',
    border: '#FDBA74',
  },
};

interface AwardBadgeProps {
  tier: AwardTier;
}

export default function AwardBadge({ tier }: AwardBadgeProps) {
  const award = AWARDS[tier];
  return (
    <div
      className="rounded-2xl border-2 p-6 text-center space-y-2"
      style={{ backgroundColor: award.bg, borderColor: award.border }}
    >
      <div className="text-5xl">{award.emoji}</div>
      <h3 className="text-lg font-bold" style={{ color: award.color }}>{award.title}</h3>
      <p className="text-sm" style={{ color: award.color }}>{award.subtitle}</p>
    </div>
  );
}
