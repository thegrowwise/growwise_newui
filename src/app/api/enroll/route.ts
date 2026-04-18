import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';
import { validatePhoneSimple } from '@/lib/phoneValidation';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import { CONTACT_INFO } from '@/lib/constants';
import {
  isBrevoTransactionalReady,
  sendBrevoTransactionalEmail,
} from '@/lib/brevo';

/** Serverless: allow Brevo HTTP + dual sends to finish (matches summer-camp-lottery). */
export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface EnrollFormData {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  postal: string;
  bootcamp?: string;
  course?: string;
  level: string;
  agree: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (
      body &&
      typeof body === 'object' &&
      ('payment_method_id' in body || 'stripe_payment_method_id' in body)
    ) {
      const raw = body as Record<string, unknown>;
      const pm = raw.payment_method_id ?? raw.stripe_payment_method_id;
      if (!pm || typeof pm !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Missing payment_method_id' },
          { status: 400 },
        );
      }

      const baseUrl = getBackendBaseUrlForProxy();
      if (!baseUrl) {
        return NextResponse.json(
          {
            success: false,
            error: 'Backend is not configured',
            message: 'Set NEXT_PUBLIC_BACKEND_URL in the server environment.',
          },
          { status: 503 },
        );
      }

      try {
        const upstream = await fetch(`${baseUrl}/api/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          cache: 'no-store',
        });

        const contentType = upstream.headers.get('content-type') ?? 'application/json';
        const text = await upstream.text();

        return new NextResponse(text, {
          status: upstream.status,
          headers: {
            'content-type': contentType,
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upstream request failed';
        return NextResponse.json({ success: false, error: message, message }, { status: 502 });
      }
    }

    const {
      fullName,
      email,
      mobile,
      city,
      postal,
      bootcamp,
      course,
      level,
      agree,
    }: EnrollFormData = body as EnrollFormData;

    if (!fullName || !email || !mobile || !city || !postal || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const phoneResult = validatePhoneSimple(mobile);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { error: phoneResult.errorMessage },
        { status: 400 },
      );
    }

    if (!agree) {
      return NextResponse.json(
        { error: 'You must agree to receive communications' },
        { status: 400 },
      );
    }

    const enrollmentData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      city: city.trim(),
      postal: postal.trim(),
      bootcamp: bootcamp?.trim() || 'None',
      course: course?.trim() || 'None',
      level: level.trim(),
      agree,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    const emailResult = await sendEnrollmentEmails(enrollmentData);

    if (emailResult.success) {
      console.log('Enrollment form submission:', {
        ...enrollmentData,
        emailsSent: true,
        emailIds: emailResult.emailIds,
      });

      const payload: Record<string, unknown> = {
        success: true,
        message: 'Enrollment information received successfully. We will contact you within 24 hours.',
        emailIds: emailResult.emailIds,
      };
      if (process.env.NODE_ENV === 'development') {
        payload.emailDebug = {
          channel: isBrevoTransactionalReady() ? 'brevo' : 'smtp',
        };
      }
      return NextResponse.json(payload);
    } else {
      throw new Error(emailResult.error || 'Failed to send emails');
    }
  } catch (error) {
    console.error('Enrollment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to process your enrollment. Please try again or contact us directly.',
      },
      { status: 500 },
    );
  }
}

interface EnrollmentPayload {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  postal: string;
  bootcamp: string;
  course: string;
  level: string;
  agree: boolean;
  timestamp: string;
  ip: string;
}

/** Brevo when configured (typical production); otherwise Nodemailer SMTP — same as summer-camp-lottery. */
async function deliverEnrollmentEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}): Promise<SendEmailResult> {
  if (isBrevoTransactionalReady()) {
    return sendBrevoTransactionalEmail({
      ...options,
      replyTo: { email: CONTACT_INFO.email, name: 'GrowWise' },
    });
  }
  return sendEmail(options);
}

// Email service function for enrollment
async function sendEnrollmentEmails(enrollmentData: EnrollmentPayload) {
  try {
    const businessEmailResult = await sendBusinessEnrollmentEmail(enrollmentData);
    const userEmailResult = await sendUserConfirmationEmail(enrollmentData);

    if (businessEmailResult.success && userEmailResult.success) {
      return {
        success: true,
        emailIds: {
          business: businessEmailResult.emailId,
          user: userEmailResult.emailId
        },
        message: 'Both emails sent successfully'
      };
    }
    return {
      success: false,
      error: `Business email: ${businessEmailResult.success ? 'sent' : 'failed'}, User email: ${userEmailResult.success ? 'sent' : 'failed'}`
    };
  } catch (error) {
    console.error('Enrollment email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send emails'
    };
  }
}

async function sendBusinessEnrollmentEmail(
  enrollmentData: EnrollmentPayload
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const subject = `New Course Enrollment from ${enrollmentData.fullName.replace(/\s+/g, ' ').slice(0, 200)}`;
  const result = await deliverEnrollmentEmail({
    to: CONTACT_INFO.businessEmail,
    subject,
    html: generateBusinessEnrollmentEmailHTML(enrollmentData),
    text: generateBusinessEnrollmentEmailText(enrollmentData),
  });
  if (result.success) {
    console.log('Business enrollment email sent:', { messageId: result.messageId });
    return { success: true, emailId: result.messageId };
  }
  console.error('Business enrollment email failed:', result.error);
  return { success: false, error: result.error };
}

async function sendUserConfirmationEmail(
  enrollmentData: EnrollmentPayload
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const result = await deliverEnrollmentEmail({
    to: enrollmentData.email,
    subject: 'Thank you for enrolling with GrowWise!',
    html: generateUserConfirmationEmailHTML(enrollmentData),
    text: generateUserConfirmationEmailText(enrollmentData),
  });
  if (result.success) {
    console.log('User enrollment confirmation sent:', { messageId: result.messageId });
    return { success: true, emailId: result.messageId };
  }
  console.error('User enrollment confirmation failed:', result.error);
  return { success: false, error: result.error };
}

// Generate HTML email for business (receiver)
function generateBusinessEnrollmentEmailHTML(data: EnrollmentPayload) {
  const n = escapeHtml(data.fullName);
  const e = escapeHtml(data.email);
  const m = escapeHtml(data.mobile);
  const city = escapeHtml(data.city);
  const postal = escapeHtml(data.postal);
  const lvl = escapeHtml(data.level);
  const boot = escapeHtml(data.bootcamp);
  const crs = escapeHtml(data.course);
  const submitted = escapeHtml(new Date(data.timestamp).toLocaleString());
  const ip = escapeHtml(data.ip);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1F396D;">New Course Enrollment</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #F16112; margin-top: 0;">Student Information</h3>
        <p><strong>Name:</strong> ${n}</p>
        <p><strong>Email:</strong> ${e}</p>
        <p><strong>Mobile:</strong> ${m}</p>
        <p><strong>Location:</strong> ${city}, ${postal}</p>
        <p><strong>Level:</strong> ${lvl}</p>
        <p><strong>Submitted:</strong> ${submitted}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
        <h3 style="color: #1F396D; margin-top: 0;">Course Selection</h3>
        <p><strong>Bootcamp:</strong> ${boot}</p>
        <p><strong>Course:</strong> ${crs}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
        <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
        <ul>
          <li>Contact the student within 24 hours</li>
          <li>Send course materials and schedule</li>
          <li>Schedule placement assessment if needed</li>
          <li>Add to student management system</li>
          <li>Send welcome package</li>
        </ul>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        This email was generated from the GrowWise enrollment form.<br>
        IP Address: ${ip}
      </p>
    </div>
  `;
}

// Generate text email for business (receiver)
function generateBusinessEnrollmentEmailText(data: EnrollmentPayload) {
  return `
New Course Enrollment

Student Information:
Name: ${data.fullName}
Email: ${data.email}
Mobile: ${data.mobile}
Location: ${data.city}, ${data.postal}
Level: ${data.level}
Submitted: ${new Date(data.timestamp).toLocaleString()}

Course Selection:
Bootcamp: ${data.bootcamp}
Course: ${data.course}

Next Steps:
- Contact the student within 24 hours
- Send course materials and schedule
- Schedule placement assessment if needed
- Add to student management system
- Send welcome package
  `;
}

// Generate HTML email for user (sender)
function generateUserConfirmationEmailHTML(data: EnrollmentPayload) {
  const n = escapeHtml(data.fullName);
  const e = escapeHtml(data.email);
  const m = escapeHtml(data.mobile);
  const city = escapeHtml(data.city);
  const postal = escapeHtml(data.postal);
  const lvl = escapeHtml(data.level);
  const boot = escapeHtml(data.bootcamp);
  const crs = escapeHtml(data.course);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1F396D; margin: 0;">Welcome to GrowWise!</h1>
        <p style="color: #F16112; font-size: 18px; margin: 10px 0;">Thank you for enrolling with us</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Your Enrollment Details</h3>
        <p><strong>Name:</strong> ${n}</p>
        <p><strong>Email:</strong> ${e}</p>
        <p><strong>Mobile:</strong> ${m}</p>
        <p><strong>Location:</strong> ${city}, ${postal}</p>
        <p><strong>Level:</strong> ${lvl}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112;">
        <h3 style="color: #1F396D; margin-top: 0;">Selected Programs</h3>
        <p><strong>Bootcamp:</strong> ${boot}</p>
        <p><strong>Course:</strong> ${crs}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
        <h3 style="color: #1F396D; margin-top: 0;">What Happens Next?</h3>
        <ul>
          <li>Our team will contact you within 24 hours</li>
          <li>We'll send you detailed course information</li>
          <li>We'll schedule your placement assessment</li>
          <li>You'll receive your welcome package</li>
          <li>We'll set up your learning account</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://growwiseschool.org" style="background-color: #1F396D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Visit Our Website
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from GrowWise Educational Services<br>
        If you have any questions, please contact us at ${CONTACT_INFO.email}
      </p>
    </div>
  `;
}

// Generate text email for user (sender)
function generateUserConfirmationEmailText(data: EnrollmentPayload) {
  return `
Welcome to GrowWise!

Thank you for enrolling with us.

Your Enrollment Details:
Name: ${data.fullName}
Email: ${data.email}
Mobile: ${data.mobile}
Location: ${data.city}, ${data.postal}
Level: ${data.level}

Selected Programs:
Bootcamp: ${data.bootcamp}
Course: ${data.course}

What Happens Next?
- Our team will contact you within 24 hours
- We'll send you detailed course information
- We'll schedule your placement assessment
- You'll receive your welcome package
- We'll set up your learning account

Visit our website: https://growwiseschool.org

If you have any questions, please contact us at ${CONTACT_INFO.email}
  `;
}
