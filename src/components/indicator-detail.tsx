"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CHART_TOOLTIP, GRID_STROKE, AXIS_STROKE, PALETTE } from "@/lib/chart-theme";

interface IndicatorDetailProps {
  title: string;
  description: string;
  source: string;
  unit: string;
  chartData: { label: string; value: number }[];
  tableData: Record<string, string | number>[];
  tableColumns: { key: string; label: string }[];
  chartLabel: string;
  highlightColumn?: string;
}

export function IndicatorDetail({
  title,
  description,
  source,
  unit,
  chartData,
  tableData,
  tableColumns,
  chartLabel,
  highlightColumn,
}: IndicatorDetailProps) {
  // Compute stats
  const values = chartData.map((d) => d.value).filter((v) => v > 0);
  const current = values[values.length - 1] ?? 0;
  const previous = values[values.length - 2] ?? 0;
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const isLargeDataset = chartData.length > 20;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          href="/trends"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Trends
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <Badge variant="outline" className="text-[10px] font-mono">
            {source}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Latest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {current.toLocaleString()} {unit}
            </div>
            <p
              className={`text-xs mt-1 ${change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground"}`}
            >
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}% vs previous
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Period High</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {max.toLocaleString()} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Period Low</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {min.toLocaleString()} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Period Average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avg.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{chartLabel} — Historical Trend</CardTitle>
          <CardDescription>
            {chartData[0]?.label} to {chartData[chartData.length - 1]?.label} ·{" "}
            {chartData.length} data points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {isLargeDataset ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="label"
                  stroke={AXIS_STROKE}
                  fontSize={10}
                  interval={Math.floor(chartData.length / 12)}
                />
                <YAxis stroke={AXIS_STROKE} fontSize={12} domain={["auto", "auto"]} />
                <Tooltip contentStyle={CHART_TOOLTIP} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={PALETTE[0]}
                  fill={PALETTE[0]}
                  fillOpacity={0.15}
                  name={chartLabel}
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="label" stroke={AXIS_STROKE} fontSize={12} />
                <YAxis stroke={AXIS_STROKE} fontSize={12} domain={["auto", "auto"]} />
                <Tooltip contentStyle={CHART_TOOLTIP} />
                <Bar
                  dataKey="value"
                  fill={PALETTE[0]}
                  name={chartLabel}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Full Data Table</CardTitle>
          <CardDescription>
            All available data points — {tableData.length} rows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={
                        col.key === highlightColumn
                          ? "bg-primary/10 font-semibold"
                          : ""
                      }
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, i) => (
                  <TableRow key={i}>
                    {tableColumns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`font-mono text-sm ${
                          col.key === highlightColumn
                            ? "bg-primary/5 font-semibold"
                            : ""
                        }`}
                      >
                        {typeof row[col.key] === "number"
                          ? (row[col.key] as number).toLocaleString(undefined, {
                              maximumFractionDigits: 1,
                            })
                          : row[col.key] ?? "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
