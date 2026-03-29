import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchSheetData } from "@/lib/sheets";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
function CompanyInitials({ name }: { name: string; domain?: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg shrink-0">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export const revalidate = 60;

const REGISTRY_CONFIG: Record<
  string,
  { envVar: string; label: string; path: string }
> = {
  fintech: {
    envVar: "GOOGLE_SHEET_FINTECH_URL",
    label: "Fintech Registry",
    path: "/",
  },
  investors: {
    envVar: "GOOGLE_SHEET_INVESTORS_URL",
    label: "Investors",
    path: "/investors",
  },
  banks: {
    envVar: "GOOGLE_SHEET_BANKS_URL",
    label: "Banks & Members",
    path: "/banks",
  },
  securities: {
    envVar: "GOOGLE_SHEET_SECURITIES_URL",
    label: "Securities",
    path: "/securities",
  },
  insurance: {
    envVar: "GOOGLE_SHEET_INSURANCE_URL",
    label: "Insurance",
    path: "/insurance",
  },
};

function getSheetUrl(registry: string): string | undefined {
  const config = REGISTRY_CONFIG[registry];
  if (!config) return undefined;
  return process.env[config.envVar];
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function isStatusField(key: string): boolean {
  return /status|state|active/i.test(key);
}

// Find the name field from a row — try common column names
function getEntityName(entry: Record<string, string>): string {
  const nameKeys = [
    "Company",
    "company",
    "Name",
    "name",
    "Entity",
    "entity",
    "Organization",
    "organization",
    "Bank",
    "bank",
    "Investor",
    "investor",
    "Firm",
    "firm",
  ];
  for (const key of nameKeys) {
    if (entry[key]) return entry[key];
  }
  // Fallback: first non-ID field with a value
  for (const [key, value] of Object.entries(entry)) {
    if (key !== "#" && key !== "ID" && key !== "id" && value) return value;
  }
  return "Unknown Entity";
}

// Identify "quick info" fields from available headers
function getQuickInfoFields(entry: Record<string, string>): {
  key: string;
  value: string;
}[] {
  const quickPatterns = [
    /^status$/i,
    /category|type|sector|segment/i,
    /headquarters|city|location|country|address/i,
    /website|url|web/i,
    /phone|tel/i,
    /email/i,
    /founded|established|year/i,
    /license/i,
  ];

  const results: { key: string; value: string }[] = [];
  for (const pattern of quickPatterns) {
    for (const [key, value] of Object.entries(entry)) {
      if (pattern.test(key) && value && !results.some((r) => r.key === key)) {
        results.push({ key, value });
      }
    }
  }
  return results;
}

type PageProps = {
  params: Promise<{ registry: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { registry, id } = await params;
  const config = REGISTRY_CONFIG[registry];
  if (!config) {
    return { title: "Not Found | VIFC Database" };
  }

  const sheetUrl = getSheetUrl(registry);
  if (!sheetUrl) {
    return { title: `${config.label} | VIFC Database` };
  }

  try {
    const { data } = await fetchSheetData(sheetUrl);
    const rowIndex = parseInt(id, 10);
    const entry = data[rowIndex - 1];
    if (!entry) {
      return { title: "Not Found | VIFC Database" };
    }
    const name = getEntityName(entry);
    return {
      title: `${name} — ${config.label} | VIFC Database`,
      description: `Profile details for ${name} in the ${config.label}.`,
    };
  } catch {
    return { title: `${config.label} | VIFC Database` };
  }
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { registry, id } = await params;

  // Validate registry
  const config = REGISTRY_CONFIG[registry];
  if (!config) {
    notFound();
  }

  // Validate sheet URL
  const sheetUrl = getSheetUrl(registry);
  if (!sheetUrl) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            {config.envVar} is not configured.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Set{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">
              {config.envVar}
            </code>{" "}
            in your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  // Fetch data
  let data: Record<string, string>[];
  let headers: string[];
  try {
    const result = await fetchSheetData(sheetUrl);
    data = result.data;
    headers = result.headers;
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            Failed to fetch registry data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Find entry by row index (1-based)
  const rowIndex = parseInt(id, 10);
  if (isNaN(rowIndex) || rowIndex < 1 || rowIndex > data.length) {
    notFound();
  }
  const entry = data[rowIndex - 1];
  if (!entry) {
    notFound();
  }

  const entityName = getEntityName(entry);
  const quickInfo = getQuickInfoFields(entry);
  const statusValue =
    entry["Status"] || entry["status"] || entry["State"] || "";

  // Extract domain for logo
  const rawWebsite =
    entry["Website"] || entry["website"] || entry["URL"] || entry["url"] || "";
  let logoDomain: string | null = null;
  if (rawWebsite) {
    try {
      const url = rawWebsite.startsWith("http") ? rawWebsite : `https://${rawWebsite}`;
      logoDomain = new URL(url).hostname;
    } catch {
      if (rawWebsite.includes(".")) logoDomain = rawWebsite.replace(/^www\./, "");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={config.path}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        &larr; Back to {config.label}
      </Link>

      {/* Page heading */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {logoDomain && <CompanyInitials domain={logoDomain} name={entityName} />}
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {entityName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{config.label}</Badge>
              {statusValue && <Badge variant="outline">{statusValue}</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — all details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                All available fields from the {config.label} registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                {headers.map((header) => {
                  const value = entry[header];
                  if (!value) return null;
                  return (
                    <div
                      key={header}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4"
                    >
                      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 shrink-0">
                        {header}
                      </dt>
                      <dd className="text-sm break-all">
                        {isUrl(value) ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4 hover:text-primary/80"
                          >
                            {value}
                          </a>
                        ) : isStatusField(header) ? (
                          <Badge variant="outline">{value}</Badge>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right column — quick info + registry card */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              {quickInfo.length > 0 ? (
                <dl className="space-y-3">
                  {quickInfo.map(({ key, value }) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {key}
                      </dt>
                      <dd className="mt-0.5 text-sm">
                        {isUrl(value) ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4 hover:text-primary/80"
                          >
                            {value}
                          </a>
                        ) : isStatusField(key) ? (
                          <Badge variant="outline">{value}</Badge>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No quick info available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Registry info */}
          <Card>
            <CardHeader>
              <CardTitle>Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                This entity belongs to the{" "}
                <span className="font-medium text-foreground">
                  {config.label}
                </span>{" "}
                registry.
              </p>
              <Link
                href={config.path}
                className="inline-flex items-center text-sm text-primary underline underline-offset-4 hover:text-primary/80"
              >
                View all {config.label} entries &rarr;
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
