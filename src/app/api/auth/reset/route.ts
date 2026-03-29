import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, resetUserPassword } from "@/lib/users";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not
    return NextResponse.json({
      ok: true,
      message: "If this email is registered, you'll receive a new password shortly.",
    });
  }

  // Generate new password and update
  const newPassword = await resetUserPassword(user.id);
  if (!newPassword) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }

  // Notify admin via Telegram
  await sendTelegramNotification(
    [
      `<b>🔑 Password Reset</b>`,
      ``,
      `<b>Email:</b> ${email}`,
      `<b>New Password:</b> <code>${newPassword}</code>`,
      `<b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
      ``,
      `Please send the new password to the user.`,
    ].join("\n")
  );

  return NextResponse.json({
    ok: true,
    message: "If this email is registered, you'll receive a new password shortly.",
  });
}
