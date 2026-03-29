import type { Metadata } from "next";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { PremiumGate } from "@/components/premium-gate";
import { fetchASEANComparison } from "@/lib/fetch-asean";
import { ASEANDashboard } from "@/components/asean-dashboard";

export const metadata: Metadata = {
  title: "Vietnam vs ASEAN Economic Comparison",
  description:
    "Compare Vietnam's GDP, FDI, and fintech ecosystem against Singapore, Thailand, Indonesia, Philippines, and Malaysia with live World Bank data.",
};

export const revalidate = 86400; // daily

export default async function ASEANPage() {
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;
  const subscribed = user ? hasActiveSubscription(user) : false;

  if (!subscribed) {
    return <PremiumGate feature="Vietnam vs ASEAN Comparison Dashboard" />;
  }

  const data = await fetchASEANComparison();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vietnam vs ASEAN Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live macroeconomic comparison across 6 ASEAN economies — data from World Bank
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
          Source: World Bank Open Data
        </span>
      </div>
      <ASEANDashboard data={data} />
    </div>
  );
}
