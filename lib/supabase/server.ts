import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Server-only Supabase client using the service-role key. Never import this
 * from a "use client" component — it must stay on the server.
 * Returns null when Supabase isn't configured, so the app can fall back to
 * the bundled static sample data during local development.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cachedClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cachedClient;
}
