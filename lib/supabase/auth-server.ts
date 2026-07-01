import { getSupabaseAdmin } from "./server";

/** Resolves the authenticated user id from a request's `Authorization: Bearer <token>`
 * header (a Supabase Auth access token). Returns null if missing/invalid/unconfigured. */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
