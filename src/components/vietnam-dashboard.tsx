"use client";

import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MacroYear } from "@/lib/fetch-world-bank";
import type { StockDataPoint, YearlyStock } from "@/lib/fetch-stock";
import type { BankingData } from "@/lib/fetch-banking";
import type { ASEANCountryData } from "@/lib/fetch-asean";

const CS = { backgroundColor: "hsl(0,0%,12%)", border: "1px solid hsl(0,0%,20%)", borderRadius: "8px", color: "white" };
const GRID = "hsl(0,0%,20%)";
const AXIS = "hsl(0,0%,50%)";

interface Props {
  macroData: MacroYear[];
  latestMacro: MacroYear | undefined;
  prevMacro: MacroYear | undefined;
  bankingData: BankingData[];
  latestBanking: BankingData | undefined;
  vnIndexMonthly: StockDataPoint[];
  vnIndexYearly: YearlyStock[];
  latestStock: YearlyStock | undefined;
  prevStock: YearlyStock | undefined;
  aseanData: ASEANCountryData[];
  totalEntities: number;
  cityCount: [string, number][];
  categoryCount: [string, number][];
  vifcDaNang: number;
  vifcHCMC: number;
  unicorns: { name: string; valuation: string; sector: string; status: string }[];
  ratings: { agency: string; rating: string; outlook: string }[];
}

function Metric({ label, value, sub, live }: { label: string; value: string; sub?: string; live?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
          {live && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function pctChange(curr: number, prev: number): string {
  if (!prev || prev === 0) return "—";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function VietnamDashboard(props: Props) {
  const {
    macroData, latestMacro, prevMacro, bankingData, latestBanking,
    vnIndexMonthly, vnIndexYearly, latestStock, prevStock,
    aseanData, totalEntities, cityCount, categoryCount,
    vifcDaNang, vifcHCMC, unicorns, ratings,
  } = props;

  const vietnam = aseanData.find((d) => d.code === "VNM");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Vietnam at a Glance</h1>
            <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time financial dashboard — World Bank, Yahoo Finance, and registry data
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-muted-foreground font-mono">
            Updated: {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
          </p>
        </div>
      </div>

      {/* === ROW 1: Key Macro Metrics === */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <Metric label="GDP" value={latestMacro ? `$${latestMacro.gdpBillions}B` : "—"} sub={latestMacro ? `${latestMacro.gdpGrowth > 0 ? "+" : ""}${latestMacro.gdpGrowth}% growth` : undefined} live />
        <Metric label="VN-Index" value={latestStock ? latestStock.yearEnd.toLocaleString() : "—"} sub={prevStock ? pctChange(latestStock?.yearEnd ?? 0, prevStock.yearEnd) + " YoY" : undefined} live />
        <Metric label="FDI Inflows" value={latestMacro ? `$${latestMacro.fdi}B` : "—"} sub={prevMacro ? pctChange(latestMacro?.fdi ?? 0, prevMacro.fdi) + " YoY" : undefined} live />
        <Metric label="Population" value={latestMacro ? `${latestMacro.population}M` : "—"} sub="Median age ~31" live />
        <Metric label="Internet" value={latestMacro ? `${latestMacro.internetPenetration}%` : "—"} sub="Of population" live />
        <Metric label="Inflation" value={latestMacro ? `${latestMacro.inflation}%` : "—"} sub="CPI annual" live />
      </div>

      {/* === ROW 2: Banking & Financial Health === */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <Metric label="Credit / GDP" value={latestBanking ? `${latestBanking.domesticCredit}%` : "—"} sub="Domestic credit" live />
        <Metric label="NPL Ratio" value={latestBanking ? `${latestBanking.bankNPL}%` : "—"} sub="Non-performing loans" live />
        <Metric label="Debt / GDP" value={latestBanking ? `${latestBanking.debtGDP}%` : "—"} sub="Government debt" live />
        <Metric label="Reserves" value={latestBanking ? `$${latestBanking.reservesBillions}B` : "—"} sub="Foreign reserves" live />
        <Metric label="Bank Capital" value={latestBanking ? `${latestBanking.bankCapital}%` : "—"} sub="Capital to assets" live />
        <Metric label="Account Access" value={latestBanking ? `${latestBanking.accountOwnership}%` : "—"} sub="Adults with account" live />
      </div>

      {/* === ROW 3: Sovereign Ratings + VIFC + Ecosystem === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Sovereign Ratings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sovereign Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              {ratings.map((r) => (
                <div key={r.agency}>
                  <p className="text-[10px] text-muted-foreground">{r.agency}</p>
                  <p className="text-xl font-bold">{r.rating}</p>
                  <Badge variant={r.outlook === "Positive" ? "default" : "outline"} className="text-[9px]">{r.outlook}</Badge>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">1 notch below investment grade</p>
          </CardContent>
        </Card>

        {/* VIFC Members */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">VIFC Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center mb-3">
              <div>
                <p className="text-2xl font-bold">{vifcDaNang}</p>
                <p className="text-[10px] text-muted-foreground">Da Nang</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{vifcHCMC}</p>
                <p className="text-[10px] text-muted-foreground">Ho Chi Minh City</p>
              </div>
            </div>
            <Link href="/vifc" className="text-xs text-primary hover:underline block text-center">View VIFC details →</Link>
          </CardContent>
        </Card>

        {/* Ecosystem */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Financial Ecosystem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center mb-1">{totalEntities}+</p>
            <p className="text-[10px] text-muted-foreground text-center mb-3">Registered entities in our database</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {cityCount.slice(0, 3).map(([city, count]) => (
                <Badge key={city} variant="outline" className="text-[9px]">{city}: {count}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === ROW 4: Charts === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* VN-Index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">VN-Index (Monthly) <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /></CardTitle>
          </CardHeader>
          <CardContent>
            {vnIndexMonthly.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={vnIndexMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="date" stroke={AXIS} fontSize={9} interval={4} />
                  <YAxis stroke={AXIS} fontSize={10} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={CS} />
                  <Area type="monotone" dataKey="close" stroke="hsl(220,70%,55%)" fill="hsl(220,70%,55%)" fillOpacity={0.15} name="VN-Index" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Unable to fetch stock data</p>}
          </CardContent>
        </Card>

        {/* GDP + FDI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">GDP Growth & FDI <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /></CardTitle>
          </CardHeader>
          <CardContent>
            {macroData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="year" stroke={AXIS} fontSize={10} />
                  <YAxis yAxisId="left" stroke={AXIS} fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke={AXIS} fontSize={10} />
                  <Tooltip contentStyle={CS} />
                  <Bar yAxisId="left" dataKey="gdpGrowth" fill="hsl(160,60%,45%)" name="GDP Growth (%)" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="right" dataKey="fdi" fill="hsl(220,70%,55%)" name="FDI ($B)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Unable to fetch data</p>}
          </CardContent>
        </Card>

        {/* Banking Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">Banking Health <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /></CardTitle>
          </CardHeader>
          <CardContent>
            {bankingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bankingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="year" stroke={AXIS} fontSize={10} />
                  <YAxis stroke={AXIS} fontSize={10} />
                  <Tooltip contentStyle={CS} />
                  <Line type="monotone" dataKey="domesticCredit" stroke="hsl(220,70%,55%)" strokeWidth={2} name="Credit/GDP (%)" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="bankNPL" stroke="hsl(350,65%,55%)" strokeWidth={2} name="NPL (%)" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="debtGDP" stroke="hsl(30,80%,55%)" strokeWidth={2} name="Debt/GDP (%)" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Unable to fetch data</p>}
          </CardContent>
        </Card>

        {/* Trade & Reserves */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">Trade & Reserves <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /></CardTitle>
          </CardHeader>
          <CardContent>
            {bankingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bankingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="year" stroke={AXIS} fontSize={10} />
                  <YAxis stroke={AXIS} fontSize={10} />
                  <Tooltip contentStyle={CS} />
                  <Bar dataKey="reservesBillions" fill="hsl(160,60%,45%)" name="Reserves ($B)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="exportsGDP" fill="hsl(220,70%,55%)" name="Exports (% GDP)" radius={[3, 3, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Unable to fetch data</p>}
          </CardContent>
        </Card>
      </div>

      {/* === ROW 5: Sector Heat Map + Unicorns === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sector Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sector Distribution</CardTitle>
            <CardDescription className="text-xs">Computed from registry data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {categoryCount.map(([cat, count]) => {
                const pct = totalEntities > 0 ? Math.round((count / totalEntities) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="truncate pr-2">{cat}</span>
                      <span className="text-muted-foreground shrink-0">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Unicorns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Unicorns & Notable Companies</CardTitle>
            <CardDescription className="text-xs">Vietnam&apos;s most valuable tech/fintech companies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {unicorns.map((u) => (
                <div key={u.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.sector}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold font-mono">{u.valuation}</p>
                    <Badge variant={u.status.includes("Unicorn") ? "default" : "outline"} className="text-[8px]">{u.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === ROW 6: ASEAN Comparison Mini === */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Vietnam vs ASEAN Peers</CardTitle>
              <CardDescription className="text-xs">Live World Bank data — Vietnam highlighted</CardDescription>
            </div>
            <Link href="/asean" className="text-xs text-primary hover:underline">Full dashboard →</Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 font-medium text-muted-foreground">Country</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">GDP Growth</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">GDP ($B)</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">FDI ($B)</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Internet %</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Population (M)</th>
                </tr>
              </thead>
              <tbody>
                {aseanData.sort((a, b) => b.gdpGrowth - a.gdpGrowth).map((c) => (
                  <tr key={c.code} className={`border-b last:border-0 ${c.code === "VNM" ? "bg-primary/5 font-medium" : ""}`}>
                    <td className="py-2 pr-3">
                      {c.name} {c.code === "VNM" && <Badge variant="default" className="text-[8px] ml-1">VN</Badge>}
                    </td>
                    <td className="text-right py-2 px-2 font-mono">{c.gdpGrowth}%</td>
                    <td className="text-right py-2 px-2 font-mono">${c.gdpBillions}</td>
                    <td className="text-right py-2 px-2 font-mono">${c.fdi}</td>
                    <td className="text-right py-2 px-2 font-mono">{c.internet}%</td>
                    <td className="text-right py-2 px-2 font-mono">{c.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* === Quick Links === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/why-vietnam", label: "Why Vietnam?", desc: "Investment thesis" },
          { href: "/vifc", label: "VIFC Da Nang", desc: "Setup & incentives" },
          { href: "/investor-guide", label: "Investor Guide", desc: "Step by step" },
          { href: "/trends", label: "Trends PRO", desc: "Full analysis" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
