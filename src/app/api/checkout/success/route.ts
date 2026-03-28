import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { generateAccessToken, COOKIE_NAME } from "@/lib/access";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/trends", request.url));
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.redirect(new URL("/trends", request.url));
  }

  const token = generateAccessToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  const response = NextResponse.redirect(new URL("/trends", baseUrl));

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
