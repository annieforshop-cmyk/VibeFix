import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { toggleCollect } from "@/lib/collections";
import { getUserIdFromRequest } from "@/lib/supabase/auth-server";

const DEVICE_COOKIE = "vibefx_device_id";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();

  // Logged-in users are tracked by account (consistent across devices);
  // everyone else falls back to an anonymous device cookie.
  const userId = await getUserIdFromRequest(request);
  let deviceId = userId ? `user:${userId}` : cookieStore.get(DEVICE_COOKIE)?.value;
  const isNewDevice = !userId && !deviceId;
  if (!deviceId) deviceId = randomUUID();

  const body = await request.json().catch(() => null);
  const wasCollected = body?.collected === true;

  try {
    const result = await toggleCollect(deviceId, id, wasCollected);
    const response = NextResponse.json(result);
    if (isNewDevice) {
      response.cookies.set(DEVICE_COOKIE, deviceId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    return response;
  } catch (error) {
    console.error(`POST /api/problems/${id}/collect failed`, error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}
