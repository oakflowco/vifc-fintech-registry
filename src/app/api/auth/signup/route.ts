import { NextRequest, NextResponse } from "next/server";
import { createUser, activateSubscription } from "@/lib/users";
import { createSessionToken, COOKIE_NAME } from "@/lib/session";
import { sendTelegramNotification, formatSignupNotification } from "@/lib/telegram";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  // Vercel provides geo headers automatically on deployed functions
  const countryCode = req.headers.get("x-vercel-ip-country") || "";
  const countryName = req.headers.get("x-vercel-ip-country-region") || "";
  const limited = await checkRateLimit(authLimiter, `signup:${ip}`);
  if (limited) return limited;

  const parsed = signupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;

  const user = await createUser(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  // Auto-activate full access for all new signups (free tier)
  await activateSubscription(user.id, "FREE_SIGNUP");

  // Convert country code (e.g. "VN") to flag emoji (e.g. "🇻🇳")
  const countryFlag = countryCode
    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
    : "";

  // Notify admin
  await sendTelegramNotification(
    formatSignupNotification({
      email,
      userId: user.id,
      ip,
      country: countryName || countryCode || "Unknown",
      countryFlag,
    })
  );

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
