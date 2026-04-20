import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getChatbotSupabaseEnv } from './env';

let adminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the **service role** key.
 * Do not import this module from client components or shared code that ships to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const { url, serviceRoleKey } = getChatbotSupabaseEnv();

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return adminClient;
}
