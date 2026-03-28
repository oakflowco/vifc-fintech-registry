import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "vifc-session-secret-change-me";
const COOKIE_NAME = "vifc_session";

export function createSessionToken(userId: string): string {
  const payload = `${userId}:${Date.now() + 30 * 24 * 60 * 60 * 1000}`; // 30 days
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [userId, expiry, sig] = parts;
  const payload = `${userId}:${expiry}`;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  if (Date.now() > Number(expiry)) return null;
  return userId;
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
