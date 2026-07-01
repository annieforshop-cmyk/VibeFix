import { getSupabaseAdmin } from "./supabase/server";
import { ALL_CATEGORIES, Category, Problem } from "./data";
import { createProblem } from "./problems";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  title: string;
  description: string;
  category: string | null;
  region: string | null;
  source: string | null;
  status: SubmissionStatus;
  createdAt: string;
}

interface SubmissionRow {
  id: string;
  title: string;
  description: string;
  category: string | null;
  region: string | null;
  source: string | null;
  status: SubmissionStatus;
  created_at: string;
}

const VALID_REGIONS: Problem["region"][] = ["中国", "亚洲", "全球", "非洲", "欧洲", "美洲"];

function rowToSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    region: row.region,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** List all community submissions, newest first. Empty in local/demo mode (no DB). */
export async function listSubmissions(): Promise<Submission[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data as SubmissionRow[]) ?? []).map(rowToSubmission);
}

/** Rejects a submission: marks it as rejected without creating a problem. */
export async function rejectSubmission(id: string): Promise<Submission> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToSubmission(data as SubmissionRow);
}

/** Approves a submission: creates a draft problem from it and marks it approved.
 * The draft still needs to be reviewed/published from /admin like any other entry. */
export async function approveSubmission(id: string): Promise<{ submission: Submission; problem: Problem }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: existing, error: fetchError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;
  const submission = rowToSubmission(existing as SubmissionRow);

  const category: Category = ALL_CATEGORIES.includes(submission.category as Category)
    ? (submission.category as Category)
    : "自由职业";
  const region: Problem["region"] = VALID_REGIONS.includes(submission.region as Problem["region"])
    ? (submission.region as Problem["region"])
    : "全球";

  const problem = await createProblem({
    title: submission.title,
    description: submission.description,
    category,
    region,
    difficulty: "周末项目",
    submittedBy: "社区提交",
    source: submission.source ?? undefined,
    publishStatus: "draft",
  });

  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;

  return { submission: rowToSubmission(data as SubmissionRow), problem };
}
