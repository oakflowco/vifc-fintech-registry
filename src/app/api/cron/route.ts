import { NextRequest, NextResponse } from "next/server";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchVNIndex } from "@/lib/fetch-stock";
import { fetchBankingData } from "@/lib/fetch-banking";
import { fetchCommodityPrices } from "@/lib/fetch-commodities";
import { fetchExchangeRates } from "@/lib/fetch-exchange-rate";
import { fetchSovereignRatings } from "@/lib/fetch-ratings";

// Vercel Cron Job — runs daily to warm caches and verify data freshness
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "0 6 * * *" }] }

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, { status: string; count?: number; error?: string }> = {};

  // Fetch all automated data sources in parallel to warm ISR caches
  const tasks = [
    {
      name: "macro_data",
      fn: async () => {
        const data = await fetchMacroData();
        return { count: data.length };
      },
    },
    {
      name: "vn_index",
      fn: async () => {
        const data = await fetchVNIndex();
        return { count: data.length };
      },
    },
    {
      name: "banking",
      fn: async () => {
        const data = await fetchBankingData();
        return { count: data.length };
      },
    },
    {
      name: "commodities",
      fn: async () => {
        const data = await fetchCommodityPrices();
        return { count: data.length };
      },
    },
    {
      name: "exchange_rates",
      fn: async () => {
        const data = await fetchExchangeRates();
        return { count: data.rates.length };
      },
    },
    {
      name: "sovereign_ratings",
      fn: async () => {
        const data = await fetchSovereignRatings();
        return { count: data.length };
      },
    },
  ];

  await Promise.all(
    tasks.map(async ({ name, fn }) => {
      try {
        const { count } = await fn();
        results[name] = { status: "ok", count };
      } catch (err) {
        results[name] = {
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    })
  );

  const failedCount = Object.values(results).filter(
    (r) => r.status === "error"
  ).length;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: tasks.length,
      success: tasks.length - failedCount,
      failed: failedCount,
    },
  });
}
