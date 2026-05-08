import { NextResponse } from 'next/server';
import { ContactFormData } from '@/components/chatbot/ContactForm';
import { CONTACT_INFO } from '@/lib/constants';
import { isBrevoTransactionalReady, sendBrevoTransactionalEmail } from '@/lib/brevo';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import { validatePhoneSimple } from '@/lib/phoneValidation';
import {
  isHubSpotFormsConfigured,
  splitFullName,
  submitHubSpotForm,
} from '@/lib/hubspot/submitForm';
import { clientIpFrom, isAllowed } from '@/lib/chatRateLimit';
import { clip, exceedsMax, FIELD_MAX, isValidEmailShape } from '@/lib/inputLimits';
import { honeypotTriggered, isOriginAllowed } from '@/lib/requestGuard';

const MAX_BODY_BYTES = 32 * 1024;

const BREVO_RETRY_DELAY_MS = 450;

function escapeHtmlEmail(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Brevo transactional `/smtp/email` only — does not attach contacts to marketing lists.
 * List id 11 is never used for automation list assignment (`src/lib/brevo.ts`).
 */
async function deliverContactNotification(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}): Promise<SendEmailResult> {
  const replyTo = { email: CONTACT_INFO.email, name: 'GrowWise' } as const;

  if (isBrevoTransactionalReady()) {
    let lastErr: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, BREVO_RETRY_DELAY_MS));
      }
      const brevo = await sendBrevoTransactionalEmail({
        ...opts,
        replyTo,
      });
      if (brevo.success) return brevo;
      lastErr = brevo.error;
      console.error(`[contact] Brevo transactional attempt ${attempt + 1}/2 failed:`, brevo.error);
    }
    console.error('[contact] Brevo failed after retry; SMTP fallback.', lastErr);
  } else {
    console.warn(
      '[contact] Brevo not configured (set BREVO_API_KEY + BREVO_SENDER_EMAIL); using SMTP only if configured.'
    );
  }

  return sendEmail({
    ...opts,
    replyTo: CONTACT_INFO.email,
  });
}

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  timestamp: string;
  ip: string;
};

export async function POST(request: Request) {
  try {
    if (!isAllowed('contact', clientIpFrom(request))) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again later.' },
        { status: 429 },
      );
    }
    if (!isOriginAllowed(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 403 },
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Request too large' },
        { status: 413 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 },
      );
    }

    if (honeypotTriggered(body)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 },
      );
    }

    const { name, email, phone, message, source }: ContactFormData = body as unknown as ContactFormData;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', errors: [{ field: 'name', message: 'Name, email and phone are required' }] },
        { status: 400 }
      );
    }

    if (
      exceedsMax(name, FIELD_MAX.name) ||
      exceedsMax(email, FIELD_MAX.email) ||
      exceedsMax(phone, FIELD_MAX.phone) ||
      (typeof message === 'string' && exceedsMax(message, FIELD_MAX.longText)) ||
      (typeof source === 'string' && exceedsMax(source, FIELD_MAX.shortText))
    ) {
      return NextResponse.json(
        { success: false, message: 'One or more fields are too long' },
        { status: 400 },
      );
    }

    const nameC = clip(name, FIELD_MAX.name);
    const emailC = clip(email, FIELD_MAX.email).toLowerCase();
    const phoneC = clip(phone, FIELD_MAX.phone);
    const messageC = typeof message === 'string' ? clip(message, FIELD_MAX.longText) : '';
    const sourceC = clip(typeof source === 'string' ? source : 'chatbot', FIELD_MAX.shortText) || 'chatbot';

    if (!isValidEmailShape(emailC)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format', errors: [{ field: 'email', message: 'Please enter a valid email address' }] },
        { status: 400 }
      );
    }

    const phoneResult = validatePhoneSimple(phoneC);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { success: false, message: phoneResult.errorMessage, errors: [{ field: 'phone', message: phoneResult.errorMessage }] },
        { status: 400 }
      );
    }

    if (messageC.length > 0 && messageC.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message must be at least 10 characters long',
          errors: [{ field: 'message', message: 'Message must be at least 10 characters long' }]
        },
        { status: 400 }
      );
    }

    const contactData: ContactPayload = {
      name: nameC,
      email: emailC,
      phone: phoneC,
      message: messageC,
      source: sourceC,
      timestamp: new Date().toISOString(),
      ip: clientIpFrom(request),
    };

    const emailResult = await sendContactEmail(contactData);

    if (emailResult.success) {
      const at = contactData.email.indexOf('@');
      const emailDomain = at > 0 ? contactData.email.slice(at + 1) : 'unknown';
      console.log('[contact] submission ok', {
        source: contactData.source,
        emailDomain,
        hasMessage: contactData.message.length > 0,
        ip: contactData.ip,
        messageId: emailResult.messageId,
      });

      // HubSpot CRM (server-only Forms API — same env as /api/hubspot-submit; does not load chat widget)
      if (isHubSpotFormsConfigured()) {
        const { firstname, lastname } = splitFullName(contactData.name);
        const messageBlock = [
          contactData.message?.trim(),
          `Source: ${contactData.source}`,
        ]
          .filter((s) => typeof s === 'string' && s.length > 0)
          .join('\n\n');

        const hubResult = await submitHubSpotForm(
          [
            { name: 'firstname', value: firstname },
            { name: 'lastname', value: lastname },
            { name: 'email', value: contactData.email },
            { name: 'phone', value: contactData.phone },
            { name: 'message', value: messageBlock },
          ],
          {
            pageUri: request.headers.get('referer') ?? '',
            pageName: 'Website contact (chatbot)',
          }
        );
        if (!hubResult.ok) {
          console.error('[contact] HubSpot CRM sync failed:', hubResult.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Contact information received successfully. We will contact you within 24 hours.',
        emailId: emailResult.messageId
      });
    }

    throw new Error(emailResult.error || 'Failed to send email');
  } catch (error) {
    console.error('[contact] POST failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong on our end. Please try again or email us directly.',
        errors: [{ field: 'form', message: 'Something went wrong on our end. Please try again or email us directly.' }]
      },
      { status: 500 }
    );
  }
}

async function sendContactEmail(contactData: ContactPayload): Promise<SendEmailResult> {
  try {
    const to = CONTACT_INFO.email;
    const safeName = escapeHtmlEmail(contactData.name);
    const safeEmail = escapeHtmlEmail(contactData.email);
    const safePhone = escapeHtmlEmail(contactData.phone);
    const safeSource = escapeHtmlEmail(contactData.source);
    const safeMessage = contactData.message ? escapeHtmlEmail(contactData.message) : '';
    const safeIp = escapeHtmlEmail(contactData.ip);
    const submitted = escapeHtmlEmail(new Date(contactData.timestamp).toLocaleString());

    const subject = `New Contact Form Submission from ${contactData.name}`.slice(0, 998);

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1F396D;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #F16112; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Source:</strong> ${safeSource}</p>
            <p><strong>Submitted:</strong> ${submitted}</p>
          </div>

          ${contactData.message ? `
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
              <h3 style="color: #1F396D; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
            <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
            <ul>
              <li>Contact the lead within 24 hours</li>
              <li>Send personalized program information</li>
              <li>Schedule assessment or consultation if requested</li>
              <li>Add to CRM system for follow-up</li>
            </ul>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This email was generated from the GrowWise website contact form.<br>
            IP Address: ${safeIp}
          </p>
        </div>
      `;

    const text = `
        New Contact Form Submission
        
        Contact Information:
        Name: ${contactData.name}
        Email: ${contactData.email}
        Phone: ${contactData.phone}
        Source: ${contactData.source}
        Submitted: ${new Date(contactData.timestamp).toLocaleString()}
        
        ${contactData.message ? `Message: ${contactData.message}` : ''}
        
        Next Steps:
        - Contact the lead within 24 hours
        - Send personalized program information
        - Schedule assessment or consultation if requested
        - Add to CRM system for follow-up
        
        IP: ${contactData.ip}
      `;

    return deliverContactNotification({
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Contact email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}
