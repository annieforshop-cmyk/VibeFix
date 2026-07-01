import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteProblem, ProblemInput, updateProblem } from "@/lib/problems";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const { id } = await context.params;

  const body = (await request.json().catch(() => null)) as Partial<ProblemInput> | null;
  if (!body) return NextResponse.json({ error: "请求体无效" }, { status: 400 });

  try {
    const item = await updateProblem(id, body);
    return NextResponse.json({ item });
  } catch (error) {
    console.error(`PATCH /api/admin/problems/${id} failed`, error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const { id } = await context.params;

  try {
    await deleteProblem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/admin/problems/${id} failed`, error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
