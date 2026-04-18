import { NextResponse } from 'next/server';
import { validatePhoneSimple } from '@/lib/phoneValidation';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import { CONTACT_INFO } from '@/lib/constants';
import {
  isBrevoTransactionalReady,
  sendBrevoTransactionalEmail,
} from '@/lib/brevo';

export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface AssessmentFormData {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  assessmentType: string;
  mode: string;
  schedule: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      email,
      countryCode,
      phone,
      studentName,
      grade,
      subjects,
      assessmentType,
      mode,
      schedule,
      notes
    }: AssessmentFormData = body;

    // Validate required fields
    if (!parentName || !email || !phone || !studentName || !grade || !assessmentType || !mode || !schedule) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    const phoneResult = validatePhoneSimple(phone);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: phoneResult.errorMessage 
        },
        { status: 400 }
      );
    }

    // Prepare assessment data
    const assessmentData = {
      parentName: parentName.trim(),
      email: email.trim().toLowerCase(),
      countryCode: countryCode.trim(),
      phone: phone.trim(),
      studentName: studentName.trim(),
      grade: grade.trim(),
      subjects: subjects || [],
      assessmentType: assessmentType.trim(),
      mode: mode.trim(),
      schedule: schedule.trim(),
      notes: notes?.trim() || '',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Send emails to both receiver and sender
    const emailResult = await sendAssessmentEmails(assessmentData);

    if (emailResult.success) {
      // Log the assessment submission (in production, save to database)
      console.log('Assessment booking submission:', {
        ...assessmentData,
        emailsSent: true,
        emailIds: emailResult.emailIds
      });

      const payload: Record<string, unknown> = {
        success: true,
        message:
          'Assessment booking received successfully. We will contact you within 24 hours to confirm your appointment.',
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
    console.error('Assessment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Failed to process your assessment booking. Please try again or contact us directly.'
      },
      { status: 500 }
    );
  }
}

interface AssessmentPayload {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  assessmentType: string;
  mode: string;
  schedule: string;
  notes: string;
  timestamp: string;
  ip: string;
}

async function deliverAssessmentEmail(options: {
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

async function sendAssessmentEmails(assessmentData: AssessmentPayload) {
  try {
    const businessEmailResult = await sendBusinessAssessmentEmail(assessmentData);
    const userEmailResult = await sendUserAssessmentConfirmationEmail(assessmentData);

    if (businessEmailResult.success && userEmailResult.success) {
      return {
        success: true,
        emailIds: {
          business: businessEmailResult.emailId,
          user: userEmailResult.emailId,
        },
        message: 'Both emails sent successfully',
      };
    }
    return {
      success: false,
      error: `Business email: ${businessEmailResult.success ? 'sent' : 'failed'}, User email: ${userEmailResult.success ? 'sent' : 'failed'}`,
    };
  } catch (error) {
    console.error('Assessment email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send emails',
    };
  }
}

async function sendBusinessAssessmentEmail(
  assessmentData: AssessmentPayload
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const subject = `New Assessment Booking from ${assessmentData.parentName.replace(/\s+/g, ' ').slice(0, 200)}`;
  const result = await deliverAssessmentEmail({
    to: CONTACT_INFO.businessEmail,
    subject,
    html: generateBusinessAssessmentEmailHTML(assessmentData),
    text: generateBusinessAssessmentEmailText(assessmentData),
  });
  if (result.success) {
    console.log('Business assessment email sent:', { messageId: result.messageId });
    return { success: true, emailId: result.messageId };
  }
  console.error('Business assessment email failed:', result.error);
  return { success: false, error: result.error };
}

async function sendUserAssessmentConfirmationEmail(
  assessmentData: AssessmentPayload
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const result = await deliverAssessmentEmail({
    to: assessmentData.email,
    subject: 'Thank you for booking an assessment with GrowWise!',
    html: generateUserAssessmentConfirmationEmailHTML(assessmentData),
    text: generateUserAssessmentConfirmationEmailText(assessmentData),
  });
  if (result.success) {
    console.log('User assessment confirmation sent:', { messageId: result.messageId });
    return { success: true, emailId: result.messageId };
  }
  console.error('User assessment confirmation failed:', result.error);
  return { success: false, error: result.error };
}

function generateBusinessAssessmentEmailHTML(data: AssessmentPayload) {
  const subjectsLine =
    data.subjects.length > 0
      ? data.subjects.map((s) => escapeHtml(s)).join(', ')
      : 'Not specified';
  const notesBlock = data.notes
    ? `<p><strong>Notes:</strong> ${escapeHtml(data.notes)}</p>`
    : '';
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1F396D;">New Assessment Booking</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #F16112; margin-top: 0;">Parent/Guardian Information</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.parentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.countryCode)} ${escapeHtml(data.phone)}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(new Date(data.timestamp).toLocaleString())}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Student Information</h3>
        <p><strong>Student Name:</strong> ${escapeHtml(data.studentName)}</p>
        <p><strong>Grade:</strong> ${escapeHtml(data.grade)}</p>
        <p><strong>Subjects:</strong> ${subjectsLine}</p>
      </div>

      <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Assessment Details</h3>
        <p><strong>Assessment Type:</strong> ${escapeHtml(data.assessmentType)}</p>
        <p><strong>Mode:</strong> ${escapeHtml(data.mode)}</p>
        <p><strong>Preferred Schedule:</strong> ${escapeHtml(data.schedule)}</p>
        ${notesBlock}
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <h3 style="color: #1F396D; margin-top: 0;">Next Steps</h3>
        <ul>
          <li>Contact the parent within 24 hours to confirm the assessment</li>
          <li>Schedule the assessment based on preferred time</li>
          <li>Send assessment preparation materials</li>
          <li>Add to calendar and student management system</li>
          <li>Send reminder email 24 hours before assessment</li>
        </ul>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        This email was generated from the GrowWise assessment booking form.<br>
        IP Address: ${escapeHtml(data.ip)}
      </p>
    </div>
  `;
}

function generateBusinessAssessmentEmailText(data: AssessmentPayload) {
  return `
New Assessment Booking

Parent/Guardian Information:
Name: ${data.parentName}
Email: ${data.email}
Phone: ${data.countryCode} ${data.phone}
Submitted: ${new Date(data.timestamp).toLocaleString()}

Student Information:
Student Name: ${data.studentName}
Grade: ${data.grade}
Subjects: ${data.subjects && data.subjects.length > 0 ? data.subjects.join(', ') : 'Not specified'}

Assessment Details:
Assessment Type: ${data.assessmentType}
Mode: ${data.mode}
Preferred Schedule: ${data.schedule}
${data.notes ? `Notes: ${data.notes}` : ''}

Next Steps:
- Contact the parent within 24 hours to confirm the assessment
- Schedule the assessment based on preferred time
- Send assessment preparation materials
- Add to calendar and student management system
- Send reminder email 24 hours before assessment
  `;
}

function generateUserAssessmentConfirmationEmailHTML(data: AssessmentPayload) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1F396D; margin: 0;">Thank You for Booking!</h1>
        <p style="color: #F16112; font-size: 18px; margin: 10px 0;">Your assessment request has been received</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">Booking Details</h3>
        <p><strong>Student Name:</strong> ${escapeHtml(data.studentName)}</p>
        <p><strong>Grade:</strong> ${escapeHtml(data.grade)}</p>
        <p><strong>Assessment Type:</strong> ${escapeHtml(data.assessmentType)}</p>
        <p><strong>Mode:</strong> ${escapeHtml(data.mode)}</p>
        <p><strong>Preferred Schedule:</strong> ${escapeHtml(data.schedule)}</p>
      </div>

      <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #F16112; margin: 20px 0;">
        <h3 style="color: #1F396D; margin-top: 0;">What Happens Next?</h3>
        <ul>
          <li>Our team will contact you within 24 hours to confirm your assessment appointment</li>
          <li>We'll send you assessment preparation materials</li>
          <li>You'll receive a calendar invitation with the confirmed date and time</li>
          <li>We'll send a reminder email 24 hours before your assessment</li>
          <li>After the assessment, we'll provide detailed feedback and recommendations</li>
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

function generateUserAssessmentConfirmationEmailText(data: AssessmentPayload) {
  return `
Thank You for Booking!

Your assessment request has been received.

Booking Details:
Student Name: ${data.studentName}
Grade: ${data.grade}
Assessment Type: ${data.assessmentType}
Mode: ${data.mode}
Preferred Schedule: ${data.schedule}

What Happens Next?
- Our team will contact you within 24 hours to confirm your assessment appointment
- We'll send you assessment preparation materials
- You'll receive a calendar invitation with the confirmed date and time
- We'll send a reminder email 24 hours before your assessment
- After the assessment, we'll provide detailed feedback and recommendations

Visit our website: https://growwiseschool.org

If you have any questions, please contact us at ${CONTACT_INFO.email}
  `;
}

