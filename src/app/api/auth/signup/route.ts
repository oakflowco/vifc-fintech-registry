import { NextRequest, NextResponse } from "next/server";
import { createUser, activateSubscription } from "@/lib/users";
import { createSessionToken, COOKIE_NAME } from "@/lib/session";
import { sendTelegramNotification } from "@/lib/telegram";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
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

  // Notify admin
  await sendTelegramNotification(
    [
      `<b>👤 New User Signup</b>`,
      ``,
      `<b>Email:</b> ${email}`,
      `<b>User ID:</b> <code>${user.id}</code>`,
      `<b>Access:</b> Full (auto-activated)`,
      `<b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
    ].join("\n")
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
