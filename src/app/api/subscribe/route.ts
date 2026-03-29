import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, activateSubscription } from "@/lib/users";
import {
  sendTelegramNotification,
  formatSubscriptionNotification,
  formatRenewalNotification,
} from "@/lib/telegram";
import { sendWelcomeEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { email, transactionId } = await req.json();

  if (!email || !transactionId) {
    return NextResponse.json(
      { error: "Email and transaction ID required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  let user = await getUserByEmail(email);
  let tempPassword: string | null = null;
  let isNew = false;

  if (!user) {
    // New user — create account with random password
    tempPassword = uuidv4().slice(0, 10);
    user = await createUser(email, tempPassword);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }
    isNew = true;
  }

  // Auto-activate subscription (30 days)
  await activateSubscription(user.id, transactionId);

  // Send welcome email to user + Telegram notification to admin
  if (isNew && tempPassword) {
    await Promise.all([
      sendWelcomeEmail(email, tempPassword),
      sendTelegramNotification(
        formatSubscriptionNotification({
          email,
          transactionId,
          tempPassword,
          userId: user.id,
        })
      ),
    ]);
  } else {
    await sendTelegramNotification(
      formatRenewalNotification({
        email,
        transactionId,
        userId: user.id,
      })
    );
  }

  return NextResponse.json({
    ok: true,
    isNew,
    tempPassword: isNew ? tempPassword : null,
    message: isNew
      ? "Account created and activated!"
      : "Subscription renewed for 30 days!",
  });
}
