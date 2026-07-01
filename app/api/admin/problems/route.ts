import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createProblem, listProblemsForAdmin, ProblemInput } from "@/lib/problems";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const items = await listProblemsForAdmin();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/admin/problems failed", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as ProblemInput | null;
  if (!body?.title || !body.description || !body.category || !body.difficulty) {
    return NextResponse.json({ error: "缺少必填字段：title / description / category / difficulty" }, { status: 400 });
  }

  try {
    const item = await createProblem(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/problems failed", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
