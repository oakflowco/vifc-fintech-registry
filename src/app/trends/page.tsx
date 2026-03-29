import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { TrendCharts } from "@/components/trend-charts";
import { PremiumGate } from "@/components/premium-gate";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchVNIndex, summarizeByYear } from "@/lib/fetch-stock";
import { fetchFintechNews } from "@/lib/fetch-news";
import { fetchSheetData } from "@/lib/sheets";
import {
  quarterlyInvestment,
  startupStages,
  investorCountries,
  regulatoryMilestones,
  relatedLinks,
} from "@/lib/trend-data";

export const metadata: Metadata = {
  title: "Vietnam Fintech Trends & Market Intelligence",
  description:
    "Live market data dashboard — VN-Index, GDP growth, FDI inflows, fintech ecosystem trends, and regulatory news updated hourly.",
};

export const revalidate = 3600;

export default async function TrendsPage() {
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;
  const subscribed = user ? hasActiveSubscription(user) : false;

  if (!subscribed) {
    return <PremiumGate feature="Vietnam Fintech Trends & Market Intelligence" />;
  }

  // Fetch live data in parallel — all 5 registries
  const sheetUrls = [
    process.env.GOOGLE_SHEET_FINTECH_URL,
    process.env.GOOGLE_SHEET_INVESTORS_URL,
    process.env.GOOGLE_SHEET_BANKS_URL,
    process.env.GOOGLE_SHEET_SECURITIES_URL,
    process.env.GOOGLE_SHEET_INSURANCE_URL,
  ].filter(Boolean) as string[];

  const [macroData, vnIndexMonthly, liveNews, ...sheetResults] = await Promise.all([
    fetchMacroData(),
    fetchVNIndex(),
    fetchFintechNews(),
    ...sheetUrls.map((url) =>
      fetchSheetData(url).catch(() => ({ headers: [], data: [] }))
    ),
  ]);

  const vnIndexYearly = summarizeByYear(vnIndexMonthly);

  // Compute startups by city from registry data
  const allEntries = sheetResults.flatMap((r) => r.data);
  const cityCount = new Map<string, number>();
  for (const entry of allEntries) {
    const city = entry["Headquarters"] || entry["headquarters"] || entry["HQ"] || "";
    if (city) cityCount.set(city, (cityCount.get(city) || 0) + 1);
  }
  const totalByCity = Array.from(cityCount.entries())
    .sort((a, b) => b[1] - a[1]);
  const totalCompanies = totalByCity.reduce((sum, [, count]) => sum + count, 0);

  // Top cities + "Other"
  const topCities = totalByCity.slice(0, 5);
  const otherCount = totalByCity.slice(5).reduce((sum, [, c]) => sum + c, 0);
  const startupsByCity = [
    ...topCities.map(([city, count]) => ({
      city,
      startups: count,
      funding: 0, // not available from sheet
      pct: totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0,
    })),
    ...(otherCount > 0
      ? [{ city: "Other", startups: otherCount, funding: 0, pct: Math.round((otherCount / totalCompanies) * 100) }]
      : []),
  ];

  // Compute category distribution from registry data (LIVE)
  const catCount = new Map<string, number>();
  for (const entry of allEntries) {
    const cat = entry["Category"] || entry["category"] || entry["Type"] || entry["type"] || "";
    if (cat) catCount.set(cat, (catCount.get(cat) || 0) + 1);
  }
  const totalCats = Array.from(catCount.values()).reduce((a, b) => a + b, 0);
  const categoryDistribution = Array.from(catCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
      share: totalCats > 0 ? Math.round((count / totalCats) * 1000) / 10 : 0,
    }));

  // Build key metrics from live data
  const latestMacro = macroData[macroData.length - 1];
  const prevMacro = macroData[macroData.length - 2];
  const latestStock = vnIndexYearly[vnIndexYearly.length - 1];

  const keyMetrics = [
    {
      label: "GDP (USD)",
      slug: "gdp",
      value: latestMacro
        ? `$${latestMacro.gdpBillions}B`
        : "—",
      change: latestMacro && prevMacro
        ? `${latestMacro.gdpGrowth > 0 ? "+" : ""}${latestMacro.gdpGrowth}%`
        : "—",
    },
    {
      label: "FDI Inflows",
      slug: "fdi",
      value: latestMacro ? `$${latestMacro.fdi}B` : "—",
      change:
        latestMacro && prevMacro && prevMacro.fdi > 0
          ? `${(((latestMacro.fdi - prevMacro.fdi) / prevMacro.fdi) * 100) > 0 ? "+" : ""}${(((latestMacro.fdi - prevMacro.fdi) / prevMacro.fdi) * 100).toFixed(1)}%`
          : "—",
    },
    {
      label: "VN-Index",
      slug: "vn-index",
      value: latestStock ? latestStock.yearEnd.toLocaleString() : "—",
      change:
        vnIndexYearly.length >= 2
          ? `${(((vnIndexYearly[vnIndexYearly.length - 1].yearEnd - vnIndexYearly[vnIndexYearly.length - 2].yearEnd) / vnIndexYearly[vnIndexYearly.length - 2].yearEnd) * 100) > 0 ? "+" : ""}${(((vnIndexYearly[vnIndexYearly.length - 1].yearEnd - vnIndexYearly[vnIndexYearly.length - 2].yearEnd) / vnIndexYearly[vnIndexYearly.length - 2].yearEnd) * 100).toFixed(1)}%`
          : "—",
    },
    {
      label: "Population",
      slug: "population",
      value: latestMacro
        ? `${latestMacro.population}M`
        : "—",
      change:
        latestMacro && prevMacro
          ? `+${((latestMacro.population - prevMacro.population) / prevMacro.population * 100).toFixed(1)}%`
          : "—",
    },
    {
      label: "Internet Users",
      slug: "internet",
      value: latestMacro
        ? `${latestMacro.internetPenetration}%`
        : "—",
      change:
        latestMacro && prevMacro
          ? `+${(latestMacro.internetPenetration - prevMacro.internetPenetration).toFixed(1)}pp`
          : "—",
    },
    {
      label: "Inflation",
      slug: "inflation",
      value: latestMacro ? `${latestMacro.inflation}%` : "—",
      change:
        latestMacro && prevMacro
          ? `${(latestMacro.inflation - prevMacro.inflation) > 0 ? "+" : ""}${(latestMacro.inflation - prevMacro.inflation).toFixed(1)}pp`
          : "—",
    },
  ];

  // Use live news if available, otherwise fall back to static
  const newsItems =
    liveNews.length > 0
      ? liveNews.map((n) => ({
          date: n.date,
          title: n.title,
          summary: n.summary,
          category: n.category,
          url: n.url,
        }))
      : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vietnam Financial Centre — Market Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live data from World Bank, Yahoo Finance & Google News — auto-refreshes hourly. Years marked * are estimates (IMF/govt projections).
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-muted-foreground font-mono">
            Last updated: {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
          </p>
        </div>
      </div>
      <TrendCharts
        keyMetrics={keyMetrics}
        macroData={macroData}
        vnIndexMonthly={vnIndexMonthly}
        vnIndexYearly={vnIndexYearly}
        liveNews={newsItems}
        categoryDistribution={categoryDistribution}
        quarterlyInvestment={quarterlyInvestment}
        startupsByCity={startupsByCity}
        startupStages={startupStages}
        investorCountries={investorCountries}
        regulatoryMilestones={regulatoryMilestones}
        relatedLinks={relatedLinks}
      />
    </div>
  );
}
