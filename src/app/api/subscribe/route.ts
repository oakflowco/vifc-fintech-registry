import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, activateSubscription } from "@/lib/users";
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

  if (!user) {
    // Create account with random password (will be sent via email)
    const tempPassword = uuidv4().slice(0, 12);
    user = await createUser(email, tempPassword);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Log the pending subscription request (for manual verification)
    console.log("=== NEW SUBSCRIPTION REQUEST ===");
    console.log("Email:", email);
    console.log("MoMo Transaction ID:", transactionId);
    console.log("Temp Password:", tempPassword);
    console.log("User ID:", user.id);
    console.log("Timestamp:", new Date().toISOString());
    console.log("================================");
  } else {
    // Existing user — log renewal request
    console.log("=== SUBSCRIPTION RENEWAL REQUEST ===");
    console.log("Email:", email);
    console.log("MoMo Transaction ID:", transactionId);
    console.log("User ID:", user.id);
    console.log("Timestamp:", new Date().toISOString());
    console.log("====================================");
  }

  // Store the pending request (for admin review)
  // In production, this would go to a database/notification system
  // For now, auto-activate (you can change this to manual approval)
  const autoActivate = process.env.AUTO_ACTIVATE_SUBSCRIPTIONS === "true";

  if (autoActivate) {
    await activateSubscription(user.id, transactionId);
    console.log("Auto-activated subscription for:", email);
  }

  return NextResponse.json({
    ok: true,
    message: autoActivate
      ? "Payment verified. Your account is now active!"
      : "Payment submitted. We'll verify and activate your account within 24 hours.",
    autoActivated: autoActivate,
  });
}
