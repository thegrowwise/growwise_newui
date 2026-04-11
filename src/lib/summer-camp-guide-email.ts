/**
 * Summer camp guide follow-up email — UTM tracking + recommendation line
 * (spec: Coding → Game Dev / AI Coding; Math → Math & Olympiad; Robotics → Robotics; else AI & Coding).
 */

export const SUMMER_CAMP_EMAIL_UTM = {
  source: 'email',
  medium: 'email',
  campaign: 'summer_camp_guide',
} as const;

export type UtmContent = 'pdf_click' | 'reserve_click' | 'email_open';

export function appendEmailUtm(
  absoluteUrl: string,
  content: UtmContent,
  extra?: Record<string, string>
): string {
  let u: URL;
  try {
    u = new URL(absoluteUrl);
  } catch {
    return absoluteUrl;
  }
  u.searchParams.set('utm_source', SUMMER_CAMP_EMAIL_UTM.source);
  u.searchParams.set('utm_medium', SUMMER_CAMP_EMAIL_UTM.medium);
  u.searchParams.set('utm_campaign', SUMMER_CAMP_EMAIL_UTM.campaign);
  u.searchParams.set('utm_content', content);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) u.searchParams.set(k, v);
    }
  }
  return u.toString();
}

/** Short track name for "We recommend starting with our ___ track." (HTML fragment, escaped). */
export function recommendedProgramTrackHtml(interestKey: string): string {
  switch (interestKey) {
    case 'coding':
      return 'Game Development or AI Coding';
    case 'math_olympiad':
      return 'Math &amp; Olympiad';
    case 'robotics':
      return 'Robotics';
    default:
      return 'AI &amp; Coding';
  }
}

export function recommendedProgramTrackText(interestKey: string): string {
  switch (interestKey) {
    case 'coding':
      return 'Game Development or AI Coding';
    case 'math_olympiad':
      return 'Math & Olympiad';
    case 'robotics':
      return 'Robotics';
    default:
      return 'AI & Coding';
  }
}

export function buildCampGuidePdfUrl(siteUrl: string): string {
  const base = `${siteUrl.replace(/\/$/, '')}/assets/camps/SummerCampBrochure.pdf`;
  return appendEmailUtm(base, 'pdf_click');
}

/** Booking section on summer camp page. */
export function buildReserveSpotUrl(siteUrl: string, localeSeg: string): string {
  const u = new URL(`${siteUrl.replace(/\/$/, '')}/${localeSeg}/camps/summer`);
  u.searchParams.set('utm_source', SUMMER_CAMP_EMAIL_UTM.source);
  u.searchParams.set('utm_medium', SUMMER_CAMP_EMAIL_UTM.medium);
  u.searchParams.set('utm_campaign', SUMMER_CAMP_EMAIL_UTM.campaign);
  u.searchParams.set('utm_content', 'reserve_click');
  u.hash = 'slots-section';
  return u.toString();
}

export function buildEmailOpenPixelUrl(siteUrl: string): string {
  const base = `${siteUrl.replace(/\/$/, '')}/api/email/track/open`;
  return appendEmailUtm(base, 'email_open');
}
