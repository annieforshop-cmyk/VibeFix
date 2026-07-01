import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Browser-only Supabase client using the public anon key — used only for
 * auth (sign up / sign in / session). It never touches app tables directly:
 * those have no RLS policies, so only the server-side service-role client
 * (lib/supabase/server.ts) can read/write them.
 * Returns null when Supabase isn't configured, so auth UI can hide itself.
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cachedClient = url && key ? createClient(url, key) : null;
  return cachedClient;
}

/** Current user's access token, for calling our own API routes as an authenticated user. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
