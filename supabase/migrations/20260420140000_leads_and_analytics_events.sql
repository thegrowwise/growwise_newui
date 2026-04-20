-- GWA-163: chatbot leads + analytics (RLS on, no public write policies; service role bypasses RLS)

-- -----------------------------------------------------------------------------
-- leads: chatbot / lead capture (service writes via server-only client)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'new',
  page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  recaptcha_score DOUBLE PRECISION,
  conversation_excerpt TEXT,
  email TEXT,
  phone TEXT,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_page_url_idx ON public.leads (page_url);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.leads IS 'Chatbot/lead pipeline; writes only via service role from server.';

-- -----------------------------------------------------------------------------
-- analytics_events: client- or server-sent events (inserts via service role only)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  event TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx ON public.analytics_events (session_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_event_idx ON public.analytics_events (event);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.analytics_events IS 'Structured analytics events; no anonymous public write policies.';

-- Intentionally no GRANT/CREATE POLICY for anon/authenticated: RLS blocks direct access.
-- Supabase service role bypasses RLS for backend jobs and Next.js server routes.
