import { NextResponse } from 'next/server';
import { CONTACT_INFO } from '@/lib/constants';
import {
  addSummerCampLotteryContactToBrevoList,
  isBrevoTransactionalReady,
  sendBrevoTransactionalEmail,
} from '@/lib/brevo';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import { LOTTERY_GRADES, type LotteryGrade } from '@/lib/summer-lottery-keys';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTEREST_KEYS = [
  'academic',
  'game_development',
  'coding',
  'robotics',
  'math_olympiad',
  'ai',
  'young_authors',
] as const;

type InterestKey = (typeof INTEREST_KEYS)[number];

const GRADE_LABELS: Record<LotteryGrade, string> = {
  '1': '1st grade',
  '2': '2nd grade',
  '3': '3rd grade',
  '4': '4th grade',
  '5': '5th grade',
  '6': '6th grade',
  '7': '7th grade',
  '8': '8th grade',
  '9': '9th grade',
  '10': '10th grade',
  '11': '11th grade',
  '12': '12th grade',
  other: 'Other',
};

const INTEREST_LABELS: Record<InterestKey, string> = {
  academic: 'Academic',
  game_development: 'Game development',
  coding: 'Coding',
  robotics: 'Robotics',
  math_olympiad: 'Math & Olympiad',
  ai: 'AI & Innovation',
  young_authors: 'Young Authors',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Vercel / long-running sends: allow enough time for Brevo + SMTP. */
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid or malformed JSON' },
      { status: 400 }
    );
  }

  try {
    const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
    const childGrade = typeof body.childGrade === 'string' ? body.childGrade.trim() : '';
    const campInterest = typeof body.campInterest === 'string' ? body.campInterest.trim() : '';
    const locale = typeof body.locale === 'string' ? body.locale.trim().slice(0, 10) : '';

    const gradeOk = (LOTTERY_GRADES as readonly string[]).includes(childGrade);
    const interestOk = INTEREST_KEYS.includes(campInterest as InterestKey);

    if (!gradeOk || !interestOk || !emailRaw || !EMAIL_REGEX.test(emailRaw)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or incomplete form' },
        { status: 400 }
      );
    }

    const email = emailRaw.toLowerCase();
    const gradeLabel = GRADE_LABELS[childGrade as LotteryGrade];
    const interestLabel = INTEREST_LABELS[campInterest as InterestKey];
    const timestamp = new Date().toISOString();
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;

    console.log('Summer camp lottery signup:', {
      email,
      childGrade,
      campInterest,
      locale: locale || 'unknown',
      timestamp,
    });

    const userSubject = 'You’re entered — GrowWise Summer Camp free spot lottery';
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">You’re entered!</h2>
        <p><strong>Winner announced May 20th.</strong> Only 10 spots — results emailed directly to this address.</p>
        <p>We saved your entry for the <strong>Summer Camp free spot lottery</strong> (Academic, game development, or coding — your choice is below). Questions? ${escapeHtml(CONTACT_INFO.email)}</p>
        <p style="color:#64748b;font-size:14px;"><strong>Interest:</strong> ${escapeHtml(interestLabel)} · <strong>Grade:</strong> ${escapeHtml(gradeLabel)}</p>
        <p>— GrowWise Educational Services</p>
      </div>
    `;
    const userText = [
      "You're entered!",
      'Winner announced May 20th. Only 10 spots — results emailed directly.',
      '',
      `Camp interest (Academic / Game development / Coding): ${interestLabel}`,
      `Child grade: ${gradeLabel}`,
      '',
      `Questions: ${CONTACT_INFO.email}`,
      '',
      '— GrowWise Educational Services',
    ].join('\n');

    const useBrevo = isBrevoTransactionalReady();

    let listAddResult: SendEmailResult | undefined;
    if (useBrevo) {
      listAddResult = await addSummerCampLotteryContactToBrevoList(email);
      if (!listAddResult.success) {
        console.warn('[summer-camp-lottery] Brevo lottery list add skipped.', listAddResult.error);
      }
    }

    let userResult: SendEmailResult;
    let businessResult: SendEmailResult;

    if (useBrevo) {
      userResult = await sendBrevoTransactionalEmail({
        to: email,
        subject: userSubject,
        html: userHtml,
        text: userText,
        replyTo: { email: CONTACT_INFO.email, name: 'GrowWise' },
      });
    } else {
      userResult = await sendEmail({
        to: email,
        subject: userSubject,
        html: userHtml,
        text: userText,
      });
    }

    if (!userResult.success) {
      console.warn('[summer-camp-lottery] User confirmation email skipped.', userResult.error);
    }

    const businessSubject = `Summer camp lottery – ${email}`;
    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">New summer camp lottery entry</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Camp interest:</strong> ${escapeHtml(interestLabel)}</p>
          <p><strong>Child grade:</strong> ${escapeHtml(gradeLabel)}</p>
          ${locale ? `<p><strong>Locale:</strong> ${escapeHtml(locale)}</p>` : ''}
          <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
          ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ''}
        </div>
      </div>
    `;
    const businessText = [
      'New summer camp lottery entry',
      `Email: ${email}`,
      `Camp interest: ${interestLabel}`,
      `Child grade: ${gradeLabel}`,
      locale && `Locale: ${locale}`,
      `Submitted: ${timestamp}`,
      ip && `IP: ${ip}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (useBrevo) {
      businessResult = await sendBrevoTransactionalEmail({
        to: CONTACT_INFO.businessEmail,
        subject: businessSubject,
        html: businessHtml,
        text: businessText,
        replyTo: { email: CONTACT_INFO.email, name: 'GrowWise' },
      });
    } else {
      businessResult = await sendEmail({
        to: CONTACT_INFO.businessEmail,
        subject: businessSubject,
        html: businessHtml,
        text: businessText,
      });
    }

    if (!businessResult.success) {
      console.warn('[summer-camp-lottery] Business notification skipped.', businessResult.error);
    }

    const payload: Record<string, unknown> = {
      success: true,
      message: 'Entry received.',
    };

    // Local dev: UI + Network tab can see why inbox stays empty (API still accepts the entry).
    if (process.env.NODE_ENV === 'development') {
      payload.emailDebug = {
        userEmailSent: userResult.success,
        businessEmailSent: businessResult.success,
        ...(useBrevo && listAddResult
          ? {
              brevoListAddSent: listAddResult.success,
              ...(listAddResult.error ? { brevoListAddError: listAddResult.error } : {}),
            }
          : {}),
        ...(userResult.error ? { userEmailError: userResult.error } : {}),
        ...(businessResult.error ? { businessEmailError: businessResult.error } : {}),
      };
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error('[summer-camp-lottery] Unhandled error:', err);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
