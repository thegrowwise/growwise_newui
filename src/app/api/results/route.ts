import { NextResponse } from 'next/server';
import { clip, FIELD_MAX } from '@/lib/inputLimits';
import { detectPatterns, type WrongAnswer } from '@/lib/patterns';
import { computeAward } from '@/lib/award';
import { sendResultsEmail } from '@/lib/resultsEmail';

export const maxDuration = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = clip(searchParams.get('session') ?? '', FIELD_MAX.shortText);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Missing session token.' }, { status: 400 });
    }

    const wpUrl = process.env.GROWWISE_WP_RESULTS_URL;
    const wpSecret = process.env.GROWWISE_WP_SECRET;

    if (!wpUrl || !wpSecret) {
      console.error('[results] WordPress env vars not configured');
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable.' },
        { status: 503 },
      );
    }

    const url = new URL(wpUrl);
    url.searchParams.set('session', session);

    const wpRes = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'X-GrowWise-Secret': wpSecret },
      next: { revalidate: 0 },
    });

    if (wpRes.status === 404) {
      return NextResponse.json({ success: false, error: 'Session not found.' }, { status: 404 });
    }

    if (!wpRes.ok) {
      console.error('[results] WordPress results fetch failed', wpRes.status);
      return NextResponse.json(
        { success: false, error: 'Could not load results. Please try again.' },
        { status: 502 },
      );
    }

    const wpData = await wpRes.json() as {
      status?: string;
      student_name?: string;
      grade?: number;
      subject?: string;
      wrong_answers?: WrongAnswer[];
      parent_prediction?: string; // stored as JSON array string or plain string
      student_prediction?: string;
      parent_email?: string;
      email_sent?: boolean;
    };

    if (wpData.status === 'quiz_not_completed') {
      return NextResponse.json({ success: true, status: 'quiz_not_completed' });
    }

    const wrongAnswers: WrongAnswer[] = Array.isArray(wpData.wrong_answers)
      ? wpData.wrong_answers
      : [];

    const { confirmed, possible, overallRisk } = detectPatterns(wrongAnswers);

    const parentPredictionRaw = wpData.parent_prediction ?? '';
    let parentPrediction: string | string[] = clip(parentPredictionRaw, 500);
    try {
      const parsed = JSON.parse(parentPredictionRaw);
      if (Array.isArray(parsed)) parentPrediction = parsed.map(String);
    } catch { /* stored as plain string — use as-is */ }

    const studentPrediction = clip(wpData.student_prediction ?? '', FIELD_MAX.shortText);
    const awardTier = computeAward(confirmed, studentPrediction, parentPrediction);

    // Send results email to parent once (idempotent via WP email_sent flag)
    if (!wpData.email_sent && wpData.parent_email) {
      const markSentUrl = process.env.GROWWISE_WP_MARK_SENT_URL;
      const wpSecret = process.env.GROWWISE_WP_SECRET;
      try {
        await sendResultsEmail({
          parentEmail: wpData.parent_email,
          studentName: clip(wpData.student_name ?? '', FIELD_MAX.name),
          grade: wpData.grade ?? 0,
          subject: wpData.subject ?? '',
          confirmedPatterns: confirmed,
          possiblePatterns: possible,
          awardTier,
          parentPrediction,
          studentPrediction,
          calendlyUrl: process.env.NEXT_PUBLIC_WORKSHOP_CALENDLY_URL ?? process.env.NEXT_PUBLIC_WORKSHOP_BOOKING_URL ?? 'https://calendly.com/growwise/workshop',
        });
        if (markSentUrl && wpSecret) {
          await fetch(markSentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-GrowWise-Secret': wpSecret },
            body: JSON.stringify({ session }),
          }).catch((e) => console.error('[results] mark-sent call failed:', e));
        }
      } catch (emailErr) {
        console.error('[results] Failed to send results email:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      status: 'completed',
      student_name: clip(wpData.student_name ?? '', FIELD_MAX.name),
      grade: wpData.grade,
      subject: clip(wpData.subject ?? '', FIELD_MAX.shortText),
      patterns_confirmed: confirmed,
      patterns_possible: possible,
      overall_risk: overallRisk,
      parent_prediction: parentPrediction,
      student_prediction: studentPrediction,
      award_tier: awardTier,
    });
  } catch (error) {
    console.error('[results] GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
