"use client";

import { useState, useMemo } from "react";
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

interface RegistryTableProps {
  headers: string[];
  data: RegistryEntry[];
  filterColumns?: string[];
  exportType?: string;
}

const STATUS_KEYWORDS: Record<string, "default" | "secondary" | "destructive"> =
  {
    active: "default",
    approved: "default",
    licensed: "default",
    operating: "default",
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

export function RegistryTable({
  headers,
  data,
  filterColumns,
  exportType,
}: RegistryTableProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtersConfig = useMemo(() => {
    const cols = filterColumns ?? headers.filter((h) => isFilterColumn(h));
    return cols.map((col) => ({
      column: col,
      options: Array.from(new Set(data.map((d) => d[col]).filter(Boolean))).sort(),
    }));
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

  const setFilter = (col: string) => (value: string | null) => {
    setFilters((prev) => ({ ...prev, [col]: value ?? "all" }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search..."
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
                    : `All ${column}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {column}</SelectItem>
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
          Showing {filtered.length} of {data.length} entries
        </span>
        {exportType && (
          <a
            href={`/api/export?type=${exportType}`}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span>↓</span> Export CSV
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
              {headers.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  No entries found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  {headers.map((h) => {
                    const value = entry[h] || "";
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
