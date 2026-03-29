"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FintechBubbleMap } from "@/components/fintech-bubble-map";
import type { MacroYear } from "@/lib/fetch-world-bank";
import type { StockDataPoint, YearlyStock } from "@/lib/fetch-stock";

interface NewsItem {
  date: string;
  title: string;
  summary: string;
  category: string;
  url?: string;
}

interface RelatedLink {
  title: string;
  url: string;
  source: string;
  description: string;
}

interface TrendChartsProps {
  keyMetrics: { label: string; value: string; change: string; slug?: string }[];
  macroData: MacroYear[];
  vnIndexMonthly: StockDataPoint[];
  vnIndexYearly: YearlyStock[];
  liveNews?: NewsItem[];
  categoryDistribution: { category: string; count: number; share: number }[];
  quarterlyInvestment: { quarter: string; domestic: number; foreign: number }[];
  startupsByCity: { city: string; startups: number; funding: number; pct: number }[];
  startupStages: { stage: string; count: number; avgTicket: number }[];
  investorCountries: { country: string; deals: number; amount: number }[];
  regulatoryMilestones: { date: string; event: string; url?: string }[];
  relatedLinks: RelatedLink[];
  registryEntities?: { name: string; category: string; city: string; status: string }[];
}

import { CHART_TOOLTIP, GRID_STROKE, AXIS_STROKE, PALETTE } from "@/lib/chart-theme";

const NEWS_COLORS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  VIFC: "default",
  Regulation: "secondary",
  Crypto: "destructive",
  Fintech: "outline",
  "Capital Markets": "outline",
  Payments: "outline",
  Investment: "outline",
  Economy: "outline",
};

function MetricCard({ label, value, change, slug }: { label: string; value: string; change: string; slug?: string }) {
  const isPositive = change.startsWith("+");
  const isNeutral = change === "—";
  const content = (
    <Card className={slug ? "transition-colors hover:border-primary/50 cursor-pointer" : ""}>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs">{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className={`text-xs mt-1 ${isNeutral ? "text-muted-foreground" : isPositive ? "text-green-500" : "text-red-500"}`}>
            {change} {!isNeutral && "YoY"}
          </p>
          {slug && <span className="text-[10px] text-muted-foreground">Details →</span>}
        </div>
      </CardContent>
    </Card>
  );
  if (slug) {
    return <a href={`/trends/${slug}`}>{content}</a>;
  }
  return content;
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-mono">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
      LIVE
    </span>
  );
}

export function TrendCharts({
  keyMetrics,
  macroData,
  vnIndexMonthly,
  vnIndexYearly,
  liveNews,
  categoryDistribution,
  quarterlyInvestment,
  startupsByCity,
  startupStages,
  investorCountries,
  regulatoryMilestones,
  relatedLinks,
  registryEntities,
}: TrendChartsProps) {
  return (
    <div className="space-y-8">
      {/* ── Key Metrics ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Key Indicators</h2>
          <LiveBadge />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {keyMetrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </section>

      {/* ── Capital Markets (LIVE) ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Capital Markets & Macro Economy</h2>
          <LiveBadge />
          <span className="text-[10px] text-muted-foreground font-mono ml-auto">Source: World Bank, Yahoo Finance</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* VN-Index Monthly */}
          <Card>
            <CardHeader>
              <CardTitle>VN-Index (Monthly)</CardTitle>
              <CardDescription>
                {vnIndexMonthly.length > 0
                  ? `${vnIndexMonthly[0].date} to ${vnIndexMonthly[vnIndexMonthly.length - 1].date}`
                  : "Loading..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vnIndexMonthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={vnIndexMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis dataKey="date" stroke={AXIS_STROKE} fontSize={10} interval={2} />
                    <YAxis stroke={AXIS_STROKE} fontSize={12} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                    <Area type="monotone" dataKey="close" stroke={PALETTE[0]} fill={PALETTE[0]} fillOpacity={0.15} name="VN-Index" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Unable to fetch stock data
                </div>
              )}
            </CardContent>
          </Card>

          {/* VN-Index Yearly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>VN-Index Yearly Summary</CardTitle>
              <CardDescription>Year-end close, high, and low</CardDescription>
            </CardHeader>
            <CardContent>
              {vnIndexYearly.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vnIndexYearly}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis dataKey="year" stroke={AXIS_STROKE} fontSize={12} />
                    <YAxis stroke={AXIS_STROKE} fontSize={12} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                    <Legend />
                    <Bar dataKey="yearEnd" fill={PALETTE[0]} name="Year End" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="yearHigh" fill={PALETTE[1]} name="Year High" radius={[4, 4, 0, 0]} opacity={0.6} />
                    <Bar dataKey="yearLow" fill={PALETTE[4]} name="Year Low" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Unable to fetch stock data
                </div>
              )}
            </CardContent>
          </Card>

          {/* GDP & FDI (World Bank LIVE) */}
          <Card>
            <CardHeader>
              <CardTitle>GDP Growth & FDI Inflows</CardTitle>
              <CardDescription>World Bank Open Data — Vietnam</CardDescription>
            </CardHeader>
            <CardContent>
              {macroData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={macroData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis dataKey="year" stroke={AXIS_STROKE} fontSize={12} />
                    <YAxis yAxisId="left" stroke={AXIS_STROKE} fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke={AXIS_STROKE} fontSize={12} />
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="gdpGrowth" fill={PALETTE[1]} name="GDP Growth (%)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="fdi" fill={PALETTE[0]} name="FDI ($B)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Unable to fetch World Bank data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internet & Population (World Bank LIVE) */}
          <Card>
            <CardHeader>
              <CardTitle>Internet Penetration & GDP</CardTitle>
              <CardDescription>Digital infrastructure growth</CardDescription>
            </CardHeader>
            <CardContent>
              {macroData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={macroData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis dataKey="year" stroke={AXIS_STROKE} fontSize={12} />
                    <YAxis yAxisId="left" stroke={AXIS_STROKE} fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke={AXIS_STROKE} fontSize={12} />
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="internetPenetration" stroke={PALETTE[2]} strokeWidth={2} name="Internet (%)" dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="gdpBillions" stroke={PALETTE[3]} strokeWidth={2} name="GDP ($B)" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Unable to fetch World Bank data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Fintech Ecosystem ── */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Fintech Ecosystem</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Fintech companies by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="category"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    fontSize={10}
                  >
                    {categoryDistribution.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value, name) => [`${value} companies`, String(name)]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Entities by City
                <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-mono font-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  LIVE
                </span>
              </CardTitle>
              <CardDescription>Computed from registry data — auto-refreshes hourly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startupsByCity.map((city) => (
                  <div key={city.city}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{city.city}</span>
                      <span className="text-muted-foreground">
                        {city.startups} entities · {city.pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${city.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domestic vs Foreign Investment</CardTitle>
              <CardDescription>Quarterly flow (USD M)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quarterlyInvestment}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis dataKey="quarter" stroke={AXIS_STROKE} fontSize={11} />
                  <YAxis stroke={AXIS_STROKE} fontSize={12} />
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                  <Legend />
                  <Bar dataKey="domestic" fill={PALETTE[0]} name="Domestic ($M)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="foreign" fill={PALETTE[1]} name="Foreign ($M)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Investor Countries</CardTitle>
              <CardDescription>By deal count & total amount (USD M)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investorCountries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis type="number" stroke={AXIS_STROKE} fontSize={12} />
                  <YAxis dataKey="country" type="category" stroke={AXIS_STROKE} fontSize={11} width={110} />
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                  <Legend />
                  <Bar dataKey="amount" fill={PALETTE[2]} name="Amount ($M)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="deals" fill={PALETTE[3]} name="Deals" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Vietnam Fintech Registry Map ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Vietnam Financial Registry Map</h2>
          <LiveBadge />
          <span className="text-[10px] text-muted-foreground font-mono ml-auto">Source: VIFC Registry Database</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Entities by Category</CardTitle>
              <CardDescription>
                Interactive bubble map — click a category to explore. Sized by entity count, sourced live from the registry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registryEntities && registryEntities.length > 0 ? (
                <FintechBubbleMap entities={registryEntities} />
              ) : (
                <div className="h-[480px] flex items-center justify-center text-sm text-muted-foreground">
                  Unable to load registry data
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Resources</CardTitle>
              <CardDescription>External research tracking Vietnam&apos;s fintech landscape</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "StartupBlink — Top Startups Vietnam",
                    description: "792+ ranked startups with interactive map and ecosystem scores",
                    url: "https://www.startupblink.com/top-startups/vietnam",
                    badge: "2026",
                  },
                  {
                    title: "WorldFIS — Vietnam Fintech Ecosystem",
                    description: "Growth trends, challenges & opportunities outlook",
                    url: "https://vietnam.worldfis.com/blogs/vietnams-fintech-ecosystem-growth-trends-challenges-and-opportunities/",
                    badge: "2026",
                  },
                  {
                    title: "InnReg — Vietnam Fintech Trends",
                    description: "Top companies, market growth analysis & $45B forecast",
                    url: "https://www.innreg.com/blog/vietnam-fintech-trends",
                    badge: "2025",
                  },
                  {
                    title: "Fintech Singapore — Startup Map",
                    description: "118+ startups mapped across sectors (2020 edition)",
                    url: "https://fintechnews.sg/vietnam-fintech-startups/",
                    badge: "2020",
                  },
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-border/50 p-3 transition-colors hover:border-primary/50 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{link.badge}</Badge>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">{link.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── News (LIVE) & Regulatory Timeline ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">IFC News & Regulatory Developments</h2>
          {liveNews && liveNews.length > 0 && <LiveBadge />}
          {liveNews && liveNews.length > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono ml-auto">Source: Google News</span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
              <CardDescription>
                {liveNews && liveNews.length > 0
                  ? "Live feed — auto-refreshes hourly"
                  : "Key developments shaping Vietnam's financial landscape"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {(liveNews ?? []).map((item, i) => (
                  <div key={i} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{item.date}</span>
                      <Badge variant={NEWS_COLORS[item.category] || "outline"} className="text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mb-1 hover:text-primary transition-colors block">
                        {item.title}
                      </a>
                    ) : (
                      <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                  </div>
                ))}
                {(!liveNews || liveNews.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Unable to fetch live news — check back later
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Milestones</CardTitle>
              <CardDescription>Key policy developments shaping Vietnam fintech</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatoryMilestones.map((m, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <Badge variant="outline" className="shrink-0 font-mono text-xs">
                      {m.date}
                    </Badge>
                    {m.url ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        {m.event}
                        <svg className="h-3 w-3 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{m.event}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Related Links & Resources</CardTitle>
            <CardDescription>Official sources, regulatory bodies, and industry resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-border/50 p-3 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px]">{link.source}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{link.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
