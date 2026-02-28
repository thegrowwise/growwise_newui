import { NextResponse } from 'next/server';
import { CONTACT_INFO } from '@/lib/constants';
import { sendEmail } from '@/lib/email';

export interface WebinarWorkshopFormData {
  parentName: string;
  email: string;
  studentName: string;
  grade: string;
  schoolDistrict: string;
  howDidYouHear: string;
  eventType: 'webinar' | 'workshop';
  phone?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventGrades?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOW_DID_YOU_HEAR_VALUES = ['social_media', 'google', 'friends', 'whatsapp'] as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      email,
      studentName,
      grade,
      schoolDistrict,
      howDidYouHear,
      eventType,
      phone,
      eventTitle,
      eventDate,
      eventTime,
      eventGrades
    } = body as Record<string, unknown>;

    if (
      typeof parentName !== 'string' ||
      !parentName.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof studentName !== 'string' ||
      !studentName.trim() ||
      typeof grade !== 'string' ||
      !grade.trim() ||
      typeof schoolDistrict !== 'string' ||
      !schoolDistrict.trim() ||
      typeof howDidYouHear !== 'string' ||
      !HOW_DID_YOU_HEAR_VALUES.includes(howDidYouHear as (typeof HOW_DID_YOU_HEAR_VALUES)[number]) ||
      (eventType !== 'webinar' && eventType !== 'workshop')
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const payload = {
      parentName: parentName.trim(),
      email: email.trim().toLowerCase(),
      studentName: studentName.trim(),
      grade: grade.trim(),
      schoolDistrict: schoolDistrict.trim(),
      howDidYouHear: howDidYouHear.trim(),
      eventType: eventType as 'webinar' | 'workshop',
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      eventTitle: typeof eventTitle === 'string' ? eventTitle.trim() : undefined,
      eventDate: typeof eventDate === 'string' ? eventDate.trim() : undefined,
      eventTime: typeof eventTime === 'string' ? eventTime.trim() : undefined,
      eventGrades: typeof eventGrades === 'string' ? eventGrades.trim() : undefined,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined
    };

    console.log('Workshop/Webinar registration:', { ...payload, email: payload.email });

    const eventLabel = payload.eventTitle ?? `${payload.eventType === 'workshop' ? 'Workshop' : 'Webinar'}`;
    const eventDetail =
      [payload.eventDate, payload.eventTime].filter(Boolean).length > 0
        ? ` on ${[payload.eventDate, payload.eventTime].filter(Boolean).join(' at ')}`
        : '';

    // 1. Confirmation email to registrant
    const userSubject = `Registration confirmed – ${eventLabel}`;
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">Registration received</h2>
        <p>Hi ${escapeHtml(payload.parentName)},</p>
        <p>Thank you for registering for <strong>${escapeHtml(eventLabel)}</strong>${escapeHtml(eventDetail)}.</p>
        <p><strong>Registrant:</strong> ${escapeHtml(payload.parentName)}<br>
        <strong>Student:</strong> ${escapeHtml(payload.studentName)} (Grade ${escapeHtml(payload.grade)})<br>
        <strong>School district:</strong> ${escapeHtml(payload.schoolDistrict)}</p>
        <p>We will confirm your spot shortly. If you have any questions, contact us at ${CONTACT_INFO.email}.</p>
        <p>— GrowWise Educational Services</p>
      </div>
    `;
    const userText = `Hi ${payload.parentName},\n\nThank you for registering for ${eventLabel}${eventDetail}.\n\nRegistrant: ${payload.parentName}\nStudent: ${payload.studentName} (Grade ${payload.grade})\nSchool district: ${payload.schoolDistrict}\n\nWe will confirm your spot shortly. Contact us at ${CONTACT_INFO.email} with any questions.\n\n— GrowWise Educational Services`;

    const userResult = await sendEmail({
      to: payload.email,
      subject: userSubject,
      html: userHtml,
      text: userText
    });

    if (!userResult.success) {
      console.warn('Workshop registration: user confirmation email skipped.', userResult.error);
    }

    // 2. Notification email to business
    const businessSubject = `New workshop/webinar registration – ${payload.parentName}`;
    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">New workshop/webinar registration</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Parent:</strong> ${escapeHtml(payload.parentName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>Student:</strong> ${escapeHtml(payload.studentName)} (Grade ${escapeHtml(payload.grade)})</p>
          <p><strong>School district:</strong> ${escapeHtml(payload.schoolDistrict)}</p>
          <p><strong>How they heard:</strong> ${escapeHtml(payload.howDidYouHear)}</p>
          <p><strong>Event type:</strong> ${payload.eventType}</p>
          ${payload.eventTitle ? `<p><strong>Event:</strong> ${escapeHtml(payload.eventTitle)}</p>` : ''}
          ${payload.eventDate ? `<p><strong>Date:</strong> ${escapeHtml(payload.eventDate)}</p>` : ''}
          ${payload.eventTime ? `<p><strong>Time:</strong> ${escapeHtml(payload.eventTime)}</p>` : ''}
          ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date(payload.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `;
    const businessText = [
      'New workshop/webinar registration',
      `Parent: ${payload.parentName}`,
      `Email: ${payload.email}`,
      `Student: ${payload.studentName} (Grade ${payload.grade})`,
      `School district: ${payload.schoolDistrict}`,
      `How they heard: ${payload.howDidYouHear}`,
      `Event type: ${payload.eventType}`,
      payload.eventTitle && `Event: ${payload.eventTitle}`,
      payload.eventDate && `Date: ${payload.eventDate}`,
      payload.eventTime && `Time: ${payload.eventTime}`,
      payload.phone && `Phone: ${payload.phone}`,
      `Submitted: ${new Date(payload.timestamp).toLocaleString()}`
    ]
      .filter(Boolean)
      .join('\n');

    const businessResult = await sendEmail({
      to: CONTACT_INFO.businessEmail,
      subject: businessSubject,
      html: businessHtml,
      text: businessText
    });

    if (!businessResult.success) {
      console.warn('Workshop registration: business notification email skipped.', businessResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration received. We will confirm your spot shortly.'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
