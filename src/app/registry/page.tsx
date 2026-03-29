import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchSheetData } from "@/lib/sheets";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { RegistryTabs } from "@/components/registry-tabs";

export const metadata: Metadata = {
  title: "Vietnam Financial Registry — 300+ Companies, Investors & Banks",
  description:
    "Browse Vietnam's most comprehensive financial registry. 300+ licensed fintech companies, investors, banks, securities firms, and insurance providers.",
};

export const revalidate = 60;

const TAB_CONFIG = [
  { key: "fintech", label: "Fintech", envVar: "GOOGLE_SHEET_FINTECH_URL", exportType: "fintech" },
  { key: "banks", label: "Banks", envVar: "GOOGLE_SHEET_BANKS_URL", exportType: "banks" },
  { key: "investors", label: "Investors", envVar: "GOOGLE_SHEET_INVESTORS_URL", exportType: "investors" },
  { key: "securities", label: "Securities", envVar: "GOOGLE_SHEET_SECURITIES_URL", exportType: "securities" },
  { key: "insurance", label: "Insurance", envVar: "GOOGLE_SHEET_INSURANCE_URL", exportType: "insurance" },
  { key: "neobanks", label: "Neobanks", envVar: "GOOGLE_SHEET_NEOBANKS_URL", exportType: "neobanks" },
  { key: "deals", label: "Deals", envVar: "GOOGLE_SHEET_DEALS_URL", exportType: "deals" },
] as const;

export default async function RegistryPage() {
  // Check subscription status
  let subscribed = false;
  const userId = await getSessionUserId();
  if (userId) {
    const user = await getUserById(userId);
    if (user && hasActiveSubscription(user)) {
      subscribed = true;
    }
  }

  // Fetch ALL sheets in parallel
  const sheetResults = await Promise.all(
    TAB_CONFIG.map(async (tab) => {
      const url = process.env[tab.envVar];
      if (!url) return { key: tab.key, label: tab.label, exportType: tab.exportType, headers: [] as string[], data: [] as Record<string, string>[] };
      try {
        const result = await fetchSheetData(url);
        return { key: tab.key, label: tab.label, exportType: tab.exportType, headers: result.headers, data: result.data };
      } catch {
        return { key: tab.key, label: tab.label, exportType: tab.exportType, headers: [] as string[], data: [] as Record<string, string>[] };
      }
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Financial Registry</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse Vietnam&apos;s comprehensive database of fintech companies, banks, investors, securities firms, and insurance providers
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading registry...</div>}>
        <RegistryTabs tabs={sheetResults} isPremium={subscribed} />
      </Suspense>
    </div>
  );
}
