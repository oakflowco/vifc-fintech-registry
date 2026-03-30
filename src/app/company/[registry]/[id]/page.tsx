import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchSheetData } from "@/lib/sheets";
import {
  fetchSandboxParticipants,
  fetchLicenses,
} from "@/lib/fetch-editorial";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const revalidate = 60;

const REGISTRY_CONFIG: Record<
  string,
  { envVar: string; label: string; path: string }
> = {
  fintech: {
    envVar: "GOOGLE_SHEET_FINTECH_URL",
    label: "Fintech Registry",
    path: "/registry",
  },
  investors: {
    envVar: "GOOGLE_SHEET_INVESTORS_URL",
    label: "Investors",
    path: "/registry",
  },
  banks: {
    envVar: "GOOGLE_SHEET_BANKS_URL",
    label: "Banks & Members",
    path: "/registry",
  },
  securities: {
    envVar: "GOOGLE_SHEET_SECURITIES_URL",
    label: "Securities",
    path: "/registry",
  },
  insurance: {
    envVar: "GOOGLE_SHEET_INSURANCE_URL",
    label: "Insurance",
    path: "/registry",
  },
  neobanks: {
    envVar: "GOOGLE_SHEET_NEOBANKS_URL",
    label: "Neobanks",
    path: "/registry",
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

function getEntityName(entry: Record<string, string>): string {
  const nameKeys = [
    "Company",
    "company",
    "Company Name",
    "Name",
    "name",
    "Entity",
    "entity",
    "Organization",
    "Bank",
    "bank",
    "Investor",
    "investor",
    "Firm",
    "firm",
    "Trading Name",
  ];
  for (const key of nameKeys) {
    if (entry[key]) return entry[key];
  }
  for (const [key, value] of Object.entries(entry)) {
    if (key !== "#" && key !== "ID" && key !== "id" && value) return value;
  }
  return "Unknown Entity";
}

// Categorize fields into sections for structured display
function categorizeFields(
  entry: Record<string, string>,
  headers: string[]
): {
  overview: { key: string; value: string }[];
  license: { key: string; value: string }[];
  contact: { key: string; value: string }[];
  other: { key: string; value: string }[];
} {
  const overviewPatterns =
    /^(company|name|trading|category|type|sector|segment|status|state|founded|established|year|headquarters|hq|city|location|country|address|vifc)/i;
  const licensePatterns =
    /^(license|licence|permit|registration|approval|date.?issued|issued|regulatory|compliance)/i;
  const contactPatterns = /^(website|url|web|phone|tel|email|contact|fax)/i;

  const overview: { key: string; value: string }[] = [];
  const license: { key: string; value: string }[] = [];
  const contact: { key: string; value: string }[] = [];
  const other: { key: string; value: string }[] = [];

  for (const key of headers) {
    const value = entry[key];
    if (!value || key === "#" || key === "ID" || key === "id") continue;

    if (contactPatterns.test(key)) contact.push({ key, value });
    else if (licensePatterns.test(key)) license.push({ key, value });
    else if (overviewPatterns.test(key)) overview.push({ key, value });
    else other.push({ key, value });
  }

  return { overview, license, contact, other };
}

// Normalize company name for fuzzy matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
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
      description: `Company profile for ${name} — licensing, regulatory status, sandbox participation, and deal history in Vietnam's financial sector.`,
    };
  } catch {
    return { title: `${config.label} | VIFC Database` };
  }
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { registry, id } = await params;

  const config = REGISTRY_CONFIG[registry];
  if (!config) notFound();

  const sheetUrl = getSheetUrl(registry);
  if (!sheetUrl) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            {config.envVar} is not configured.
          </p>
        </div>
      </div>
    );
  }

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

  const rowIndex = parseInt(id, 10);
  if (isNaN(rowIndex) || rowIndex < 1 || rowIndex > data.length) notFound();
  const entry = data[rowIndex - 1];
  if (!entry) notFound();

  const entityName = getEntityName(entry);
  const statusValue =
    entry["Status"] || entry["status"] || entry["State"] || "";
  const vifcStatus =
    entry["VIFC Status"] || entry["VIFC"] || entry["vifc_status"] || "";

  // Extract domain for logo
  const rawWebsite =
    entry["Website"] || entry["website"] || entry["URL"] || entry["url"] || "";
  let logoDomain: string | null = null;
  if (rawWebsite) {
    try {
      const url = rawWebsite.startsWith("http")
        ? rawWebsite
        : `https://${rawWebsite}`;
      logoDomain = new URL(url).hostname;
    } catch {
      if (rawWebsite.includes("."))
        logoDomain = rawWebsite.replace(/^www\./, "");
    }
  }

  // Categorize fields
  const sections = categorizeFields(entry, headers);

  // Cross-reference: sandbox participation
  const [sandboxData, licenseData] = await Promise.all([
    fetchSandboxParticipants(),
    fetchLicenses(),
  ]);

  const sandboxMatches = sandboxData.filter((s) =>
    namesMatch(s.company, entityName)
  );
  const licenseMatches = licenseData.filter((l) =>
    namesMatch(l.company, entityName)
  );

  // Cross-reference: deals from deals registry
  const dealsUrl = process.env.GOOGLE_SHEET_DEALS_URL;
  let dealMatches: Record<string, string>[] = [];
  if (dealsUrl) {
    try {
      const { data: dealsData } = await fetchSheetData(dealsUrl);
      dealMatches = dealsData.filter((d) => {
        const dealCompany =
          d["Company"] || d["company"] || d["Name"] || d["name"] || "";
        return namesMatch(dealCompany, entityName);
      });
    } catch {
      // Deals data unavailable — not critical
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
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg shrink-0">
            {entityName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {entityName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{config.label}</Badge>
              {statusValue && (
                <Badge
                  variant={
                    /active|licensed|operating/i.test(statusValue)
                      ? "default"
                      : "outline"
                  }
                >
                  {statusValue}
                </Badge>
              )}
              {vifcStatus && (
                <Badge variant="default">VIFC {vifcStatus}</Badge>
              )}
              {sandboxMatches.length > 0 && (
                <Badge variant="secondary">Sandbox Participant</Badge>
              )}
            </div>
            {rawWebsite && (
              <a
                href={
                  rawWebsite.startsWith("http")
                    ? rawWebsite
                    : `https://${rawWebsite}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {logoDomain || rawWebsite}
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          {sections.overview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {sections.overview.map(({ key, value }) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {key}
                      </dt>
                      <dd className="mt-0.5 text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Licensing & Regulatory */}
          {(sections.license.length > 0 || licenseMatches.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Licensing & Regulatory</CardTitle>
                <CardDescription>
                  License status and regulatory approvals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* From registry data */}
                {sections.license.length > 0 && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {sections.license.map(({ key, value }) => (
                      <div key={key}>
                        <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {key}
                        </dt>
                        <dd className="mt-0.5 text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {/* Cross-referenced licenses */}
                {licenseMatches.length > 0 && (
                  <div className="space-y-3">
                    {sections.license.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          License Pipeline Records
                        </p>
                      </div>
                    )}
                    {licenseMatches.map((lic, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="mt-0.5">
                          <Badge
                            variant={
                              lic.status === "Issued"
                                ? "default"
                                : lic.status === "Sandbox Active" ||
                                    lic.status === "Pilot"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {lic.status}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {lic.licenseType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lic.authority}
                            {lic.licenseNumber && ` — ${lic.licenseNumber}`}
                          </p>
                          {lic.issueDate && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Issued: {lic.issueDate}
                            </p>
                          )}
                          {lic.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {lic.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sandbox Participation */}
          {sandboxMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sandbox Participation</CardTitle>
                <CardDescription>
                  Regulatory sandbox enrollment and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sandboxMatches.map((sb, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <div className="flex flex-col items-center gap-1 mt-0.5">
                        <Badge
                          variant={
                            sb.status === "Active" ? "default" : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {sb.status}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{sb.sandbox}</p>
                        <p className="text-xs text-muted-foreground">
                          {sb.category}
                        </p>
                        {sb.entryDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Entered: {sb.entryDate}
                          </p>
                        )}
                        {sb.exitDate && (
                          <p className="text-xs text-muted-foreground">
                            Exited: {sb.exitDate}
                          </p>
                        )}
                        {sb.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {sb.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Link
                    href="/sandbox"
                    className="text-xs text-primary hover:underline"
                  >
                    View all sandbox participants &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deal History */}
          {dealMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Deal History</CardTitle>
                <CardDescription>
                  Funding rounds and investment activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dealMatches.map((deal, i) => {
                    const amount =
                      deal["Amount"] ||
                      deal["amount"] ||
                      deal["Amount (USD M)"] ||
                      "";
                    const stage =
                      deal["Stage"] ||
                      deal["stage"] ||
                      deal["Funding Stage"] ||
                      "";
                    const date =
                      deal["Date"] || deal["date"] || deal["Year"] || "";
                    const investors =
                      deal["Investors"] ||
                      deal["investors"] ||
                      deal["Lead Investor"] ||
                      "";
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="mt-0.5">
                          {stage && (
                            <Badge variant="outline" className="text-[10px]">
                              {stage}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            {amount && (
                              <p className="text-sm font-semibold font-mono">
                                ${amount}M
                              </p>
                            )}
                            {date && (
                              <span className="text-xs text-muted-foreground">
                                {date}
                              </span>
                            )}
                          </div>
                          {investors && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {investors}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          {sections.other.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border">
                  {sections.other.map(({ key, value }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4"
                    >
                      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 shrink-0">
                        {key}
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
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Registry */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Registry
                </p>
                <p className="text-sm mt-0.5">{config.label}</p>
              </div>

              {/* Status */}
              {statusValue && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </p>
                  <Badge
                    variant={
                      /active|licensed|operating/i.test(statusValue)
                        ? "default"
                        : "outline"
                    }
                    className="mt-0.5"
                  >
                    {statusValue}
                  </Badge>
                </div>
              )}

              {/* VIFC Membership */}
              {vifcStatus && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    VIFC Membership
                  </p>
                  <Badge variant="default" className="mt-0.5">
                    {vifcStatus}
                  </Badge>
                </div>
              )}

              {/* Licenses count */}
              {licenseMatches.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Licenses
                  </p>
                  <p className="text-sm font-mono mt-0.5">
                    {licenseMatches.length} on record
                  </p>
                </div>
              )}

              {/* Sandbox count */}
              {sandboxMatches.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sandbox Programs
                  </p>
                  <p className="text-sm font-mono mt-0.5">
                    {sandboxMatches.length} active
                  </p>
                </div>
              )}

              {/* Deals count */}
              {dealMatches.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Deals on Record
                  </p>
                  <p className="text-sm font-mono mt-0.5">
                    {dealMatches.length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          {sections.contact.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {sections.contact.map(({ key, value }) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {key}
                      </dt>
                      <dd className="mt-0.5 text-sm break-all">
                        {isUrl(value) ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4 hover:text-primary/80"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Related Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Related</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={config.path}
                className="block text-sm text-primary hover:underline"
              >
                View all {config.label} &rarr;
              </Link>
              <Link
                href="/regulatory/licensing"
                className="block text-sm text-primary hover:underline"
              >
                Licensing Pipeline &rarr;
              </Link>
              <Link
                href="/sandbox"
                className="block text-sm text-primary hover:underline"
              >
                Regulatory Sandboxes &rarr;
              </Link>
              <Link
                href="/deals"
                className="block text-sm text-primary hover:underline"
              >
                Deal Tracker &rarr;
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
