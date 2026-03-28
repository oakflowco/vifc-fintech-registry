import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { fetchSheetData } from "@/lib/sheets";

const SHEET_URLS: Record<string, string | undefined> = {
  fintech: process.env.GOOGLE_SHEET_FINTECH_URL,
  investors: process.env.GOOGLE_SHEET_INVESTORS_URL,
  banks: process.env.GOOGLE_SHEET_BANKS_URL,
  securities: process.env.GOOGLE_SHEET_SECURITIES_URL,
  insurance: process.env.GOOGLE_SHEET_INSURANCE_URL,
  neobanks: process.env.GOOGLE_SHEET_NEOBANKS_URL,
  deals: process.env.GOOGLE_SHEET_DEALS_URL,
};

export async function GET(req: NextRequest) {
  // Check auth
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || !hasActiveSubscription(user)) {
    return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
  }

  // Get which registry to export
  const type = req.nextUrl.searchParams.get("type") || "fintech";
  const sheetUrl = SHEET_URLS[type];

  if (!sheetUrl) {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  const { headers, data } = await fetchSheetData(sheetUrl);

  // Build CSV
  const csvRows = [headers.join(",")];
  for (const row of data) {
    const values = headers.map((h) => {
      const val = row[h] || "";
      // Escape values with commas or quotes
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvRows.push(values.join(","));
  }

  const csv = csvRows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=vifc-${type}-registry.csv`,
    },
  });
}
