import { NextResponse } from 'next/server';

/** 1×1 transparent GIF — for optional email open tracking pixel. */
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

/**
 * GET /api/email/track/open?... — logs UTM-style params server-side.
 * Pair with <img> in transactional HTML; many clients block images.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  if (process.env.NODE_ENV === 'development' || params.utm_campaign) {
    console.log('[email.track.open]', params);
  }
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
