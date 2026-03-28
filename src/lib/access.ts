import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.ACCESS_TOKEN_SECRET || "vifc-default-secret-change-me";
const COOKIE_NAME = "vifc_access";

export function generateAccessToken(): string {
  const expiry = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
  const payload = `paid:${expiry}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
}

export function verifyAccessToken(token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [status, expiryStr, signature] = parts;
  const payload = `${status}:${expiryStr}`;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  if (signature !== expected) return false;
  if (Date.now() > Number(expiryStr)) return false;
  return status === "paid";
}

export async function hasPaidAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAccessToken(token);
}

export { COOKIE_NAME };
