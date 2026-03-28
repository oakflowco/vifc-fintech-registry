import { fetchSheetData } from "@/lib/sheets";
import { UnifiedSearch } from "@/components/unified-search";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search All Registries — VIFC Database",
  description:
    "Search across 500+ entities — fintech, investors, banks, securities, and insurance registries.",
};

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

function findField(
  entry: Record<string, string>,
  keywords: string[]
): string {
  for (const key of Object.keys(entry)) {
    const lower = key.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw)) return entry[key] || "";
    }
  }
  return "";
}

function normalizeEntries(
  data: Record<string, string>[],
  registryName: string
): NormalizedEntry[] {
  return data.map((entry, i) => ({
    _registry: registryName,
    _index: i + 1,
    _name:
      findField(entry, ["company name", "company", "name", "firm"]) ||
      Object.values(entry).find((v) => v && !v.startsWith("http")) ||
      "",
    _status: findField(entry, ["status"]),
    _category: findField(entry, ["category", "type", "sector"]),
    _location: findField(entry, [
      "headquarters",
      "city",
      "location",
      "country",
    ]),
    _website: findField(entry, ["website", "url", "web"]),
    _allFields: entry,
  }));
}

const REGISTRIES = [
  { name: "Fintech", envVar: "GOOGLE_SHEET_FINTECH_URL" },
  { name: "Investors", envVar: "GOOGLE_SHEET_INVESTORS_URL" },
  { name: "Banks", envVar: "GOOGLE_SHEET_BANKS_URL" },
  { name: "Securities", envVar: "GOOGLE_SHEET_SECURITIES_URL" },
  { name: "Insurance", envVar: "GOOGLE_SHEET_INSURANCE_URL" },
] as const;

export default async function SearchPage() {
  const results = await Promise.all(
    REGISTRIES.map(async ({ name, envVar }) => {
      const url = process.env[envVar];
      if (!url) return [];
      try {
        const { data } = await fetchSheetData(url);
        return normalizeEntries(data, name);
      } catch {
        return [];
      }
    })
  );

  const allEntries = results.flat();

  // Collect unique statuses and categories for filter dropdowns
  const statuses = Array.from(
    new Set(allEntries.map((e) => e._status).filter(Boolean))
  ).sort();
  const categories = Array.from(
    new Set(allEntries.map((e) => e._category).filter(Boolean))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Search All Registries
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search across 500+ entities — fintech, investors, banks, securities,
          and insurance
        </p>
      </div>

      <UnifiedSearch
        entries={allEntries}
        statuses={statuses}
        categories={categories}
      />
    </div>
  );
}
