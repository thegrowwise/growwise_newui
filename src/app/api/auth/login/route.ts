import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clip, FIELD_MAX, isValidEmailShape } from '@/lib/inputLimits';
import { honeypotTriggered, isOriginAllowed } from '@/lib/requestGuard';

export const maxDuration = 30;

const WP_JWT_URL = 'https://learn.thegrowwise.com/wp-json/jwt-auth/v1/token';
const COOKIE_NAME = 'gw_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_BODY_BYTES = 4 * 1024;

interface WpJwtSuccess {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface WpJwtError {
  code: string;
  message: string;
}

export async function POST(request: Request) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (honeypotTriggered(body)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  const email = clip(body.email, FIELD_MAX.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';

  if (!email || !isValidEmailShape(email)) {
    return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
  }

  let wpRes: Response;
  try {
    wpRes = await fetch(WP_JWT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Could not reach the login server. Please try again.' },
      { status: 502 },
    );
  }

  const wpData = await wpRes.json() as WpJwtSuccess | WpJwtError;

  if (!wpRes.ok || !('token' in wpData)) {
    // Map WP error codes to friendly messages — never expose raw WP messages
    return NextResponse.json(
      { success: false, error: 'Incorrect email or password.' },
      { status: 401 },
    );
  }

  const { token, user_email, user_display_name } = wpData as WpJwtSuccess;

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });

  return NextResponse.json({
    success: true,
    user: { email: user_email, displayName: user_display_name },
  });
}
