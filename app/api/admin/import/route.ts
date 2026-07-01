import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createProblem, ProblemInput } from "@/lib/problems";

/**
 * Bulk-import inspiration cards (e.g. pasted from a reviewed Grok export).
 * Body: { items: ProblemInput[] }. Everything is created as a draft so it
 * still needs a manual publish step in /admin.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? (body.items as ProblemInput[]) : null;
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "items 必须是非空数组" }, { status: 400 });
  }

  const created: string[] = [];
  const errors: { index: number; error: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item?.title || !item.description || !item.category || !item.difficulty) {
      errors.push({ index: i, error: "缺少必填字段：title / description / category / difficulty" });
      continue;
    }
    try {
      const result = await createProblem({ ...item, publishStatus: item.publishStatus ?? "draft" });
      created.push(result.id);
    } catch (error) {
      errors.push({ index: i, error: error instanceof Error ? error.message : "未知错误" });
    }
  }

  return NextResponse.json({ createdCount: created.length, created, errors });
}
