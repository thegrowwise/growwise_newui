import { NextResponse } from 'next/server';
import { clip, FIELD_MAX } from '@/lib/inputLimits';
import { isOriginAllowed } from '@/lib/requestGuard';

export const maxDuration = 15;

const VALID_PREDICTIONS = new Set([
  'place_value', 'fractions', 'operations', 'integers',
  'algebra', 'word_problems', 'not_sure',
]);

export async function POST(request: Request) {
  try {
    if (!isOriginAllowed(request)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 403 });
    }

    const raw = await request.text();
    if (raw.length > 2 * 1024) {
      return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const sessionToken = clip(body.session_token, FIELD_MAX.shortText);
    const studentPrediction = clip(body.student_prediction, FIELD_MAX.shortText).toLowerCase();

    if (!sessionToken || !studentPrediction) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!VALID_PREDICTIONS.has(studentPrediction)) {
      return NextResponse.json({ success: false, error: 'Invalid prediction value.' }, { status: 400 });
    }

    const wpUrl = process.env.GROWWISE_WP_SAVE_PREDICTION_URL;
    const wpSecret = process.env.GROWWISE_WP_SECRET;

    if (!wpUrl || !wpSecret) {
      console.error('[save-prediction] WordPress env vars not configured');
      return NextResponse.json({ success: false, error: 'Service temporarily unavailable.' }, { status: 503 });
    }

    const wpRes = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GrowWise-Secret': wpSecret,
      },
      body: JSON.stringify({
        session_token: sessionToken,
        student_prediction: studentPrediction,
      }),
    });

    if (!wpRes.ok) {
      const errText = await wpRes.text().catch(() => '');
      console.error('[save-prediction] WordPress failed', wpRes.status, errText);
      return NextResponse.json({ success: false, error: 'Could not save prediction.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[save-prediction] POST failed:', error);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
