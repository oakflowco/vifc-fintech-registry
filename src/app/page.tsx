import type { Metadata } from "next";
import Link from "next/link";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchSheetData } from "@/lib/sheets";

export const metadata: Metadata = {
  title:
    "VIFC Database — Vietnam Financial Registry & Market Intelligence",
  description:
    "Vietnam's most comprehensive financial registry and market intelligence platform. Browse 300+ companies across fintech, banking, securities, insurance, and investment sectors.",
};

export const revalidate = 3600;

export default async function LandingPage() {
  // Fetch a few live stats for the hero
  const [macroData, ...sheetResults] = await Promise.all([
    fetchMacroData().catch(() => []),
    ...[
      process.env.GOOGLE_SHEET_FINTECH_URL,
      process.env.GOOGLE_SHEET_INVESTORS_URL,
      process.env.GOOGLE_SHEET_BANKS_URL,
      process.env.GOOGLE_SHEET_SECURITIES_URL,
      process.env.GOOGLE_SHEET_INSURANCE_URL,
      process.env.GOOGLE_SHEET_NEOBANKS_URL,
    ]
      .filter(Boolean)
      .map((url) =>
        fetchSheetData(url as string).catch(() => ({ headers: [], data: [] }))
      ),
  ]);

  const totalEntities = sheetResults.reduce((n, s) => n + s.data.length, 0);
  const registryCount = sheetResults.filter((s) => s.data.length > 0).length;
  const latestMacro = macroData[macroData.length - 1];

  return (
    <div className="flex flex-col">
      {/* ── Disclaimer ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground">
            Independent research platform. Data compiled from public sources including World Bank, Yahoo Finance, and Google News. Not affiliated with or endorsed by VIFC Da Nang.
          </p>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(220, 70%, 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(220, 70%, 60%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live data — auto-refreshes hourly
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Vietnam Financial Registry
            <br />
            <span className="text-primary">&amp; Market Intelligence</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Browse {totalEntities}+ companies across {registryCount} registries.
            Live macro data, fintech ecosystem maps, investor tools, and
            regulatory intelligence — built for professionals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              href="/registry"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Browse Registry
            </Link>
          </div>

          {/* Live stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              {
                label: "Entities Tracked",
                value: `${totalEntities}+`,
              },
              {
                label: "GDP (USD)",
                value: latestMacro
                  ? `$${latestMacro.gdpBillions}B`
                  : "—",
              },
              {
                label: "Registries",
                value: String(registryCount),
              },
              {
                label: "Data Sources",
                value: "12+",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to navigate Vietnam&apos;s financial landscape
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From macro indicators to company-level data — one platform for
            investors, analysts, and policymakers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Financial Registry",
              description:
                "300+ entities across fintech, banks, securities, insurance, neobanks, and investors. Searchable, filterable, exportable.",
              href: "/registry",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                </svg>
              ),
            },
            {
              title: "Live Market Data",
              description:
                "VN-Index, GDP growth, FDI inflows, inflation, internet penetration — sourced from World Bank & Yahoo Finance in real-time.",
              href: "/dashboard",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              ),
            },
            {
              title: "Trends & Intelligence",
              description:
                "Interactive bubble maps, ecosystem charts, regulatory milestones, and quarterly investment flows. Premium analytics.",
              href: "/trends",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              ),
            },
            {
              title: "ASEAN Comparison",
              description:
                "Benchmark Vietnam against Thailand, Indonesia, Philippines, Singapore, and Malaysia across key indicators.",
              href: "/asean",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              ),
            },
            {
              title: "Investor Guide",
              description:
                "Why Vietnam, VIFC Da Nang special zone, regulatory sandbox, capital markets overview, and risk disclosure.",
              href: "/why-vietnam",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              ),
            },
            {
              title: "Deals & Capital Flow",
              description:
                "Track dealflow, domestic vs foreign investment, top investor countries, and startup funding stages.",
              href: "/deals",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              ),
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Registries ── */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Six registries. One platform.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every major financial sector in Vietnam, searchable and
              filterable with live data updated hourly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Fintech", href: "/", count: sheetResults[0]?.data.length || 0 },
              { name: "Investors", href: "/investors", count: sheetResults[1]?.data.length || 0 },
              { name: "Banks", href: "/banks", count: sheetResults[2]?.data.length || 0 },
              { name: "Securities", href: "/securities", count: sheetResults[3]?.data.length || 0 },
              { name: "Insurance", href: "/insurance", count: sheetResults[4]?.data.length || 0 },
              { name: "Neobanks", href: "/neobanks", count: sheetResults[5]?.data.length || 0 },
            ].map((reg) => (
              <Link
                key={reg.name}
                href={reg.href}
                className="group flex flex-col items-center rounded-xl border border-border/50 p-5 text-center transition-all hover:border-primary/30 hover:bg-background"
              >
                <span className="text-2xl font-bold">{reg.count}</span>
                <span className="mt-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {reg.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to explore?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Start with the free dashboard or unlock premium intelligence
            including trends, CSV exports, and advanced analytics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 justify-center rounded-lg border border-border px-8 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              View Plans
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                PRO
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
