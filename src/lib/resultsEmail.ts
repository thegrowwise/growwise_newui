import { sendBrevoTransactionalEmail, isBrevoTransactionalReady } from '@/lib/brevo';
import { PREDICTION_LABELS, type AwardTier } from '@/lib/award';
import type { ErrorPattern } from '@/lib/patterns';

const TIER_COPY: Record<AwardTier, { emoji: string; title: string }> = {
  double_detective: { emoji: '🏆', title: 'Double Detective' },
  parent_detective: { emoji: '🔍', title: 'Parent Detective' },
  self_aware:       { emoji: '⭐', title: 'Self-Aware Scholar' },
  keep_digging:     { emoji: '🌱', title: 'Keep Digging' },
};

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function patternListHtml(patterns: ErrorPattern[]): string {
  if (patterns.length === 0) return '';
  return patterns
    .map(
      (p) =>
        `<li style="margin-bottom:6px"><strong>${escHtml(p.title)}</strong> — ${escHtml(p.description)}</li>`,
    )
    .join('');
}

function patternListText(patterns: ErrorPattern[]): string {
  return patterns.map((p) => `• ${p.title}: ${p.description}`).join('\n');
}

export async function sendResultsEmail(opts: {
  parentEmail: string;
  studentName: string;
  grade: number;
  subject: string;
  confirmedPatterns: ErrorPattern[];
  possiblePatterns: ErrorPattern[];
  awardTier: AwardTier;
  parentPrediction: string | string[];
  studentPrediction: string;
  calendlyUrl: string;
}): Promise<void> {
  if (!isBrevoTransactionalReady()) {
    console.warn('[resultsEmail] Brevo not configured — skipping results email');
    return;
  }

  const tier = TIER_COPY[opts.awardTier];
  const subjectLabel = opts.subject === 'both' ? 'Math & English' : opts.subject.charAt(0).toUpperCase() + opts.subject.slice(1);

  const parentPredLabels = Array.isArray(opts.parentPrediction)
    ? opts.parentPrediction.map((v) => PREDICTION_LABELS[v] ?? v).join(', ')
    : (PREDICTION_LABELS[opts.parentPrediction] ?? opts.parentPrediction);

  const studentPredLabel = PREDICTION_LABELS[opts.studentPrediction] ?? opts.studentPrediction;

  const confirmedHtml = opts.confirmedPatterns.length > 0
    ? `<h3 style="color:#b91c1c;margin:20px 0 8px">Confirmed Patterns</h3><ul style="padding-left:20px">${patternListHtml(opts.confirmedPatterns)}</ul>`
    : `<p style="color:#166534;font-weight:600">✅ No major gaps found — ${escHtml(opts.studentName)} answered well across all areas!</p>`;

  const possibleHtml = opts.possiblePatterns.length > 0
    ? `<h3 style="color:#92400e;margin:20px 0 8px">Possible Patterns (seen once)</h3><ul style="padding-left:20px">${patternListHtml(opts.possiblePatterns)}</ul>`
    : '';

  const predictionHtml = (opts.parentPrediction || opts.studentPrediction)
    ? `<table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0;color:#64748b;width:160px">Parent predicted:</td><td style="font-weight:600">${escHtml(parentPredLabels || '—')}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">${escHtml(opts.studentName)} predicted:</td><td style="font-weight:600">${escHtml(studentPredLabel || '—')}</td></tr>
      </table>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:#1F396D;padding:28px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px">Mistake Detective Results</h1>
      <p style="color:#93c5fd;margin:4px 0 0;font-size:14px">${escHtml(opts.studentName)} · Grade ${opts.grade} · ${escHtml(subjectLabel)}</p>
    </div>
    <div style="padding:28px 32px">
      <div style="background:#f0f9ff;border-left:4px solid #1F396D;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:20px">
        <p style="margin:0;font-size:22px">${tier.emoji} <strong>${escHtml(tier.title)}</strong></p>
        <p style="margin:4px 0 0;font-size:14px;color:#64748b">Detective Badge Earned</p>
      </div>

      ${confirmedHtml}
      ${possibleHtml}

      ${predictionHtml.length > 0 ? `<h3 style="color:#1F396D;margin:24px 0 8px">The Detective Comparison</h3>${predictionHtml}` : ''}

      <div style="margin:28px 0 0;padding:24px;background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;text-align:center">
        <p style="font-weight:700;color:#1F396D;font-size:16px;margin:0 0 8px">Ready to close these gaps?</p>
        <p style="color:#64748b;font-size:14px;margin:0 0 16px">Book a free 30-min Mistake Busting Workshop to fix the exact patterns we found.</p>
        <a href="${escHtml(opts.calendlyUrl)}" style="background:#F16112;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">Book Free Workshop →</a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8">
      GrowWise School · <a href="https://growwiseschool.org" style="color:#94a3b8">growwiseschool.org</a>
    </div>
  </div>
</body>
</html>`;

  const confirmedText = opts.confirmedPatterns.length > 0
    ? `Confirmed Patterns:\n${patternListText(opts.confirmedPatterns)}`
    : `No major gaps found — ${opts.studentName} answered well!`;

  const text = `Mistake Detective Results for ${opts.studentName} (Grade ${opts.grade} ${subjectLabel})

Badge: ${tier.emoji} ${tier.title}

${confirmedText}
${opts.possiblePatterns.length > 0 ? `\nPossible Patterns:\n${patternListText(opts.possiblePatterns)}` : ''}

Book a free Mistake Busting Workshop: ${opts.calendlyUrl}

GrowWise School — growwiseschool.org`;

  await sendBrevoTransactionalEmail({
    to: opts.parentEmail,
    subject: `${opts.studentName}'s Mistake Detective Results 🔍`,
    html,
    text,
  });
}
