import crypto from "crypto";

// MoMo Payment Gateway Configuration
// Test environment: https://test-payment.momo.vn
// Production: https://payment.momo.vn

const MOMO_ENDPOINT =
  process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "";
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "";
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY || "";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

interface MoMoPaymentRequest {
  userId: string;
  amount: number; // in VND
  orderInfo: string;
}

interface MoMoPaymentResponse {
  payUrl: string;
  orderId: string;
  requestId: string;
}

export async function createMoMoPayment({
  userId,
  amount,
  orderInfo,
}: MoMoPaymentRequest): Promise<MoMoPaymentResponse | null> {
  const orderId = `VIFC_${userId}_${Date.now()}`;
  const requestId = `REQ_${Date.now()}`;
  const redirectUrl = `${BASE_URL}/account?payment=success`;
  const ipnUrl = `${BASE_URL}/api/momo/ipn`;
  const requestType = "payWithMethod";
  const extraData = Buffer.from(JSON.stringify({ userId })).toString("base64");

  // Build signature per MoMo docs
  const rawSignature = [
    `accessKey=${MOMO_ACCESS_KEY}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${MOMO_PARTNER_CODE}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join("&");

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: MOMO_PARTNER_CODE,
    partnerName: "VIFC Da Nang",
    storeId: "VIFC",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "en",
    requestType,
    autoCapture: true,
    extraData,
    signature,
  };

  try {
    const res = await fetch(MOMO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.resultCode === 0 && data.payUrl) {
      return { payUrl: data.payUrl, orderId, requestId };
    }

    console.error("MoMo payment creation failed:", data);
    return null;
  } catch (error) {
    console.error("MoMo API error:", error);
    return null;
  }
}

export function verifyMoMoSignature(params: Record<string, string>): boolean {
  const rawSignature = [
    `accessKey=${MOMO_ACCESS_KEY}`,
    `amount=${params.amount}`,
    `extraData=${params.extraData}`,
    `message=${params.message}`,
    `orderId=${params.orderId}`,
    `orderInfo=${params.orderInfo}`,
    `orderType=${params.orderType}`,
    `partnerCode=${params.partnerCode}`,
    `payType=${params.payType}`,
    `requestId=${params.requestId}`,
    `responseTime=${params.responseTime}`,
    `resultCode=${params.resultCode}`,
    `transId=${params.transId}`,
  ].join("&");

  const expected = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  return expected === params.signature;
}
