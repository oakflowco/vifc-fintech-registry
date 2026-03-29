import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "VIFC Database <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendPasswordResetEmail(
  to: string,
  newPassword: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) { console.log("Resend not configured, skipping email"); return false; }
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Your new VIFC Database password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px;">Password Reset</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Your VIFC Database password has been reset. Use the credentials below to login.
          </p>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Email</p>
            <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600;">${to}</p>
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">New Password</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">${newPassword}</p>
          </div>
          <a href="https://vifc-fintech-registry.vercel.app/login" style="display: inline-block; background: #171717; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
            Login Now
          </a>
          <p style="color: #999; font-size: 12px; margin: 24px 0 0;">
            If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 11px; margin: 0;">
            VIFC Database — Vietnam International Financial Centre
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email send failed:", e);
    return false;
  }
}

export async function sendWelcomeEmail(
  to: string,
  tempPassword: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) { console.log("Resend not configured, skipping email"); return false; }
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to VIFC Database — Your Premium Account",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px;">Welcome to VIFC Database!</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Your premium account has been activated. You now have full access to Vietnam's financial ecosystem data, trends, and market intelligence.
          </p>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Email</p>
            <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600;">${to}</p>
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Password</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">${tempPassword}</p>
          </div>
          <p style="color: #666; font-size: 13px; margin: 0 0 16px;">Your premium access includes:</p>
          <ul style="color: #666; font-size: 13px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
            <li>Vietnam Fintech Trends — live charts & analysis</li>
            <li>VN-Index, GDP, FDI live data</li>
            <li>Live news feed — fintech, crypto, IFC updates</li>
            <li>CSV export — all registries</li>
          </ul>
          <a href="https://vifc-fintech-registry.vercel.app/login" style="display: inline-block; background: #171717; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
            Login Now
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 11px; margin: 0;">
            VIFC Database — Vietnam International Financial Centre
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email send failed:", e);
    return false;
  }
}
