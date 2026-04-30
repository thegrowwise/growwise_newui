# Free resources feature — status

## Architecture (locked)

- **Middleware:** Clean URLs like `/free-resources` are listed in `PATHS_NEEDING_IMPLICIT_LOCALE_PREFIX` in [`src/middleware.ts`](../src/middleware.ts) so Next resolves `app/[locale]/free-resources` (same pattern as other locale-only pages that lack an `app/<segment>` shim).
- **Capture:** Next.js only — [`src/app/api/capture-lead/route.ts`](../src/app/api/capture-lead/route.ts). No growwise_backend Express route for this flow.
- **Database schema:** In repo **growwise_backend**, file **`supabase_free_resources.sql`** (repo root) — run against the Supabase project used by the site (`psql` or SQL editor).
- **Supabase client:** `@supabase/supabase-js` via [`src/lib/supabaseAdmin.ts`](../src/lib/supabaseAdmin.ts). **URL:** `NEXT_PUBLIC_SUPABASE_URL` **or** `SUPABASE_URL` (whichever is already on Vercel / matches the backend). **Key:** `SUPABASE_SERVICE_ROLE_KEY` (server-only).

## Data contract

- Catalog: [`src/data/resources.json`](../src/data/resources.json) + [`src/data/resources.ts`](../src/data/resources.ts). Each item has stable **`id`** (URL-safe slug).
- **POST body:** `{ email, resourceId, driveUrl }` — `resourceId` must match `id`; `driveUrl` must match that row (tamper check).
- **Email in DB:** `email.trim().toLowerCase()` only (see migration comment block).

## `resource_downloads`

- **`resource_id`** stores the **slug** (`id`), not marketing display `name`.
- **`resource_category`** denormalized from JSON for filtering/analytics.

## Rate limiting

- **Posture (v1):** No automated rate limit in code. If SMTP/Brevo cost or abuse spikes, add IP or token bucket (e.g. Edge middleware, Upstash) and update this section.

## QA checklist

- [ ] SQL migration applied in Supabase.
- [ ] Vercel env: Supabase URL (`NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`) + `SUPABASE_SERVICE_ROLE_KEY` (often already set for this project); Brevo or SMTP for mail.
- [ ] Open `/free-resources`, each tab filters cards.
- [ ] Download → email modal → submit → **“Check your email!”**; email received with Drive link.
- [ ] Invalid `resourceId` / `driveUrl` returns 400.
- [ ] Rows in `free_resource_leads` and `resource_downloads` with correct `email` and `resource_id`.
