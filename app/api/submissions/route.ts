import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!title || !description) {
    return NextResponse.json({ error: "标题和描述为必填项" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // No database configured (local/demo mode) — accept the submission without persisting it.
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from("submissions").insert({
    title,
    description,
    category: typeof body?.category === "string" ? body.category : null,
    region: typeof body?.region === "string" ? body.region : null,
    source: typeof body?.source === "string" ? body.source : null,
  });
  if (error) {
    console.error("POST /api/submissions failed", error);
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
