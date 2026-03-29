"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistryEntry } from "@/lib/sheets";

const FREE_ROW_LIMIT = 10;
const BLUR_PREVIEW_COUNT = 3;

interface RegistryTableProps {
  headers: string[];
  data: RegistryEntry[];
  filterColumns?: string[];
  exportType?: string;
  isPremium?: boolean;
}

const STATUS_KEYWORDS: Record<string, "default" | "secondary" | "destructive"> =
  {
    active: "default",
    approved: "default",
    licensed: "default",
    operating: "default",
    "vifc da nang": "default",
    "vifc hcmc": "default",
    member: "default",
    sandbox: "secondary",
    applicant: "secondary",
    pending: "secondary",
    review: "secondary",
    revoked: "destructive",
    suspended: "destructive",
    expired: "destructive",
    inactive: "destructive",
  };

function isFilterColumn(header: string) {
  const h = header.toLowerCase();
  return (
    h.includes("status") ||
    h.includes("category") ||
    h.includes("type") ||
    h.includes("tier") ||
    h.includes("sector") ||
    h.includes("headquarters") ||
    h.includes("location") ||
    h.includes("city") ||
    h.includes("country")
  );
}

function isBadgeColumn(header: string) {
  const h = header.toLowerCase();
  return (
    h.includes("status") ||
    h.includes("category") ||
    h.includes("type") ||
    h.includes("tier") ||
    h.includes("sector")
  );
}

function badgeVariant(
  value: string
): "default" | "secondary" | "destructive" | "outline" {
  const v = value.toLowerCase();
  for (const [keyword, variant] of Object.entries(STATUS_KEYWORDS)) {
    if (v.includes(keyword)) return variant;
  }
  return "outline";
}

function isUrlValue(value: string) {
  return (
    value.startsWith("http") ||
    value.includes(".com") ||
    value.includes(".vn") ||
    value.includes(".org") ||
    value.includes(".io")
  );
}

function getWebsiteDomain(entry: RegistryEntry): string | null {
  const raw =
    entry["Website"] || entry["website"] || entry["URL"] || entry["url"] || "";
  if (!raw) return null;
  try {
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(url).hostname;
  } catch {
    // handle bare domains like "momo.vn"
    if (raw.includes(".")) return raw.replace(/^www\./, "");
    return null;
  }
}

function CompanyLogo({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-[9px] font-bold text-muted-foreground">
        {domain.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={24}
      height={24}
      className="h-6 w-6 shrink-0 rounded"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function RegistryTable({
  headers,
  data,
  filterColumns,
  exportType,
  isPremium,
}: RegistryTableProps) {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Hide the ID column — we show row numbers in the # column instead
  const displayHeaders = useMemo(
    () => headers.filter((h) => h !== "ID" && h !== "id"),
    [headers]
  );

  const filtersConfig = useMemo(() => {
    const cols = filterColumns ?? headers.filter((h) => isFilterColumn(h));
    return cols
      .map((col) => ({
        column: col,
        options: Array.from(new Set(data.map((d) => d[col]).filter(Boolean))).sort(),
      }))
      .filter((f) => f.options.length >= 2); // hide filters with only 1 unique value
  }, [headers, data, filterColumns]);

  const filtered = useMemo(() => {
    return data.filter((entry) => {
      const matchesSearch =
        !search ||
        Object.values(entry).some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        );
      const matchesFilters = Object.entries(filters).every(
        ([col, val]) => !val || val === "all" || entry[col] === val
      );
      return matchesSearch && matchesFilters;
    });
  }, [data, search, filters]);

  const showPaywall = !isPremium && filtered.length > FREE_ROW_LIMIT;
  const visibleRows = showPaywall ? filtered.slice(0, FREE_ROW_LIMIT) : filtered;
  const blurredRows = showPaywall
    ? filtered.slice(FREE_ROW_LIMIT, FREE_ROW_LIMIT + BLUR_PREVIEW_COUNT)
    : [];

  const setFilter = (col: string) => (value: string | null) => {
    setFilters((prev) => ({ ...prev, [col]: value ?? "all" }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder={t.common.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {filtersConfig.map(({ column, options }) => (
            <Select
              key={column}
              value={filters[column] || "all"}
              onValueChange={setFilter(column)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {filters[column] && filters[column] !== "all"
                    ? `${column}: ${filters[column]}`
                    : `${t.common.all} ${column}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.common.all} {column}</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {!isPremium && filtered.length > FREE_ROW_LIMIT ? (
            <>
              {t.common.showing} {FREE_ROW_LIMIT} {t.common.of} {filtered.length} {t.common.entries}
              <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                🔒 Free preview
              </span>
            </>
          ) : (
            <>
              {t.common.showing} {filtered.length} {t.common.of} {data.length} {t.common.entries}
            </>
          )}
        </span>
        {exportType && (
          <a
            href={`/api/export?type=${exportType}`}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span>↓</span> {t.common.exportCsv}
            <span className="inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
              PRO
            </span>
          </a>
        )}
      </div>

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              {displayHeaders.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayHeaders.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t.common.noData}
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((entry, i) => {
                const originalIndex = data.indexOf(entry) + 1;
                const profileHref = exportType ? `/company/${exportType}/${originalIndex}` : undefined;
                return (
                <TableRow key={i} className={profileHref ? "cursor-pointer hover:bg-muted/50" : ""}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  {displayHeaders.map((h, colIdx) => {
                    const value = entry[h] || "";
                    const isNameCol = colIdx === 0 || h.toLowerCase().includes("company name") || h.toLowerCase().includes("name");
                    if (isNameCol && value) {
                      const domain = getWebsiteDomain(entry);
                      return (
                        <TableCell key={h}>
                          <div className="flex items-center gap-2">
                            {domain && <CompanyLogo domain={domain} />}
                            {profileHref ? (
                              <Link href={profileHref} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                                {value}
                              </Link>
                            ) : (
                              <span className="text-sm font-medium">{value}</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    }
                    if (isBadgeColumn(h) && value) {
                      return (
                        <TableCell key={h}>
                          <Badge variant={badgeVariant(value)}>{value}</Badge>
                        </TableCell>
                      );
                    }
                    if (isUrlValue(value)) {
                      const url = value.startsWith("http")
                        ? value
                        : `https://${value}`;
                      return (
                        <TableCell key={h}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4 text-sm"
                          >
                            {value.replace(/^https?:\/\//, "")}
                          </a>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={h} className="text-sm">
                        {value || "—"}
                      </TableCell>
                    );
                  })}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Blur overlay for gated rows */}
      {showPaywall && (
        <div className="relative -mt-4">
          {/* Blurred preview rows */}
          <div className="opacity-30 blur-sm select-none pointer-events-none overflow-hidden rounded-lg border">
            <Table>
              <TableBody>
                {blurredRows.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {FREE_ROW_LIMIT + i + 1}
                    </TableCell>
                    {displayHeaders.map((h) => {
                      const value = entry[h] || "";
                      if (isBadgeColumn(h) && value) {
                        return (
                          <TableCell key={h}>
                            <Badge variant={badgeVariant(value)}>{value}</Badge>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={h} className="text-sm">
                          {value || "—"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Gradient overlay with CTA */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-card/70 to-card rounded-lg">
            <div className="text-center space-y-3 px-6 py-8">
              <p className="text-base font-semibold tracking-tight">
                Subscribe to view all {filtered.length} entries
              </p>
              <p className="text-sm text-muted-foreground">
                250,000₫/month — full access to all registries, trends, and exports
              </p>
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Unlock Full Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
