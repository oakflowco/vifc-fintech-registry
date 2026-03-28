import { NextRequest, NextResponse } from "next/server";
import { verifyMoMoSignature } from "@/lib/momo";
import { activateSubscription } from "@/lib/users";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verify MoMo signature
  if (!verifyMoMoSignature(body)) {
    console.error("MoMo IPN: invalid signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  // Check payment success (resultCode 0 = success)
  if (String(body.resultCode) !== "0") {
    console.log("MoMo IPN: payment failed", body.resultCode, body.message);
    return NextResponse.json({ message: "Payment not successful" });
  }

  // Extract userId from extraData
  try {
    const extraData = JSON.parse(
      Buffer.from(body.extraData, "base64").toString("utf-8")
    );
    const userId = extraData.userId;

    if (userId) {
      await activateSubscription(userId, String(body.transId));
      console.log("MoMo IPN: subscription activated for", userId);
    }
  } catch (e) {
    console.error("MoMo IPN: failed to parse extraData", e);
  }

  // MoMo expects 204 or 200 response
  return NextResponse.json({ message: "OK" });
}
