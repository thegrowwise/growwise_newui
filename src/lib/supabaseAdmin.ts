import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with service role (bypasses RLS).
 * Used by Route Handlers that insert into tables without anon policies.
 *
 * URL resolution matches common Vercel setups: `NEXT_PUBLIC_SUPABASE_URL` if set,
 * else `SUPABASE_URL` (same as growwise_backend / shared project env).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) {
    return null
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
