"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ASEANCountryData } from "@/lib/fetch-asean";
import { CHART_TOOLTIP, GRID_STROKE, AXIS_STROKE, COUNTRY, COUNTRY_MUTED } from "@/lib/chart-theme";

export function ASEANDashboard({ data }: { data: ASEANCountryData[] }) {
  const vietnam = data.find((d) => d.code === "VNM");

  // Radar chart data — normalize to 0-100 scale
  const maxGDP = Math.max(...data.map((d) => d.gdpGrowth));
  const maxFDI = Math.max(...data.map((d) => d.fdi));
  const maxInternet = Math.max(...data.map((d) => d.internet));
  const maxPop = Math.max(...data.map((d) => d.population));

  const radarData = [
    { metric: "GDP Growth", ...Object.fromEntries(data.map((d) => [d.code, maxGDP > 0 ? (d.gdpGrowth / maxGDP) * 100 : 0])) },
    { metric: "FDI", ...Object.fromEntries(data.map((d) => [d.code, maxFDI > 0 ? (d.fdi / maxFDI) * 100 : 0])) },
    { metric: "Internet", ...Object.fromEntries(data.map((d) => [d.code, (d.internet / 100) * 100])) },
    { metric: "Population", ...Object.fromEntries(data.map((d) => [d.code, maxPop > 0 ? (d.population / maxPop) * 100 : 0])) },
  ];

  const metrics = [
    { key: "gdpGrowth", label: "GDP Growth (%)", format: (v: number) => `${v}%` },
    { key: "gdpBillions", label: "GDP ($B)", format: (v: number) => `$${v}B` },
    { key: "gdpPerCapita", label: "GDP/Capita ($)", format: (v: number) => `$${v.toLocaleString()}` },
    { key: "fdi", label: "FDI ($B)", format: (v: number) => `$${v}B` },
    { key: "inflation", label: "Inflation (%)", format: (v: number) => `${v}%` },
    { key: "population", label: "Population (M)", format: (v: number) => `${v}M` },
    { key: "internet", label: "Internet (%)", format: (v: number) => `${v}%` },
    { key: "mobile", label: "Mobile (per 100)", format: (v: number) => `${v}` },
  ];

  return (
    <div className="space-y-6">
      {/* Vietnam Highlight */}
      {vietnam && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{vietnam.gdpGrowth}%</div>
              <div className="text-xs text-muted-foreground">Vietnam GDP Growth</div>
              <Badge variant="default" className="mt-1 text-[10px]">
                #{data.sort((a, b) => b.gdpGrowth - a.gdpGrowth).findIndex((d) => d.code === "VNM") + 1} in ASEAN-6
              </Badge>
            </CardContent>
          </Card>
          <Card className="border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">${vietnam.gdpBillions}B</div>
              <div className="text-xs text-muted-foreground">Vietnam GDP</div>
              <Badge variant="outline" className="mt-1 text-[10px]">
                #{data.sort((a, b) => b.gdpBillions - a.gdpBillions).findIndex((d) => d.code === "VNM") + 1} in ASEAN-6
              </Badge>
            </CardContent>
          </Card>
          <Card className="border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">${vietnam.fdi}B</div>
              <div className="text-xs text-muted-foreground">Vietnam FDI</div>
              <Badge variant="outline" className="mt-1 text-[10px]">
                #{data.sort((a, b) => b.fdi - a.fdi).findIndex((d) => d.code === "VNM") + 1} in ASEAN-6
              </Badge>
            </CardContent>
          </Card>
          <Card className="border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{vietnam.internet}%</div>
              <div className="text-xs text-muted-foreground">Vietnam Internet</div>
              <Badge variant="outline" className="mt-1 text-[10px]">
                #{data.sort((a, b) => b.internet - a.internet).findIndex((d) => d.code === "VNM") + 1} in ASEAN-6
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GDP Growth Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>GDP Growth Rate</CardTitle>
            <CardDescription>Annual % — Vietnam highlighted</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sort((a, b) => b.gdpGrowth - a.gdpGrowth)}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="name" stroke={AXIS_STROKE} fontSize={11} />
                <YAxis stroke={AXIS_STROKE} fontSize={12} />
                <Tooltip contentStyle={CHART_TOOLTIP} />
                <Bar dataKey="gdpGrowth" name="GDP Growth (%)" radius={[4, 4, 0, 0]}>
                  {data.sort((a, b) => b.gdpGrowth - a.gdpGrowth).map((d) => (
                    <Cell key={d.code} fill={d.code === "VNM" ? COUNTRY.VNM : COUNTRY_MUTED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* FDI Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>FDI Inflows</CardTitle>
            <CardDescription>USD Billions — net inflows</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sort((a, b) => b.fdi - a.fdi)}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="name" stroke={AXIS_STROKE} fontSize={11} />
                <YAxis stroke={AXIS_STROKE} fontSize={12} />
                <Tooltip contentStyle={CHART_TOOLTIP} />
                <Bar dataKey="fdi" name="FDI ($B)" radius={[4, 4, 0, 0]}>
                  {data.sort((a, b) => b.fdi - a.fdi).map((d) => (
                    <Cell key={d.code} fill={d.code === "VNM" ? COUNTRY.VNM : COUNTRY_MUTED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Metric Comparison</CardTitle>
            <CardDescription>Normalized to highest performer = 100</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={GRID_STROKE} />
                <PolarAngleAxis dataKey="metric" stroke={AXIS_STROKE} fontSize={11} />
                <PolarRadiusAxis stroke={GRID_STROKE} fontSize={10} />
                {data.map((d) => (
                  <Radar
                    key={d.code}
                    dataKey={d.code}
                    name={d.name}
                    stroke={COUNTRY[d.code]}
                    fill={COUNTRY[d.code]}
                    fillOpacity={d.code === "VNM" ? 0.25 : 0.05}
                    strokeWidth={d.code === "VNM" ? 2 : 1}
                  />
                ))}
                <Tooltip contentStyle={CHART_TOOLTIP} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GDP Per Capita */}
        <Card>
          <CardHeader>
            <CardTitle>GDP Per Capita</CardTitle>
            <CardDescription>USD — reflects development stage & growth potential</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis type="number" stroke={AXIS_STROKE} fontSize={12} />
                <YAxis dataKey="name" type="category" stroke={AXIS_STROKE} fontSize={11} width={90} />
                <Tooltip contentStyle={CHART_TOOLTIP} formatter={(v) => [`$${Number(v).toLocaleString()}`, "GDP/Capita"]} />
                <Bar dataKey="gdpPerCapita" name="GDP/Capita ($)" radius={[0, 4, 4, 0]}>
                  {data.sort((a, b) => b.gdpPerCapita - a.gdpPerCapita).map((d) => (
                    <Cell key={d.code} fill={d.code === "VNM" ? COUNTRY.VNM : COUNTRY_MUTED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Full Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Full Comparison Table</CardTitle>
          <CardDescription>All indicators side by side — Vietnam highlighted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Country</th>
                  {metrics.map((m) => (
                    <th key={m.key} className="text-right py-3 px-3 font-medium text-muted-foreground text-xs">{m.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sort((a, b) => b.gdpGrowth - a.gdpGrowth).map((country) => (
                  <tr key={country.code} className={`border-b last:border-0 ${country.code === "VNM" ? "bg-primary/5 font-medium" : ""}`}>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2">
                        {country.name}
                        {country.code === "VNM" && <Badge variant="default" className="text-[9px]">VN</Badge>}
                      </span>
                    </td>
                    {metrics.map((m) => (
                      <td key={m.key} className="text-right py-3 px-3 font-mono text-xs">
                        {m.format(country[m.key as keyof ASEANCountryData] as number)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
