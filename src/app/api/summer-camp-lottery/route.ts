import { NextResponse } from 'next/server';
import { CONTACT_INFO } from '@/lib/constants';
import {
  addSummerCampLotteryContactToBrevoList,
  isBrevoTransactionalReady,
  sendBrevoTransactionalEmail,
} from '@/lib/brevo';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import {
  buildCampGuidePdfUrl,
  buildEmailOpenPixelUrl,
  buildReserveSpotUrl,
  recommendedProgramTrackHtml,
  recommendedProgramTrackText,
} from '@/lib/summer-camp-guide-email';
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

const SUMMER_EARLY_BIRD_CODE = 'GWSUMMER15';
const SUMMER_EARLY_BIRD_DEADLINE = 'April 30';

/** WhatsApp business (US +1 925-456-4606) — wa.me expects country code + number, no symbols. */
const WHATSAPP_HELP_URL = 'https://wa.me/19254564606';

function firstNameFromParentName(parentName: string): string {
  const t = parentName.trim();
  if (!t) return 'Parent';
  return t.split(/\s+/)[0] ?? 'Parent';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Vercel / long-running sends: allow enough time for Brevo + SMTP. */
export const maxDuration = 60;

/** Nodemailer + Brevo HTTP require Node (not Edge). */
export const runtime = 'nodejs';

const BREVO_REPLY_TO = { email: CONTACT_INFO.email, name: 'GrowWise' } as const;

const BREVO_RETRY_DELAY_MS = 450;

/** Try Brevo (with one retry — cold starts / transient 5xx); then SMTP if still failing. */
async function sendCampTransactionalWithFallback(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendEmailResult> {
  if (isBrevoTransactionalReady()) {
    let lastErr: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, BREVO_RETRY_DELAY_MS));
      }
      const brevo = await sendBrevoTransactionalEmail({
        ...opts,
        replyTo: BREVO_REPLY_TO,
      });
      if (brevo.success) return brevo;
      lastErr = brevo.error;
      console.error(
        `[summer-camp-guide] Brevo transactional attempt ${attempt + 1}/2 failed:`,
        brevo.error
      );
    }
    console.error('[summer-camp-guide] Brevo failed after retry; SMTP fallback.', lastErr);
  } else {
    console.warn(
      '[summer-camp-guide] Brevo not configured (set BREVO_API_KEY + BREVO_SENDER_EMAIL); using SMTP only if configured.'
    );
  }
  return sendEmail({
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: BREVO_REPLY_TO.email,
  });
}

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
    const parentNameRaw = typeof body.parentName === 'string' ? body.parentName.trim().slice(0, 120) : '';
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

    console.log('[summer-camp-guide] Lead:', {
      email,
      parentName: parentNameRaw || undefined,
      childGrade,
      campInterest,
      locale: locale || 'unknown',
      timestamp,
    });

    const siteUrl = getCanonicalSiteUrl();
    const localeSeg = locale && /^[a-z]{2}(-[a-z]+)?$/i.test(locale) ? locale : 'en';
    const pdfUrl = buildCampGuidePdfUrl(siteUrl);
    const reserveUrl = buildReserveSpotUrl(siteUrl, localeSeg);
    const openPixelUrl = buildEmailOpenPixelUrl(siteUrl);

    const interestKey = campInterest as InterestKey;
    const recHtml = recommendedProgramTrackHtml(interestKey);
    const recText = recommendedProgramTrackText(interestKey);

    const greetingName = escapeHtml(firstNameFromParentName(parentNameRaw));

    const userSubject = 'Your Camp Guide + 15% Off (Limited Seats)';
    const userHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <p style="margin: 0 0 16px;">Hi ${greetingName},</p>
        <p style="margin: 0 0 20px;">Thanks for your interest in GrowWise Summer Camps.</p>
        <p style="margin: 0 0 12px;">Here’s your full camp guide with program details and schedules:</p>
        <p style="margin: 0 0 20px;">
          <a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer" style="color: #1F396D; font-weight: bold;">👉 Camp Guide (PDF, opens in new tab)</a>
        </p>
        <p style="margin: 0 0 8px;">• AI &amp; Coding</p>
        <p style="margin: 0 0 8px;">• Robotics &amp; Game Development</p>
        <p style="margin: 0 0 24px;">• Math &amp; Olympiad Prep</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="margin: 0 0 8px; font-weight: bold;">Your 15% Early-Bird Code:</p>
        <p style="margin: 0 0 4px;">Code: <strong style="font-size: 16px; letter-spacing: 0.5px;">${escapeHtml(SUMMER_EARLY_BIRD_CODE)}</strong></p>
        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">Valid until ${escapeHtml(SUMMER_EARLY_BIRD_DEADLINE)} (limited seats per batch)</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="margin: 0 0 12px; font-weight: bold;">Based on your input:</p>
        <p style="margin: 0 0 4px;">• Interest: ${escapeHtml(interestLabel)}</p>
        <p style="margin: 0 0 16px;">• Grade: ${escapeHtml(gradeLabel)}</p>
        <p style="margin: 0 0 24px;">We recommend starting with our <strong>${recHtml}</strong> track.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="margin: 0 0 8px; font-weight: bold;">Next Step (recommended):</p>
        <p style="margin: 0 0 16px;">Spots fill quickly each week.</p>
        <p style="margin: 0 0 24px;">
          <a href="${escapeHtml(reserveUrl)}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff !important; font-weight: bold; text-decoration: none; border-radius: 8px;">Reserve a Spot →</a>
        </p>
        <p style="margin: 0 0 24px;">If you’re unsure which camp fits best, reply to this email or <a href="${escapeHtml(WHATSAPP_HELP_URL)}" style="color: #1F396D;">message us on WhatsApp</a>.</p>
        <p style="margin: 0;">GrowWise Team<br />${escapeHtml(CONTACT_INFO.city)}</p>
        <p style="margin: 16px 0 0;">
          <a href="mailto:${escapeHtml(CONTACT_INFO.email)}" style="color: #1F396D;">${escapeHtml(CONTACT_INFO.email)}</a>
        </p>
        <img src="${escapeHtml(openPixelUrl)}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;" />
      </div>
    `;

    const userText = [
      `Hi ${firstNameFromParentName(parentNameRaw)},`,
      '',
      'Thanks for your interest in GrowWise Summer Camps.',
      '',
      'Here’s your full camp guide with program details and schedules:',
      pdfUrl,
      '',
      '• AI & Coding',
      '• Robotics & Game Development',
      '• Math & Olympiad Prep',
      '',
      '---',
      '',
      'Your 15% Early-Bird Code:',
      `Code: ${SUMMER_EARLY_BIRD_CODE}`,
      `Valid until ${SUMMER_EARLY_BIRD_DEADLINE} (limited seats per batch)`,
      '',
      '---',
      '',
      'Based on your input:',
      `• Interest: ${interestLabel}`,
      `• Grade: ${gradeLabel}`,
      '',
      `We recommend starting with our ${recText} track.`,
      '',
      '---',
      '',
      'Next Step (recommended):',
      'Spots fill quickly each week.',
      '',
      `Reserve a Spot: ${reserveUrl}`,
      '',
      `Questions? Reply to this email or WhatsApp: ${WHATSAPP_HELP_URL}`,
      '',
      'GrowWise Team',
      CONTACT_INFO.city,
      CONTACT_INFO.email,
    ].join('\n');

    const brevoReady = isBrevoTransactionalReady();

    /** Send confirmation first — do not block on Brevo /contacts (avoids timeout stacking with list + mail). */
    const userResult = await sendCampTransactionalWithFallback({
      to: email,
      subject: userSubject,
      html: userHtml,
      text: userText,
    });

    if (!userResult.success) {
      console.error('[summer-camp-guide] User email failed after Brevo + SMTP:', userResult.error);
      return NextResponse.json(
        {
          success: false,
          error:
            'We could not send your confirmation email. Please try again in a few minutes or contact connect@thegrowwise.com.',
        },
        { status: 503 }
      );
    }

    const businessSubject = `Summer camp guide lead – ${email}`;
    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">New summer camp guide lead</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${parentNameRaw ? `<p><strong>Parent name:</strong> ${escapeHtml(parentNameRaw)}</p>` : ''}
          <p><strong>Camp interest:</strong> ${escapeHtml(interestLabel)}</p>
          <p><strong>Child grade:</strong> ${escapeHtml(gradeLabel)}</p>
          ${locale ? `<p><strong>Locale:</strong> ${escapeHtml(locale)}</p>` : ''}
          <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
          ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ''}
        </div>
      </div>
    `;
    const businessText = [
      'New summer camp guide lead',
      `Email: ${email}`,
      parentNameRaw && `Parent name: ${parentNameRaw}`,
      `Camp interest: ${interestLabel}`,
      `Child grade: ${gradeLabel}`,
      locale && `Locale: ${locale}`,
      `Submitted: ${timestamp}`,
      ip && `IP: ${ip}`,
    ]
      .filter(Boolean)
      .join('\n');

    const businessResult = await sendCampTransactionalWithFallback({
      to: CONTACT_INFO.businessEmail,
      subject: businessSubject,
      html: businessHtml,
      text: businessText,
    });

    if (!businessResult.success) {
      console.warn('[summer-camp-guide] Business notification failed (user email already sent):', businessResult.error);
    }

    let listAddResult: SendEmailResult | undefined;
    if (brevoReady) {
      listAddResult = await addSummerCampLotteryContactToBrevoList(email);
      if (!listAddResult.success) {
        console.warn('[summer-camp-guide] Brevo list add skipped (emails already sent).', listAddResult.error);
      }
    }

    const payload: Record<string, unknown> = {
      success: true,
      message: 'Check your email for the camp guide and 15% off code.',
    };

    if (process.env.NODE_ENV === 'development') {
      payload.emailDebug = {
        userEmailSent: userResult.success,
        businessEmailSent: businessResult.success,
        brevoConfigured: brevoReady,
        ...(brevoReady && listAddResult
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
    console.error('[summer-camp-guide] Unhandled error:', err);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
