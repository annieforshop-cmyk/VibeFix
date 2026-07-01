import { getSupabaseAdmin } from "./supabase/server";

/** Toggles an anonymous device's "interested" mark on a problem.
 * Falls back to a no-op count of 0 when Supabase isn't configured. */
export async function toggleCollect(
  deviceId: string,
  problemSlugOrId: string
): Promise<{ collected: boolean; count: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { collected: false, count: 0 };

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
