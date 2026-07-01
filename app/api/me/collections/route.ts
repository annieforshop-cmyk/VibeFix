import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/supabase/auth-server";
import { listCollectedIdentifiers } from "@/lib/collections";

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const ids = await listCollectedIdentifiers(`user:${userId}`);
    return NextResponse.json({ ids });
  } catch (error) {
    console.error("GET /api/me/collections failed", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}
