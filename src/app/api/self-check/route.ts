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

    const AVAILABLE_GRADES = new Set([3, 4, 5, 6, 7, 8]);
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

    const adminEmail = process.env.GROWWISE_ADMIN_EMAIL || 'connect@thegrowwise.com';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const emailSubject = 'Your Mistake Detective Quiz Link';
    const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f5f5f5;margin:0;padding:20px">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);overflow:hidden">
        <div style="background:linear-gradient(135deg, #1F396D 0%, #2d5a8f 100%);padding:2rem;text-align:center;color:#fff">
            <h1 style="margin:0;font-size:1.8rem">Mistake Detective Challenge</h1>
            <p style="margin:0.5rem 0 0;opacity:0.95">Time to find the gaps</p>
        </div>

        <div style="padding:2rem">
            <p>Hi ${studentName}'s parent,</p>
            <p>Your child's Mistake Detective quiz is ready! Click the button below to start the 8-question challenge.</p>

            <div style="text-align:center;margin:2rem 0">
                <a href="${wpData.login_url}" style="display:inline-block;background:#F16112;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:600;font-size:1rem">
                    Start the Quiz →
                </a>
            </div>

            <p style="margin:2rem 0 0;color:#666;font-size:0.9rem">
                <strong>The quiz:</strong> 8 questions, takes about 10–15 minutes. We'll analyze the results for learning gaps and patterns.
            </p>
            <p style="margin:1rem 0 0;color:#666;font-size:0.9rem">
                <strong>What's next:</strong> After completion, you'll get an instant diagnostic report with specific learning gaps. Book a free workshop to dive deeper.
            </p>

            <p style="margin-top:2rem;color:#666;font-size:0.9rem">Questions? Reply to this email or contact ${adminEmail}</p>
        </div>

        <div style="background:#f5f5f5;padding:1.5rem;text-align:center;font-size:0.85rem;color:#999;border-top:1px solid #ddd">
            <p style="margin:0">© 2026 GrowWise School. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    try {
      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: process.env.BREVO_SENDER_EMAIL || 'contact@growwiseschool.org', name: 'GrowWise School' },
          to: [{ email: parentEmail, name: parentName }],
          subject: emailSubject,
          htmlContent: emailBody,
        }),
      });

      if (!emailRes.ok) {
        console.error('[self-check] Brevo email failed', emailRes.status);
      }
    } catch (emailErr) {
      console.error('[self-check] Email sending error:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[self-check] POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
