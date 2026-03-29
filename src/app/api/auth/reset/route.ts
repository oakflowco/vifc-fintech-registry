import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, resetUserPassword } from "@/lib/users";
import { sendTelegramNotification } from "@/lib/telegram";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

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
