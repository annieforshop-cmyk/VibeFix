import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listSubmissions } from "@/lib/submissions";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const items = await listSubmissions();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/admin/submissions failed", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}
