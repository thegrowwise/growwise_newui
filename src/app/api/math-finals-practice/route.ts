import { NextResponse } from 'next/server'
import { CONTACT_INFO } from '@/lib/constants'
import {
  isBrevoTransactionalReady,
  sendBrevoTransactionalEmail,
  upsertMathFinalsLeadInBrevo,
} from '@/lib/brevo'
import { sendEmail, type EmailAttachment, type SendEmailResult } from '@/lib/email'
import {
  isMathFinalsPracticeInterest,
  MATH_FINALS_INTEREST_LABELS,
  type MathFinalsPracticeInterest,
} from '@/data/math-finals-practice-interest'
import { MATH_FINALS_PRACTICE_SUBJECTS, type MathFinalsPracticeSubject } from '@/data/math-finals-practice-subjects'

export const maxDuration = 60

const BREVO_RETRY_DELAY_MS = 450
const BREVO_REPLY_TO = { email: CONTACT_INFO.email, name: 'GrowWise' } as const

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_AGENDA_BYTES = 5 * 1024 * 1024

type ParsedMathFinalsForm = {
  interest: MathFinalsPracticeInterest
  parentName: string
  studentName: string
  grade: string
  school: string
  subject: MathFinalsPracticeSubject
  parentEmail: string
  parentPhone: string
  notes: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function err(msg: string, status: number) {
  return NextResponse.json({ success: false, error: msg }, { status })
}

/**
 * Brevo transactional first (automation + deliverability), then SMTP — same as contact / summer-camp.
 */
async function sendMathFinalsEmailWithFallback(opts: {
  to: string
  subject: string
  html: string
  text: string
  attachments?: EmailAttachment[]
}): Promise<SendEmailResult> {
  if (isBrevoTransactionalReady()) {
    let lastErr: string | undefined
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, BREVO_RETRY_DELAY_MS))
      }
      const brevo = await sendBrevoTransactionalEmail({
        ...opts,
        replyTo: BREVO_REPLY_TO,
      })
      if (brevo.success) return brevo
      lastErr = brevo.error
      console.error(
        `[math-finals-practice] Brevo transactional attempt ${attempt + 1}/2 failed:`,
        brevo.error
      )
    }
    console.error('[math-finals-practice] Brevo failed after retry; SMTP fallback.', lastErr)
  } else {
    console.warn(
      '[math-finals-practice] Brevo not configured (BREVO_API_KEY + BREVO_SENDER_EMAIL); using SMTP if configured.'
    )
  }
  return sendEmail({
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: BREVO_REPLY_TO.email,
    ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
  })
}

function userFollowUpParagraphHtml(interest: MathFinalsPracticeInterest): string {
  switch (interest) {
    case 'structured_prep':
      return 'Our team will follow up about the <strong>four-session structured finals prep</strong> course (paid)—scheduling, scope, and next steps.'
    case 'free_sunday':
      return 'We will follow up to confirm your <strong>complimentary Sunday finals</strong> session in the <strong>12–1 pm</strong> time window (exact slot when we contact you).'
  }
}

function userFollowUpParagraphPlain(interest: MathFinalsPracticeInterest): string {
  switch (interest) {
    case 'structured_prep':
      return 'Our team will follow up about the four-session structured finals prep course (paid)—scheduling, scope, and next steps.'
    case 'free_sunday':
      return 'We will follow up to confirm your complimentary Sunday finals session in the 12–1 pm time window (exact slot when we contact you).'
  }
}

function parseForm(fields: {
  interest: string
  parentName: string
  studentName: string
  grade: string
  school: string
  subject: string
  parentEmail: string
  parentPhone: string
  notes: string
}):
  | { ok: true; data: ParsedMathFinalsForm }
  | { ok: false; error: string; status: number } {
  const interestRaw = fields.interest.trim()
  if (!isMathFinalsPracticeInterest(interestRaw)) {
    return { ok: false, error: 'Please select which option you want.', status: 400 }
  }
  const interest = interestRaw

  const parentName = fields.parentName.trim()
  const studentName = fields.studentName.trim()
  const grade = fields.grade.trim()
  const school = fields.school.trim()
  const subject = fields.subject.trim()
  const parentEmail = fields.parentEmail.trim()
  const parentPhone = fields.parentPhone.trim()
  const notes = fields.notes.trim()

  if (!parentName) return { ok: false, error: 'Parent name is required', status: 400 }
  if (!studentName) return { ok: false, error: 'Student name is required', status: 400 }
  if (!grade) return { ok: false, error: 'Grade is required', status: 400 }
  if (!school) return { ok: false, error: "School is required", status: 400 }
  if (!parentEmail) return { ok: false, error: 'Email is required', status: 400 }
  if (!EMAIL_REGEX.test(parentEmail)) return { ok: false, error: 'Please enter a valid email address', status: 400 }
  if (!parentPhone) return { ok: false, error: 'Phone is required', status: 400 }
  if (!MATH_FINALS_PRACTICE_SUBJECTS.includes(subject as MathFinalsPracticeSubject)) {
    return { ok: false, error: 'Please select a current math course.', status: 400 }
  }

  return {
    ok: true,
    data: {
      interest,
      parentName,
      studentName,
      grade,
      school,
      subject: subject as MathFinalsPracticeSubject,
      parentEmail: parentEmail.toLowerCase(),
      parentPhone,
      notes: notes || '',
    },
  }
}

function parseFormDataFields(fd: globalThis.FormData) {
  const getS = (k: string) => (typeof fd.get(k) === 'string' ? (fd.get(k) as string) : '')
  return {
    interestRaw: getS('interest'),
    parentName: getS('parentName'),
    studentName: getS('studentName'),
    grade: getS('grade'),
    school: getS('school'),
    subject: getS('subject'),
    parentEmail: getS('parentEmail'),
    parentPhone: getS('parentPhone'),
    notes: getS('notes'),
    agendaFile: (() => {
      const file = fd.get('q4Agenda')
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_AGENDA_BYTES) {
          return { error: 'Upload must be 5 MB or smaller.' as const }
        }
        return { file }
      }
      return { file: null as File | null }
    })(),
  }
}

export async function POST(request: Request) {
  try {
    const contentType = (request.headers.get('content-type') ?? '').toLowerCase()
    let interestRaw: string
    let parentName: string
    let studentName: string
    let grade: string
    let school: string
    let subject: string
    let parentEmail: string
    let parentPhone: string
    let notes: string
    let agendaFile: File | null = null

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>
      interestRaw = typeof body.interest === 'string' ? body.interest : ''
      parentName = typeof body.parentName === 'string' ? body.parentName : ''
      studentName = typeof body.studentName === 'string' ? body.studentName : ''
      grade = typeof body.grade === 'string' ? body.grade : ''
      school = typeof body.school === 'string' ? body.school : ''
      subject = typeof body.subject === 'string' ? body.subject : ''
      parentEmail = typeof body.parentEmail === 'string' ? body.parentEmail : ''
      parentPhone = typeof body.parentPhone === 'string' ? body.parentPhone : ''
      notes = typeof body.notes === 'string' ? body.notes : ''
    } else {
      /** Browser `fetch`+`FormData` is multipart, but `Content-Type` can be empty in some clients — always use formData for non-JSON. */
      const formData = await request.formData()
      const p = parseFormDataFields(formData)
      const ag = p.agendaFile
      if ('error' in ag) {
        return err(ag.error ?? 'Invalid file upload.', 400)
      }
      agendaFile = ag.file
      interestRaw = p.interestRaw
      parentName = p.parentName
      studentName = p.studentName
      grade = p.grade
      school = p.school
      subject = p.subject
      parentEmail = p.parentEmail
      parentPhone = p.parentPhone
      notes = p.notes
    }

    const parsed = parseForm({
      interest: interestRaw,
      parentName,
      studentName,
      grade,
      school,
      subject,
      parentEmail,
      parentPhone,
      notes,
    })
    if (!parsed.ok) {
      return err(parsed.error, parsed.status)
    }
    const {
      interest,
      parentName: pName,
      studentName: sName,
      grade: g,
      school: sch,
      subject: subj,
      parentEmail: pEmail,
      parentPhone: pPhone,
      notes: notesVal,
    } = parsed.data

    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? ''
    const timestamp = new Date().toISOString()
    const interestLabel = MATH_FINALS_INTEREST_LABELS[interest]

    let agendaAttachment: EmailAttachment | undefined
    if (agendaFile) {
      const buf = Buffer.from(await agendaFile.arrayBuffer())
      const safeName = agendaFile.name.replace(/[^a-zA-Z0-9._-]+/g, '_') || 'q4-agenda'
      agendaAttachment = {
        filename: safeName,
        content: buf,
        contentType: agendaFile.type || 'application/octet-stream',
      }
    }

    const record = {
      interest,
      interestLabel,
      parentName: pName,
      studentName: sName,
      grade: g,
      school: sch,
      subject: subj,
      parentEmail: pEmail,
      parentPhone: pPhone,
      notes: notesVal || undefined,
      q4AgendaAttached: Boolean(agendaAttachment),
      event: 'HS Math Finals — form',
      timestamp,
      ip: ip || undefined,
    }

    console.log('[math-finals-practice]', { ...record, parentPhone: '[redacted]' })

    const userSubject = 'We received your request | GrowWise'
    const followUpHtml = userFollowUpParagraphHtml(interest)
    const agendaLineHtml = agendaAttachment
      ? '<p>We received your <strong>Quarter 4 topics or class outline</strong> upload.</p>'
      : ''
    const agendaLinePlain = agendaAttachment
      ? 'We received your Quarter 4 topics or class outline upload.\n\n'
      : ''

    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">Request received</h2>
        <p>Hi ${escapeHtml(pName)},</p>
        <p>Thank you for reaching out about math finals support at GrowWise.</p>
        <p><strong>Your request:</strong> ${escapeHtml(interestLabel)}</p>
        ${agendaLineHtml}
        <p>${followUpHtml}</p>
        <p>If you have questions in the meantime, contact us at ${escapeHtml(CONTACT_INFO.email)} or ${escapeHtml(CONTACT_INFO.phone)}.</p>
        <p>— GrowWise</p>
      </div>
    `
    const userText = `Hi ${pName},\n\nThank you for reaching out about math finals support at GrowWise.\n\nYour request: ${interestLabel}\n\n${agendaLinePlain}${userFollowUpParagraphPlain(interest)}\n\nQuestions: ${CONTACT_INFO.email} or ${CONTACT_INFO.phone}.\n\n— GrowWise`

    const brevoReady = isBrevoTransactionalReady()

    const userResult = await sendMathFinalsEmailWithFallback({
      to: pEmail,
      subject: userSubject,
      html: userHtml,
      text: userText,
    })
    if (!userResult.success) {
      console.error(
        '[math-finals-practice] User confirmation email failed after Brevo + SMTP:',
        userResult.error
      )
      return NextResponse.json(
        {
          success: false,
          error: `We could not send your confirmation email. Please try again in a few minutes or contact ${CONTACT_INFO.email}.`,
        },
        { status: 503 }
      )
    }

    const businessSubject = `Math finals lead (${interest}) — ${pName}`
    const agendaNote = agendaAttachment
      ? `<p><strong>Q4 topics / outline:</strong> attached (${escapeHtml(agendaAttachment.filename)})</p>`
      : '<p><strong>Q4 topics / outline:</strong> not uploaded</p>'

    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F396D;">New math finals lead</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Interest:</strong> ${escapeHtml(interestLabel)} (${escapeHtml(interest)})</p>
          <p><strong>Parent:</strong> ${escapeHtml(pName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(pEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(pPhone)}</p>
          <p><strong>Student:</strong> ${escapeHtml(sName)}</p>
          <p><strong>Grade:</strong> ${escapeHtml(g)}</p>
          <p><strong>School:</strong> ${sch ? escapeHtml(sch) : 'Not provided'}</p>
          <p><strong>Current math course:</strong> ${escapeHtml(subj)}</p>
          ${agendaNote}
          ${notesVal ? `<p><strong>Notes:</strong> ${escapeHtml(notesVal)}</p>` : ''}
          <p><strong>Submitted (UTC):</strong> ${escapeHtml(timestamp)}</p>
          ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ''}
        </div>
      </div>
    `
    const businessText = [
      'New math finals lead',
      `Interest: ${interestLabel} (${interest})`,
      `Parent: ${pName}`,
      `Email: ${pEmail}`,
      `Phone: ${pPhone}`,
      `Student: ${sName}`,
      `Grade: ${g}`,
      `School: ${sch}`,
      `Current math course: ${subj}`,
      `Q4 topics / outline: ${agendaAttachment ? `attached (${agendaAttachment.filename})` : 'not uploaded'}`,
      notesVal && `Notes: ${notesVal}`,
      `Submitted: ${timestamp}`,
    ]
      .filter(Boolean)
      .join('\n')

    const businessResult = await sendMathFinalsEmailWithFallback({
      to: CONTACT_INFO.businessEmail,
      subject: businessSubject,
      html: businessHtml,
      text: businessText,
      ...(agendaAttachment ? { attachments: [agendaAttachment] } : {}),
    })
    if (!businessResult.success) {
      console.warn(
        '[math-finals-practice] Business notification failed (user email already sent):',
        businessResult.error
      )
    }

    let brevoListResult: SendEmailResult | undefined
    if (brevoReady) {
      brevoListResult = await upsertMathFinalsLeadInBrevo({
        email: pEmail,
        interestKey: interest,
        interestLabel,
        parentName: pName,
        studentName: sName,
        grade: g,
        school: sch,
        subject: subj,
        phone: pPhone,
        notes: notesVal,
        q4AgendaUploaded: Boolean(agendaAttachment),
        submittedAtIso: timestamp,
      })
      if (!brevoListResult.success) {
        console.warn(
          '[math-finals-practice] Brevo contact/list sync failed (emails may have sent).',
          brevoListResult.error
        )
      }
    }

    const payload: Record<string, unknown> = {
      success: true,
      message: 'We received your request. Our team will follow up shortly.',
    }
    if (process.env.NODE_ENV === 'development') {
      payload.emailDebug = {
        userEmailSent: userResult.success,
        businessEmailSent: businessResult.success,
        brevoTransactionalConfigured: brevoReady,
        ...(brevoReady && brevoListResult
          ? {
              brevoListOrContactSync: brevoListResult.success,
              ...(brevoListResult.error ? { brevoListError: brevoListResult.error } : {}),
            }
          : {}),
      }
    }

    return NextResponse.json(payload)
  } catch {
    return err('An error occurred. Please try again.', 500)
  }
}
