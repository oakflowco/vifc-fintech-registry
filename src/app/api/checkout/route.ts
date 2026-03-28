import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const stripe = getStripe();
  const priceInCents = Number(process.env.TRENDS_PRICE_CENTS) || 4900;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Vietnam Fintech Trends — Full Access",
            description:
              "Unlock comprehensive fintech trendline analysis, investment flow data, and regulatory insights for Vietnam.",
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/trends`,
  });

  return NextResponse.json({ url: session.url });
}
