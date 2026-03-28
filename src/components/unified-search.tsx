"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NormalizedEntry {
  _registry: string;
  _index: number;
  _name: string;
  _status: string;
  _category: string;
  _location: string;
  _website: string;
  _allFields: Record<string, string>;
}

interface UnifiedSearchProps {
  entries: NormalizedEntry[];
  statuses: string[];
  categories: string[];
}

const REGISTRY_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  Fintech: { bg: "bg-blue-500/15", text: "text-blue-400" },
  Investors: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  Banks: { bg: "bg-amber-500/15", text: "text-amber-400" },
  Securities: { bg: "bg-purple-500/15", text: "text-purple-400" },
  Insurance: { bg: "bg-rose-500/15", text: "text-rose-400" },
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default",
  approved: "default",
  licensed: "default",
  operating: "default",
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

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const lower = status.toLowerCase();
  for (const [keyword, variant] of Object.entries(STATUS_VARIANT)) {
    if (lower.includes(keyword)) return variant;
  }
  return "outline";
}

const VISIBLE_INCREMENT = 50;

export function UnifiedSearch({
  entries,
  statuses,
  categories,
}: UnifiedSearchProps) {
  const [search, setSearch] = useState("");
  const [registryFilter, setRegistryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(VISIBLE_INCREMENT);

  const filtered = useMemo(() => {
    if (!search.trim() && registryFilter === "all" && statusFilter === "all" && categoryFilter === "all") {
      return [];
    }

    const query = search.toLowerCase();

    return entries.filter((entry) => {
      // Registry filter
      if (registryFilter !== "all" && entry._registry !== registryFilter)
        return false;

      // Status filter
      if (statusFilter !== "all" && entry._status !== statusFilter)
        return false;

      // Category filter
      if (categoryFilter !== "all" && entry._category !== categoryFilter)
        return false;

      // Text search — search across all fields
      if (query) {
        const allText = Object.values(entry._allFields)
          .join(" ")
          .toLowerCase();
        if (!allText.includes(query)) return false;
      }

      return true;
    });
  }, [entries, search, registryFilter, statusFilter, categoryFilter]);

  const activeRegistries = useMemo(() => {
    const set = new Set(filtered.map((e) => e._registry));
    return set.size;
  }, [filtered]);

  const visibleResults = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const hasActiveFilters =
    search.trim() ||
    registryFilter !== "all" ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Search input */}
      <Input
        placeholder="Search by company name, status, category, location..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setVisibleCount(VISIBLE_INCREMENT);
        }}
        className="h-12 text-base px-4 rounded-xl"
      />

      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={registryFilter}
          onValueChange={(v) => {
            setRegistryFilter(v ?? "all");
            setVisibleCount(VISIBLE_INCREMENT);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {registryFilter === "all"
                ? "All Registries"
                : registryFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Registries</SelectItem>
            <SelectItem value="Fintech">Fintech</SelectItem>
            <SelectItem value="Investors">Investors</SelectItem>
            <SelectItem value="Banks">Banks</SelectItem>
            <SelectItem value="Securities">Securities</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v ?? "all");
            setVisibleCount(VISIBLE_INCREMENT);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {statusFilter === "all" ? "All Status" : statusFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v ?? "all");
            setVisibleCount(VISIBLE_INCREMENT);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {categoryFilter === "all"
                ? "All Categories"
                : categoryFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {!hasActiveFilters ? (
        <div className="rounded-lg border border-border/50 p-12 text-center">
          <p className="text-muted-foreground text-sm">
            Enter a search term to find entities across all registries
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Found{" "}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            result{filtered.length !== 1 ? "s" : ""} across{" "}
            <span className="font-medium text-foreground">
              {activeRegistries}
            </span>{" "}
            registr{activeRegistries !== 1 ? "ies" : "y"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-border/50 p-12 text-center">
              <p className="text-muted-foreground text-sm">
                No results found. Try a different search term or adjust your
                filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleResults.map((entry, i) => {
                const colors =
                  REGISTRY_COLORS[entry._registry] || REGISTRY_COLORS.Fintech;
                const registrySlug = entry._registry.toLowerCase();

                return (
                  <Link
                    key={`${entry._registry}-${entry._index}-${i}`}
                    href={`/company/${registrySlug}/${entry._index}`}
                  >
                    <Card className="h-full transition-colors hover:bg-accent/50 cursor-pointer">
                      <CardContent className="space-y-3">
                        {/* Name */}
                        <p className="font-semibold text-sm leading-tight line-clamp-2">
                          {entry._name || "Unnamed Entity"}
                        </p>

                        {/* Badges row */}
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors.bg} ${colors.text}`}
                          >
                            {entry._registry}
                          </span>
                          {entry._status && (
                            <Badge variant={getStatusVariant(entry._status)}>
                              {entry._status}
                            </Badge>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {entry._category && (
                            <p>
                              <span className="text-foreground/60">Type:</span>{" "}
                              {entry._category}
                            </p>
                          )}
                          {entry._location && (
                            <p>
                              <span className="text-foreground/60">HQ:</span>{" "}
                              {entry._location}
                            </p>
                          )}
                          {entry._website && (
                            <p
                              className="truncate text-primary underline underline-offset-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={
                                  entry._website.startsWith("http")
                                    ? entry._website
                                    : `https://${entry._website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {entry._website.replace(/^https?:\/\//, "")}
                              </a>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + VISIBLE_INCREMENT)
                }
                className="rounded-lg border px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
