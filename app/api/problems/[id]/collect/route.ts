import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { toggleCollect } from "@/lib/collections";

const DEVICE_COOKIE = "vibefx_device_id";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();

  let deviceId = cookieStore.get(DEVICE_COOKIE)?.value;
  const isNewDevice = !deviceId;
  if (!deviceId) deviceId = randomUUID();

  try {
    const result = await toggleCollect(deviceId, id);
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
