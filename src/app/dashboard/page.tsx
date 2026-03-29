import type { Metadata } from "next";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchVNIndex, summarizeByYear } from "@/lib/fetch-stock";
import { fetchBankingData } from "@/lib/fetch-banking";
import { fetchASEANComparison } from "@/lib/fetch-asean";
import { fetchSheetData } from "@/lib/sheets";
import { VietnamDashboard } from "@/components/vietnam-dashboard";

export const metadata: Metadata = {
  title: "Vietnam at a Glance — Investor Dashboard",
  description:
    "Real-time Vietnam financial dashboard: GDP, VN-Index, banking health, digital adoption, FDI, and ASEAN comparison. Built for investors.",
};

export const revalidate = 3600; // hourly

export default async function DashboardPage() {
  // Fetch all data in parallel
  const sheetUrls = [
    process.env.GOOGLE_SHEET_FINTECH_URL,
    process.env.GOOGLE_SHEET_INVESTORS_URL,
    process.env.GOOGLE_SHEET_BANKS_URL,
    process.env.GOOGLE_SHEET_SECURITIES_URL,
    process.env.GOOGLE_SHEET_INSURANCE_URL,
    process.env.GOOGLE_SHEET_NEOBANKS_URL,
  ].filter(Boolean) as string[];

  const [macroData, vnIndexMonthly, bankingData, aseanData, ...sheets] =
    await Promise.all([
      fetchMacroData(),
      fetchVNIndex(),
      fetchBankingData(),
      fetchASEANComparison(),
      ...sheetUrls.map((url) =>
        fetchSheetData(url).catch(() => ({ headers: [], data: [] }))
      ),
    ]);

  const vnIndexYearly = summarizeByYear(vnIndexMonthly);
  const latestMacro = macroData[macroData.length - 1];
  const prevMacro = macroData[macroData.length - 2];
  const latestBanking = bankingData[bankingData.length - 1];
  const latestStock = vnIndexYearly[vnIndexYearly.length - 1];
  const prevStock = vnIndexYearly[vnIndexYearly.length - 2];

  // Count entities from sheets
  const allEntries = sheets.flatMap((s) => s.data);
  const totalEntities = allEntries.length;

  // Count by city
  const cityCount = new Map<string, number>();
  for (const entry of allEntries) {
    const city = entry["Headquarters"] || entry["headquarters"] || "";
    if (city) cityCount.set(city, (cityCount.get(city) || 0) + 1);
  }

  // Count by category
  const catCount = new Map<string, number>();
  for (const entry of allEntries) {
    const cat = entry["Category"] || entry["category"] || "";
    if (cat) catCount.set(cat, (catCount.get(cat) || 0) + 1);
  }

  // Count VIFC members
  let vifcDaNang = 0;
  let vifcHCMC = 0;
  for (const entry of allEntries) {
    const status = entry["VIFC Status"] || "";
    if (status.includes("Da Nang")) vifcDaNang++;
    if (status.includes("HCMC") || status.includes("HCM")) vifcHCMC++;
  }

  // Unicorns / notable companies
  const unicorns = [
    { name: "VNG Corporation", valuation: "$1.5B+", sector: "Gaming / Tech", status: "Unicorn (IPO'd NASDAQ 2023)" },
    { name: "MoMo (M_Service)", valuation: "$2B+", sector: "E-Wallet", status: "Unicorn" },
    { name: "VNPay / VNLife", valuation: "$1B+", sector: "Payments", status: "Unicorn" },
    { name: "Sky Mavis (Axie Infinity)", valuation: "$3B peak", sector: "Blockchain Gaming", status: "Unicorn (2021 peak)" },
    { name: "Tiki", valuation: "$800M+", sector: "E-commerce", status: "Soonicorn" },
    { name: "KiotViet", valuation: "$500M+", sector: "SaaS / Fintech", status: "Soonicorn" },
    { name: "FPT Corporation", valuation: "$8B+", sector: "Technology", status: "Public (HOSE: FPT)" },
    { name: "Techcombank", valuation: "$6B+", sector: "Digital Banking", status: "Public (HOSE: TCB)" },
  ];

  // Sovereign ratings
  const ratings = [
    { agency: "S&P", rating: "BB+", outlook: "Stable" },
    { agency: "Moody's", rating: "Ba2", outlook: "Stable" },
    { agency: "Fitch", rating: "BB+", outlook: "Positive" },
  ];

  return (
    <VietnamDashboard
      macroData={macroData}
      latestMacro={latestMacro}
      prevMacro={prevMacro}
      bankingData={bankingData}
      latestBanking={latestBanking}
      vnIndexMonthly={vnIndexMonthly}
      vnIndexYearly={vnIndexYearly}
      latestStock={latestStock}
      prevStock={prevStock}
      aseanData={aseanData}
      totalEntities={totalEntities}
      cityCount={Array.from(cityCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)}
      categoryCount={Array.from(catCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)}
      vifcDaNang={vifcDaNang}
      vifcHCMC={vifcHCMC}
      unicorns={unicorns}
      ratings={ratings}
    />
  );
}
