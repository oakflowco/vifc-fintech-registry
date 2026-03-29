const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured, skipping notification");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    return res.ok;
  } catch {
    console.error("Failed to send Telegram notification");
    return false;
  }
}

export function formatSignupNotification({
  email,
  userId,
  ip,
  country,
  countryFlag,
}: {
  email: string;
  userId: string;
  ip: string;
  country: string;
  countryFlag: string;
}): string {
  return [
    `<b>👤 New User Signup</b>`,
    ``,
    `<b>Email:</b> ${email}`,
    `<b>User ID:</b> <code>${userId}</code>`,
    `<b>IP:</b> <code>${ip}</code>`,
    `<b>Location:</b> ${countryFlag} ${country}`,
    `<b>Signed up:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
  ].join("\n");
}

export function formatSubscriptionNotification({
  email,
  transactionId,
  tempPassword,
  userId,
}: {
  email: string;
  transactionId: string;
  tempPassword: string;
  userId: string;
}): string {
  return [
    `<b>💰 New Subscription</b>`,
    ``,
    `<b>Email:</b> ${email}`,
    `<b>MoMo TX:</b> <code>${transactionId}</code>`,
    `<b>Temp Password:</b> <code>${tempPassword}</code>`,
    `<b>User ID:</b> <code>${userId}</code>`,
    `<b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
    ``,
    `✅ Account auto-activated. Send password to user.`,
  ].join("\n");
}

export function formatRenewalNotification({
  email,
  transactionId,
  userId,
}: {
  email: string;
  transactionId: string;
  userId: string;
}): string {
  return [
    `<b>🔄 Subscription Renewal</b>`,
    ``,
    `<b>Email:</b> ${email}`,
    `<b>MoMo TX:</b> <code>${transactionId}</code>`,
    `<b>User ID:</b> <code>${userId}</code>`,
    `<b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}`,
    ``,
    `✅ Subscription extended 30 days.`,
  ].join("\n");
}
