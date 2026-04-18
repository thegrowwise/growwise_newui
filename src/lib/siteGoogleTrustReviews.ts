import enMessages from '@/i18n/messages/en.json';
import type { TestimonialVM } from '@/lib/testimonialsApi'; // type-only: avoids runtime cycle with testimonialsApi

/** Same `quote` / `byline` pairs as the summer camp trust block (`en.json` → `summerCamp.conversion.trustReviews`). */
export type SiteGoogleTrustReview = {
  quote: string;
  byline: string;
};

const raw = enMessages.summerCamp.conversion.trustReviews as readonly SiteGoogleTrustReview[];

export const SITE_GOOGLE_TRUST_REVIEWS: readonly SiteGoogleTrustReview[] = raw;

/**
 * Parses bylines like "— Parent · 5★ Google review" or "— Roger Jiang · Google review".
 */
export function parseGoogleTrustByline(byline: string): { name: string; role: string } {
  const cleaned = byline.replace(/^\s*[—–-]\s*/, '').trim();
  const parts = cleaned.split(/\s*·\s*/);
  if (parts.length >= 2) {
    return {
      name: parts[0].trim(),
      role: parts.slice(1).join(' · ').trim(),
    };
  }
  return { name: cleaned || 'GrowWise family', role: 'Google review' };
}

/** Lightweight cards for inline page sections (no photos). */
export function siteGoogleTrustReviewCards(): Array<{
  name: string;
  role: string;
  content: string;
  rating: number;
}> {
  return raw.map((r) => {
    const { name, role } = parseGoogleTrustByline(r.byline);
    return { name, role, content: r.quote, rating: 5 };
  });
}

/** Shape used by the testimonials API fallback and home/about-style carousels. */
export function siteGoogleTrustReviewsAsTestimonialVMs(): TestimonialVM[] {
  return raw.map((r) => {
    const { name, role } = parseGoogleTrustByline(r.byline);
    return {
      name,
      role,
      content: r.quote,
      rating: 5,
      image: null,
      hasPhoto: false,
    };
  });
}
