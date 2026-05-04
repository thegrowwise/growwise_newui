import { NextResponse } from 'next/server'
import { CONTACT_INFO } from '@/lib/constants'
import { isBrevoTransactionalReady, sendBrevoTransactionalEmail } from '@/lib/brevo'
import { sendEmail, type SendEmailResult } from '@/lib/email'
import { matchResourceForCapture, normalizeLeadEmail } from '@/data/resources'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BREVO_RETRY_DELAY_MS = 450
const BREVO_REPLY_TO = { email: CONTACT_INFO.email, name: 'GrowWise' } as const
const LOG_PREFIX = '[capture-lead]'

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

async function sendResourceEmailWithFallback(opts: {
  to: string
  subject: string
  html: string
  text: string
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
        `${LOG_PREFIX} Brevo transactional attempt ${attempt + 1}/2 failed:`,
        brevo.error
      )
    }
    console.error(`${LOG_PREFIX} Brevo failed after retry; SMTP fallback.`, lastErr)
  } else {
    console.warn(
      `${LOG_PREFIX} Brevo not configured (BREVO_API_KEY + BREVO_SENDER_EMAIL); using SMTP if configured.`
    )
  }
  return sendEmail({
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: BREVO_REPLY_TO.email,
  })
}

type Body = {
  email?: unknown
  resourceId?: unknown
  driveUrl?: unknown
}

export async function POST(req: Request): Promise<Response> {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return err('Invalid JSON body', 400)
  }

  const emailRaw = typeof body.email === 'string' ? body.email : ''
  const resourceId = typeof body.resourceId === 'string' ? body.resourceId : ''
  const driveUrl = typeof body.driveUrl === 'string' ? body.driveUrl : ''

  if (!emailRaw.trim() || !resourceId.trim() || !driveUrl.trim()) {
    return err('email, resourceId, and driveUrl are required', 400)
  }

  if (!EMAIL_REGEX.test(emailRaw.trim())) {
    return err('Invalid email address', 400)
  }

  const normalizedEmail = normalizeLeadEmail(emailRaw)
  const matched = matchResourceForCapture(resourceId, driveUrl)
  if (!matched) {
    return err('Invalid resource', 400)
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    console.error(`${LOG_PREFIX} Supabase admin client not configured (set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY)`)
    return err('Server configuration error', 503)
  }

  const { data: leadRow, error: leadErr } = await supabase
    .from('free_resource_leads')
    .upsert({ email: normalizedEmail }, { onConflict: 'email' })
    .select('id')
    .single()

  if (leadErr || !leadRow?.id) {
    console.error(`${LOG_PREFIX} Lead upsert failed`, leadErr?.message)
    return err('Could not save your request', 503)
  }

  const leadId = leadRow.id as string

  const { error: dlErr } = await supabase.from('resource_downloads').insert({
    lead_id: leadId,
    resource_id: matched.id,
    resource_category: matched.category,
  })

  if (dlErr) {
    console.error(`${LOG_PREFIX} Download insert failed`, dlErr.message)
    return err('Could not save your request', 503)
  }

  const linkHtml = escapeHtml(matched.driveUrl)
  const resourceTitle = escapeHtml(matched.name)
  const subject = `Your free resource: ${matched.name}`

  const html = `
    <p>Thanks for your interest in GrowWise.</p>
    <p>Here is the link you requested for <strong>${resourceTitle}</strong>:</p>
    <p><a href="${linkHtml}">${linkHtml}</a></p>
    <p>If the link does not work, copy and paste the URL into your browser.</p>
  `.trim()

  const text = [
    'Thanks for your interest in GrowWise.',
    '',
    `Here is the link for "${matched.name}":`,
    matched.driveUrl,
    '',
    'If the link does not work, copy and paste the URL into your browser.',
  ].join('\n')

  const sendResult = await sendResourceEmailWithFallback({
    to: normalizedEmail,
    subject,
    html,
    text,
  })

  if (!sendResult.success) {
    console.error(`${LOG_PREFIX} Email send failed`, sendResult.error)
    return NextResponse.json(
      { success: false, error: 'Could not send email. Please try again later.' },
      { status: 503 }
    )
  }

  return NextResponse.json({ success: true })
}
