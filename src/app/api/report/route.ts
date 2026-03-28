import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchVNIndex, summarizeByYear } from "@/lib/fetch-stock";
import { fetchSheetData } from "@/lib/sheets";
import { regulatoryMilestones } from "@/lib/trend-data";

const SHEET_URLS: Record<string, string | undefined> = {
  fintech: process.env.GOOGLE_SHEET_FINTECH_URL,
  investors: process.env.GOOGLE_SHEET_INVESTORS_URL,
  banks: process.env.GOOGLE_SHEET_BANKS_URL,
  securities: process.env.GOOGLE_SHEET_SECURITIES_URL,
  insurance: process.env.GOOGLE_SHEET_INSURANCE_URL,
};

function escapeCSV(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function fetchRegistryCount(url: string | undefined): Promise<number> {
  if (!url) return 0;
  try {
    const { data } = await fetchSheetData(url);
    return data.length;
  } catch {
    return 0;
  }
}

export async function GET() {
  // 1. Auth check
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || !hasActiveSubscription(user)) {
    return NextResponse.json(
      { error: "Premium subscription required" },
      { status: 403 }
    );
  }

  // 2. Fetch data in parallel
  const [macroData, stockData, fintechCount, investorsCount, banksCount, securitiesCount, insuranceCount] =
    await Promise.all([
      fetchMacroData(),
      fetchVNIndex(),
      fetchRegistryCount(SHEET_URLS.fintech),
      fetchRegistryCount(SHEET_URLS.investors),
      fetchRegistryCount(SHEET_URLS.banks),
      fetchRegistryCount(SHEET_URLS.securities),
      fetchRegistryCount(SHEET_URLS.insurance),
    ]);

  const yearlyStock = summarizeByYear(stockData);
  const today = new Date().toISOString().slice(0, 10);

  // 3. Build multi-section CSV
  const lines: string[] = [];

  lines.push("VIFC Da Nang — Vietnam Market Intelligence Report");
  lines.push(`Generated: ${today}`);
  lines.push("");

  // Macro section
  lines.push("=== MACROECONOMIC INDICATORS ===");
  lines.push("Year,GDP ($B),GDP Growth (%),FDI ($B),Inflation (%),Population (M),Internet (%)");
  for (const m of macroData) {
    lines.push(
      [
        escapeCSV(m.year),
        escapeCSV(m.gdpBillions),
        escapeCSV(m.gdpGrowth),
        escapeCSV(m.fdi),
        escapeCSV(m.inflation),
        escapeCSV(m.population),
        escapeCSV(m.internetPenetration),
      ].join(",")
    );
  }
  lines.push("");

  // Stock section
  lines.push("=== VN-INDEX SUMMARY ===");
  lines.push("Year,Year End,Year High,Year Low,Avg Volume (M)");
  for (const s of yearlyStock) {
    lines.push(
      [
        escapeCSV(s.year),
        escapeCSV(s.yearEnd),
        escapeCSV(s.yearHigh),
        escapeCSV(s.yearLow),
        escapeCSV(s.avgVolume),
      ].join(",")
    );
  }
  lines.push("");

  // Registry section
  lines.push("=== REGISTRY STATISTICS ===");
  lines.push("Registry,Total Entities");
  lines.push(`Fintech,${fintechCount}`);
  lines.push(`Investors,${investorsCount}`);
  lines.push(`Banks,${banksCount}`);
  lines.push(`Securities,${securitiesCount}`);
  lines.push(`Insurance,${insuranceCount}`);
  lines.push("");

  // Regulatory milestones section
  lines.push("=== REGULATORY MILESTONES ===");
  lines.push("Date,Event");
  for (const m of regulatoryMilestones) {
    lines.push(`${escapeCSV(m.date)},${escapeCSV(m.event)}`);
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=vifc-vietnam-report-${today}.csv`,
    },
  });
}
