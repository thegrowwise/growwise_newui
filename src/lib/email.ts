/**
 * Minimal email sender using existing SMTP config (SMTP_*, FROM_EMAIL in .env).
 * No-op with console warning if config is missing.
 */

import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text } = options;
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME ?? 'GrowWise';

  if (!fromEmail) {
    console.warn('[email] FROM_EMAIL not set; skipping send.');
    return { success: false, error: 'Email not configured' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required); skipping send.');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const result = await transporter.sendMail({
      from: fromName ? `"${fromName}" <${fromEmail}>` : fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    });
    return { success: true, messageId: result.messageId };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Send failed';
    console.error('[email] Send failed:', error);
    return { success: false, error };
  }
}
