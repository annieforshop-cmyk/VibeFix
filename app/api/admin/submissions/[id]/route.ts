import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { approveSubmission, rejectSubmission } from "@/lib/submissions";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const { id } = await context.params;

  const body = await request.json().catch(() => null);
  const action = body?.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action 必须是 approve 或 reject" }, { status: 400 });
  }

  try {
    if (action === "approve") {
      const { submission, problem } = await approveSubmission(id);
      return NextResponse.json({ submission, problem });
    }
    const submission = await rejectSubmission(id);
    return NextResponse.json({ submission });
  } catch (error) {
    console.error(`PATCH /api/admin/submissions/${id} failed`, error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
