import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, resetUserPassword } from "@/lib/users";
import { sendTelegramNotification } from "@/lib/telegram";
import { sendPasswordResetEmail } from "@/lib/email";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { resetSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limited = await checkRateLimit(authLimiter, `reset:${ip}`);
  if (limited) return limited;

  const parsed = resetSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { email } = parsed.data;

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If this email is registered, a new password will be sent to your inbox.",
    });
  }

  const newPassword = await resetUserPassword(user.id);
  if (!newPassword) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }

  // Send new password to user via email
  const emailSent = await sendPasswordResetEmail(email, newPassword);

  // Also notify admin via Telegram
  await sendTelegramNotification(
    [
      `<b>🔑 Password Reset</b>`,
      ``,
      `<b>Email:</b> ${email}`,
      `<b>Email sent:</b> ${emailSent ? "✅ Yes" : "❌ Failed"}`,
      `<b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
    ].join("\n")
  );

  return NextResponse.json({
    ok: true,
    message: "If this email is registered, a new password will be sent to your inbox.",
  });
}
