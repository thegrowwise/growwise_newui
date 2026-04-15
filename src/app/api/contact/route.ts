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

const BREVO_RETRY_DELAY_MS = 450;

function escapeHtml(s: string): string {
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
    const body = await request.json();
    const { name, email, phone, message, source }: ContactFormData = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', errors: [{ field: 'name', message: 'Name, email and phone are required' }] },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format', errors: [{ field: 'email', message: 'Please enter a valid email address' }] },
        { status: 400 }
      );
    }

    const phoneResult = validatePhoneSimple(phone);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { success: false, message: phoneResult.errorMessage, errors: [{ field: 'phone', message: phoneResult.errorMessage }] },
        { status: 400 }
      );
    }

    // Validate message length (min 10 characters when provided)
    const messageVal = typeof message === 'string' ? message.trim() : '';
    if (messageVal.length > 0 && messageVal.length < 10) {
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
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || '',
      source: source || 'chatbot',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    const emailResult = await sendContactEmail(contactData);

    if (emailResult.success) {
      console.log('Contact form submission:', {
        ...contactData,
        emailSent: true,
        messageId: emailResult.messageId
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        errors: [{ field: 'form', message: errorMessage }]
      },
      { status: 500 }
    );
  }
}

async function sendContactEmail(contactData: ContactPayload): Promise<SendEmailResult> {
  try {
    const to = CONTACT_INFO.email;
    const safeName = escapeHtml(contactData.name);
    const safeEmail = escapeHtml(contactData.email);
    const safePhone = escapeHtml(contactData.phone);
    const safeSource = escapeHtml(contactData.source);
    const safeMessage = contactData.message ? escapeHtml(contactData.message) : '';
    const safeIp = escapeHtml(contactData.ip);
    const submitted = escapeHtml(new Date(contactData.timestamp).toLocaleString());

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
