import { NextRequest, NextResponse } from 'next/server';
import { llmService } from '@/lib/llm';
import { clientIpFrom, isAllowed } from '@/lib/chatRateLimit';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Whitelisted page context ids — must match `ChatPageContextId` in `chatbotPageContext.ts`. */
const ALLOWED_PAGE_CONTEXT_IDS = new Set([
  'default',
  'campsHub',
  'campsSummer',
  'campsWinter',
  'campSlug',
  'assessment',
  'enroll',
  'contact',
  'courseTopic',
]);

/** Cap on how much page-specific hint text we'll forward to the LLM (tokens stay bounded). */
const MAX_PAGE_HINT_LENGTH = 280;

/**
 * Input limits — sized for a marketing chatbot. The longest legitimate user
 * question in the suggestion chips is ~80 chars; 600 leaves ~7× headroom while
 * capping per-call input tokens to ~150. History is server-trimmed to the last
 * 8 turns since page context is server-injected (we don't need long memory).
 */
const MAX_USER_MESSAGE_CHARS = Number(process.env.CHAT_MAX_USER_CHARS) || 600;
const MAX_HISTORY_ITEMS = Number(process.env.CHAT_HISTORY_LIMIT) || 8;
const MAX_HISTORY_ITEM_CHARS = 2000;
/** Hard ceiling on raw request body size before we attempt to parse JSON. */
const MAX_BODY_BYTES = 16 * 1024;

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function sanitizePageHint(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const cleaned = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_PAGE_HINT_LENGTH);
  return cleaned ? cleaned : undefined;
}

/**
 * Strict whitelist for conversation history. The client cannot inject
 * `role: 'system'` (or anything else) — only `'user'` and `'assistant'`
 * survive, so prompt-injection via spoofed system messages is blocked at the
 * boundary. Each item is also length-clipped before we count it.
 */
function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== 'user' && role !== 'assistant') continue;
    if (typeof content !== 'string') continue;
    const trimmed = content.trim().slice(0, MAX_HISTORY_ITEM_CHARS);
    if (!trimmed) continue;
    out.push({ role, content: trimmed });
  }
  return out.slice(-MAX_HISTORY_ITEMS);
}

export async function POST(request: NextRequest) {
  try {
    // Per-IP rate limit (P0). Done before we read the body so a flood of
    // oversized payloads still gets short-circuited.
    if (!isAllowed('chat', clientIpFrom(request))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 },
      );
    }

    // Read raw text first so we can enforce a body-size ceiling before JSON
    // parsing pulls a multi-MB payload into memory.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return bad('Payload too large.', 413);
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return bad('Invalid JSON body.');
    }

    const messageRaw = body.message;
    const message =
      typeof messageRaw === 'string' ? messageRaw.trim() : '';
    if (!message) {
      return bad('Message is required and must be a string');
    }
    if (message.length > MAX_USER_MESSAGE_CHARS) {
      return bad(
        `Message too long. Limit is ${MAX_USER_MESSAGE_CHARS} characters.`,
      );
    }

    const history = sanitizeHistory(body.conversationHistory);

    // Append the current user message. Note: we do NOT trust any role coming
    // from the history filter — it has already been narrowed to user|assistant.
    const messages: ChatMessage[] = [...history, { role: 'user', content: message }];

    // Append a tiny page-specific hint to the system prompt — only when the
    // client sent a recognized context id, and only after sanitizing the hint.
    const pageContextId = body.pageContextId;
    const ctxOk =
      typeof pageContextId === 'string' && ALLOWED_PAGE_CONTEXT_IDS.has(pageContextId);
    const safeHint = ctxOk ? sanitizePageHint(body.pageContextHint) : undefined;

    const response = await llmService.generateResponse(messages, safeHint);

    if (response.error) {
      const fallbackResponse = llmService.getFallbackResponse(message);
      return NextResponse.json({
        message: fallbackResponse,
        isFallback: true,
        error: response.error,
      });
    }

    return NextResponse.json({
      message: response.content,
      isFallback: false,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          "I'm experiencing technical difficulties. Please try again or contact GrowWise directly for assistance.",
      },
      { status: 500 },
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
