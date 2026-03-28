import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { createMoMoPayment } from "@/lib/momo";

const AMOUNT_VND = Number(process.env.MOMO_AMOUNT_VND) || 250000; // ~$10

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (hasActiveSubscription(user)) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const payment = await createMoMoPayment({
    userId: user.id,
    amount: AMOUNT_VND,
    orderInfo: "VIFC Premium Access - 30 days",
  });

  if (!payment) {
    return NextResponse.json(
      { error: "Failed to create payment. Check MoMo configuration." },
      { status: 500 }
    );
  }

  return NextResponse.json({ payUrl: payment.payUrl });
}
