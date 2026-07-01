import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vibefx_admin_session";

function tokenFor(password: string): string {
  return createHash("sha256").update(`vibefx-admin::${password}`).digest("hex");
}

/** Session token to set as the admin cookie value after a correct password. */
export function issueAdminToken(password: string): string {
  return tokenFor(password);
}

/** Verifies a plaintext password against the configured ADMIN_PASSWORD. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(tokenFor(password));
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verifies a session cookie value against the configured ADMIN_PASSWORD. */
export function verifyAdminToken(token: string | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Server-side check (route handlers, server components) for the admin cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

/** Verifies a request's `Authorization: Bearer <key>` header against
 * INGEST_API_KEY — a separate, non-expiring secret for headless automation
 * (e.g. a scheduled job posting daily pain-point data) that can't do the
 * cookie-based admin login flow. */
export function isValidIngestRequest(request: Request): boolean {
  const expected = process.env.INGEST_API_KEY;
  if (!expected) return false;
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
