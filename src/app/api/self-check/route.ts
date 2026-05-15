import { NextResponse } from 'next/server';
import { clip, exceedsMax, FIELD_MAX, isValidEmailShape } from '@/lib/inputLimits';
import { honeypotTriggered, isOriginAllowed } from '@/lib/requestGuard';
import { clientIpFrom, isAllowed } from '@/lib/chatRateLimit';

export const maxDuration = 30;

const MAX_BODY_BYTES = 8 * 1024;
const VALID_SUBJECTS = new Set(['math', 'english', 'both']);
const VALID_PREDICTIONS = new Set([
  'place_value', 'fractions', 'operations', 'integers',
  'algebra', 'word_problems', 'not_sure',
]);

function normaliseParentPrediction(raw: unknown): string[] | null {
  if (Array.isArray(raw)) {
    const vals = raw.map((v) => (typeof v === 'string' ? v.trim().toLowerCase() : '')).filter(Boolean);
    if (vals.length === 0) return null;
    if (vals.some((v) => !VALID_PREDICTIONS.has(v))) return null;
    return vals;
  }
  if (typeof raw === 'string') {
    const v = raw.trim().toLowerCase();
    return VALID_PREDICTIONS.has(v) ? [v] : null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    if (!isAllowed('enroll', clientIpFrom(request))) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      );
    }

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

    const parentName = clip(body.parentName, FIELD_MAX.name);
    const parentEmail = clip(body.parentEmail, FIELD_MAX.email).toLowerCase();
    const studentName = clip(body.studentName, FIELD_MAX.name);
    const gradeRaw = clip(body.grade, FIELD_MAX.shortText);
    const subject = clip(body.subject, FIELD_MAX.shortText).toLowerCase();
    const parentPrediction = normaliseParentPrediction(body.parentPrediction);

    if (!parentName || !parentEmail || !studentName || !gradeRaw || !subject || !parentPrediction) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!isValidEmailShape(parentEmail)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const grade = parseInt(gradeRaw, 10);
    if (isNaN(grade) || grade < 2 || grade > 12) {
      return NextResponse.json({ success: false, error: 'Grade must be between 2 and 12.' }, { status: 400 });
    }

    if (!VALID_SUBJECTS.has(subject)) {
      return NextResponse.json({ success: false, error: 'Subject must be math, english, or both.' }, { status: 400 });
    }

    // Grades 5–8 are not yet available — course IDs pending
    const AVAILABLE_GRADES = new Set([3, 4]);
    if (!AVAILABLE_GRADES.has(grade)) {
      return NextResponse.json(
        { success: false, error: 'grade_unavailable' },
        { status: 422 },
      );
    }

    if (
      exceedsMax(parentName, FIELD_MAX.name) ||
      exceedsMax(studentName, FIELD_MAX.name)
    ) {
      return NextResponse.json({ success: false, error: 'One or more fields are too long.' }, { status: 400 });
    }

    const sessionToken = crypto.randomUUID();

    const wpUrl = process.env.GROWWISE_WP_API_URL;
    const wpSecret = process.env.GROWWISE_WP_SECRET;

    if (!wpUrl || !wpSecret) {
      console.error('[self-check] WordPress env vars not configured');
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    const wpRes = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GrowWise-Secret': wpSecret,
      },
      body: JSON.stringify({
        parent_name: parentName,
        parent_email: parentEmail,
        student_name: studentName,
        grade,
        subject,
        session_token: sessionToken,
        parent_prediction: JSON.stringify(parentPrediction),
      }),
    });

    if (!wpRes.ok) {
      const errText = await wpRes.text().catch(() => '');
      console.error('[self-check] WordPress enroll failed', wpRes.status, errText);
      return NextResponse.json(
        { success: false, error: 'Could not set up the quiz. Please try again.' },
        { status: 502 },
      );
    }

    const wpData = await wpRes.json() as { success?: boolean; login_url?: string };

    if (!wpData.success || !wpData.login_url) {
      console.error('[self-check] WordPress returned unexpected payload', wpData);
      return NextResponse.json(
        { success: false, error: 'Could not set up the quiz. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, redirectUrl: wpData.login_url });
  } catch (error) {
    console.error('[self-check] POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
