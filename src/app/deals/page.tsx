import type { Metadata } from "next";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { PremiumGate } from "@/components/premium-gate";
import { fetchSheetData } from "@/lib/sheets";
import { fetchDealNews } from "@/lib/fetch-deals-news";
import { RegistryTable } from "@/components/registry-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Vietnam Fintech Deal Flow & M&A Tracker",
  description:
    "Track the latest fintech deals, M&A activity, and investment rounds in Vietnam's financial technology sector.",
};

export const revalidate = 3600; // refresh hourly

const SHEET_URL = process.env.GOOGLE_SHEET_DEALS_URL;

export default async function DealsPage() {
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;
  const subscribed = user ? hasActiveSubscription(user) : false;

  if (!subscribed) {
    return <PremiumGate feature="Vietnam Fintech Deal Flow & M&A Intelligence" />;
  }

  // Fetch both in parallel
  const [sheetResult, liveDeals] = await Promise.all([
    SHEET_URL
      ? fetchSheetData(SHEET_URL).catch(() => ({ headers: [], data: [] }))
      : Promise.resolve({ headers: [], data: [] }),
    fetchDealNews(),
  ]);

  const { headers, data } = sheetResult;

  // Calculate stats from sheet data
  const totalDeals = data.length;
  const totalAmount = data.reduce((sum, d) => {
    const amt = parseFloat(d["Amount (USD M)"] || d["Amount"] || "0");
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);
  const uniqueInvestors = new Set(
    data.map((d) => d["Lead Investor"] || d["Investor"]).filter(Boolean)
  ).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deal Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Funding rounds, M&A, and investment activity in Vietnam&apos;s fintech ecosystem
          </p>
        </div>
        {liveDeals.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            LIVE NEWS
          </span>
        )}
      </div>

      {/* Live Deal News Feed */}
      {liveDeals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Latest Deal News
            <span className="text-[10px] text-muted-foreground font-mono font-normal">
              Auto-refreshes hourly via Google News
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveDeals.map((deal, i) => (
              <Card key={i} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground">{deal.date}</span>
                    {deal.stage && (
                      <Badge variant="default" className="text-[9px]">{deal.stage}</Badge>
                    )}
                    {deal.amount && (
                      <Badge variant="secondary" className="text-[9px] font-mono">{deal.amount}</Badge>
                    )}
                  </div>
                  {deal.url ? (
                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors block leading-snug"
                    >
                      {deal.title}
                    </a>
                  ) : (
                    <p className="text-sm font-medium leading-snug">{deal.title}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">{deal.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Curated Deal Database */}
      {data.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Curated Deal Database</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{totalDeals}</div>
                <div className="text-xs text-muted-foreground">Total Deals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">${Math.round(totalAmount)}M</div>
                <div className="text-xs text-muted-foreground">Total Invested</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">
                  ${totalDeals > 0 ? Math.round(totalAmount / totalDeals) : 0}M
                </div>
                <div className="text-xs text-muted-foreground">Avg Deal Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{uniqueInvestors}</div>
                <div className="text-xs text-muted-foreground">Unique Investors</div>
              </CardContent>
            </Card>
          </div>

          <RegistryTable headers={headers} data={data} exportType="deals" />
        </>
      )}

      {data.length === 0 && liveDeals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No deal data yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Deal news will appear automatically. Structured deal data with amounts, investors, and stages
              is coming soon.
            </p>
          </CardContent>
        </Card>
      )}

      {data.length === 0 && liveDeals.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Want structured deal data?</CardTitle>
            <CardDescription className="text-xs">
              The live news feed above is automatic. Detailed structured data (exact amounts, investors, stages)
              is coming soon.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
