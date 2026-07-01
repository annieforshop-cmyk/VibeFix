import { getSupabaseAdmin } from "./supabase/server";
import { PROBLEMS, Problem, Category, Difficulty, ProblemDetail } from "./data";

export type SortMode = "hot" | "new" | "pain";
export type PublishStatus = "draft" | "published" | "archived";

export interface ProblemFilters {
  category?: Category | null;
  difficulty?: Difficulty | null;
  painScoreMin?: number;
  sort?: SortMode;
  page?: number;
  limit?: number;
}

export interface ProblemInput {
  slug?: string;
  title: string;
  description: string;
  country?: string;
  countryFlag?: string;
  region?: Problem["region"];
  category: Category;
  subcategory?: string;
  status?: Problem["status"];
  aiPotential?: Problem["aiPotential"];
  difficulty: Difficulty;
  painScore?: number;
  targetUsers?: string;
  whyNow?: string;
  techHints?: string[];
  complaintCount?: number;
  growthRate?: number;
  upvotes?: number;
  views?: number;
  submittedBy?: Problem["submittedBy"];
  source?: string;
  sourceLinks?: string[];
  detail?: ProblemDetail;
  publishStatus?: PublishStatus;
}

interface ProblemRow {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  country: string;
  country_flag: string;
  region: Problem["region"];
  category: Category;
  subcategory: string;
  status: Problem["status"];
  ai_potential: Problem["aiPotential"];
  difficulty: Difficulty;
  pain_score: number;
  target_users: string;
  why_now: string;
  tech_hints: string[];
  complaint_count: number;
  growth_rate: number;
  upvotes: number;
  views: number;
  submitted_by: Problem["submittedBy"];
  source: string | null;
  source_links: string[];
  detail: ProblemDetail;
  publish_status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminProblem extends Problem {
  dbId: string;
  publishStatus: PublishStatus;
  collectCount: number;
  createdAt: string;
}

function rowToProblem(row: ProblemRow): Problem {
  return {
    id: row.slug ?? row.id,
    title: row.title,
    description: row.description,
    country: row.country,
    countryFlag: row.country_flag,
    region: row.region,
    category: row.category,
    subcategory: row.subcategory,
    status: row.status,
    aiPotential: row.ai_potential,
    difficulty: row.difficulty,
    targetUsers: row.target_users,
    whyNow: row.why_now,
    techHints: row.tech_hints ?? [],
    upvotes: row.upvotes,
    views: row.views,
    submittedBy: row.submitted_by,
    source: row.source ?? undefined,
    painScore: row.pain_score,
    complaintCount: row.complaint_count,
    growthRate: Number(row.growth_rate),
    sourceLinks: row.source_links ?? [],
    detail: row.detail ?? {},
  };
}

function inputToRow(input: ProblemInput) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    country: input.country ?? "中国",
    country_flag: input.countryFlag ?? "🇨🇳",
    region: input.region ?? "中国",
    category: input.category,
    subcategory: input.subcategory ?? "",
    status: input.status ?? "无人在做",
    ai_potential: input.aiPotential ?? "中",
    difficulty: input.difficulty,
    pain_score: input.painScore ?? 5,
    target_users: input.targetUsers ?? "",
    why_now: input.whyNow ?? "",
    tech_hints: input.techHints ?? [],
    complaint_count: input.complaintCount ?? 0,
    growth_rate: input.growthRate ?? 0,
    upvotes: input.upvotes ?? 0,
    views: input.views ?? 0,
    submitted_by: input.submittedBy ?? "创始人精选",
    source: input.source ?? null,
    source_links: input.sourceLinks ?? [],
    detail: input.detail ?? {},
    publish_status: input.publishStatus ?? "draft",
  };
}

function filterStatic(filters: ProblemFilters): Problem[] {
  let list = [...PROBLEMS];
  if (filters.category) list = list.filter((p) => p.category === filters.category);
  if (filters.difficulty) list = list.filter((p) => p.difficulty === filters.difficulty);
  if (filters.painScoreMin) list = list.filter((p) => (p.painScore ?? 0) >= filters.painScoreMin!);
  if (filters.sort === "new") list = [...list].reverse();
  else if (filters.sort === "pain") list.sort((a, b) => (b.painScore ?? 0) - (a.painScore ?? 0));
  else list.sort((a, b) => b.upvotes - a.upvotes);
  return list;
}

/** List published problems for the public site. Falls back to bundled
 * static sample data when Supabase isn't configured. */
export async function listProblems(
  filters: ProblemFilters = {}
): Promise<{ items: Problem[]; total: number }> {
  const supabase = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  if (!supabase) {
    const list = filterStatic(filters);
    return { items: list.slice((page - 1) * limit, page * limit), total: list.length };
  }

  let query = supabase.from("problems").select("*", { count: "exact" }).eq("publish_status", "published");
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
  if (filters.painScoreMin) query = query.gte("pain_score", filters.painScoreMin);

  if (filters.sort === "new") query = query.order("created_at", { ascending: false });
  else if (filters.sort === "pain") query = query.order("pain_score", { ascending: false });
  else query = query.order("upvotes", { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { items: (data as ProblemRow[] ?? []).map(rowToProblem), total: count ?? 0 };
}

export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return PROBLEMS.find((p) => p.id === slug) ?? null;

  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("slug", slug)
    .eq("publish_status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProblem(data as ProblemRow) : null;
}

/** Admin-only: list every problem regardless of publish status, with collect counts. */
export async function listProblemsForAdmin(): Promise<AdminProblem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return PROBLEMS.map((p) => ({ ...p, dbId: p.id, publishStatus: "published", collectCount: 0, createdAt: "" }));
  }

  const { data: rows, error } = await supabase
    .from("problems")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: collections } = await supabase.from("collections").select("problem_id");
  const counts = new Map<string, number>();
  for (const c of collections ?? []) {
    counts.set(c.problem_id, (counts.get(c.problem_id) ?? 0) + 1);
  }

  return (rows as ProblemRow[]).map((row) => ({
    ...rowToProblem(row),
    dbId: row.id,
    publishStatus: row.publish_status,
    collectCount: counts.get(row.id) ?? 0,
    createdAt: row.created_at,
  }));
}

export async function createProblem(input: ProblemInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("problems").insert(inputToRow(input)).select("*").single();
  if (error) throw error;
  return rowToProblem(data as ProblemRow);
}

export async function updateProblem(dbId: string, input: Partial<ProblemInput>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const row = inputToRow(input as ProblemInput);
  const patch = Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
  const { data, error } = await supabase.from("problems").update(patch).eq("id", dbId).select("*").single();
  if (error) throw error;
  return rowToProblem(data as ProblemRow);
}

export async function deleteProblem(dbId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("problems").delete().eq("id", dbId);
  if (error) throw error;
}
