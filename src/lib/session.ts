import { cookies } from "next/headers";
import crypto from "crypto";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret === "vifc-session-secret-change-me") {
    throw new Error(
      "SESSION_SECRET is not configured. Set a strong random secret (32+ chars) in your environment variables."
    );
  }
  return secret;
}

const COOKIE_NAME = "vifc_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (down from 30)

export function createSessionToken(userId: string): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${userId}:${expiry}:${nonce}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}:${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 4) return null;
  const [userId, expiry, nonce, sig] = parts;
  const payload = `${userId}:${expiry}:${nonce}`;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  // Timing-safe comparison
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  if (Date.now() > Number(expiry)) return null;
  return userId;
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME, SESSION_DURATION_MS };
