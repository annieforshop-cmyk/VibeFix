import { getSupabaseAdmin } from "./supabase/server";

/** Toggles an anonymous device's "interested" mark on a problem.
 * Falls back to echoing the client's own optimistic toggle (no persisted
 * count) when Supabase isn't configured, so the collect/save UI still
 * works correctly in local dev and preview environments. */
export async function toggleCollect(
  deviceId: string,
  problemSlugOrId: string,
  wasCollected = false
): Promise<{ collected: boolean; count: number | null }> {
  const supabase = getSupabaseAdmin();
  // count: null signals "not persisted" so callers keep their own optimistic count
  // instead of overwriting it with a fake zero.
  if (!supabase) return { collected: !wasCollected, count: null };

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id")
    .or(`slug.eq.${problemSlugOrId},id.eq.${problemSlugOrId}`)
    .maybeSingle();
  if (problemError) throw problemError;
  if (!problem) throw new Error("problem not found");

  const { data: existing, error: existingError } = await supabase
    .from("collections")
    .select("id")
    .eq("device_id", deviceId)
    .eq("problem_id", problem.id)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase.from("collections").delete().eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("collections").insert({ device_id: deviceId, problem_id: problem.id });
    if (error) throw error;
  }

  const { count, error: countError } = await supabase
    .from("collections")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", problem.id);
  if (countError) throw countError;

  return { collected: !existing, count: count ?? 0 };
}

/** Lists the problem slugs (falling back to id) an identity (device or
 * `user:<uuid>`) has collected — used to restore saved state for a
 * logged-in user across devices. */
export async function listCollectedIdentifiers(deviceId: string): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("collections")
    .select("problems(slug, id)")
    .eq("device_id", deviceId);
  if (error) throw error;

  return ((data ?? []) as unknown as { problems: { slug: string | null; id: string } | null }[])
    .map((row) => row.problems?.slug ?? row.problems?.id)
    .filter((id): id is string => Boolean(id));
}
