// Editorial data fetcher — pulls strategic/curated content from Google Sheets
// Your team edits these sheets directly; the website picks up changes automatically.
//
// SETUP: One Google Spreadsheet with multiple tabs.
// Only 2 env vars needed:
//   GOOGLE_SHEET_EDITORIAL_BASE — the published base URL (same format as registry sheets)
//   GOOGLE_SHEET_EDITORIAL_GIDS — JSON map of tab name → gid number
//
// Example:
//   GOOGLE_SHEET_EDITORIAL_BASE=https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub
//   GOOGLE_SHEET_EDITORIAL_GIDS={"unicorns":"0","ratings":"123456","milestones":"789012",...}
//
// TAB NAMES & COLUMNS:
// ┌──────────────────────┬────────────────────────────────────────────────────┐
// │ Tab Name             │ Columns                                           │
// ├──────────────────────┼────────────────────────────────────────────────────┤
// │ unicorns             │ Name, Valuation, Sector, Status                   │
// │ ratings              │ Agency, Rating, Outlook, LastUpdate                │
// │ rating_agencies      │ Name, Type, Established, Regulator, Description,  │
// │                      │ Coverage (pipe-separated), Website, Methodology   │
// │ milestones           │ Date, Event, URL                                  │
// │ market_size          │ Sector, TAM, SAM, SOM, Growth, Penetration,       │
// │                      │ Key Players, Outlook                              │
// │ vifc_incentives      │ Icon, Title, Description                          │
// │ vifc_entities        │ Type, Description, Requirements                   │
// │ investor_costs       │ Item, Range, Notes                                │
// │ risks                │ Category, Title, Description, Impact              │
// │ calendar             │ Month, Day, Event, Type, Impact                   │
// │ carbon_timeline      │ Period, Event, Description                        │
// │ carbon_credits       │ Type, Description, Eligibility, Status            │
// │ dfi                  │ Name, Type, Portfolio, Focus, Key Projects, URL   │
// │ commodity_products   │ Category, Name, Note, Volume                      │
// │ commodity_brokers    │ Name, License, HQ, Website                        │
// │ quarterly_investment │ Quarter, Domestic, Foreign                        │
// │ startup_stages       │ Stage, Count, AvgTicket                           │
// │ investor_countries   │ Country, Deals, Amount                            │
// │ related_links        │ Title, URL, Source, Description                   │
// │ why_vietnam          │ Label, Value, Sub                                 │
// └──────────────────────┴────────────────────────────────────────────────────┘

import { fetchSheetData, type RegistryEntry } from "./sheets";

// ── Build URL from base + gid ──

let _gidMap: Record<string, string> | null = null;

function getGidMap(): Record<string, string> {
  if (_gidMap) return _gidMap;
  try {
    _gidMap = JSON.parse(process.env.GOOGLE_SHEET_EDITORIAL_GIDS || "{}");
  } catch {
    _gidMap = {};
  }
  return _gidMap!;
}

function getEditorialUrl(tabName: string): string | null {
  const base = process.env.GOOGLE_SHEET_EDITORIAL_BASE;
  if (!base) return null;
  const gids = getGidMap();
  const gid = gids[tabName];
  if (gid == null) return null;
  return `${base}?gid=${gid}&single=true&output=csv`;
}

// ── Generic sheet fetcher with fallback ──

async function fetchEditorialSheet(
  tabName: string
): Promise<RegistryEntry[]> {
  const url = getEditorialUrl(tabName);
  if (!url) return [];
  try {
    const { data } = await fetchSheetData(url);
    return data;
  } catch {
    return [];
  }
}

// ── Unicorns ──

export interface Unicorn {
  name: string;
  valuation: string;
  sector: string;
  status: string;
}

const UNICORN_FALLBACK: Unicorn[] = [
  { name: "VNG Corporation", valuation: "$1.5B+", sector: "Gaming / Tech", status: "Unicorn (IPO'd NASDAQ 2023)" },
  { name: "MoMo (M_Service)", valuation: "$2B+", sector: "E-Wallet", status: "Unicorn" },
  { name: "VNPay / VNLife", valuation: "$1B+", sector: "Payments", status: "Unicorn" },
  { name: "Sky Mavis (Axie Infinity)", valuation: "$3B peak", sector: "Blockchain Gaming", status: "Unicorn (2021 peak)" },
  { name: "Tiki", valuation: "$800M+", sector: "E-commerce", status: "Soonicorn" },
  { name: "KiotViet", valuation: "$500M+", sector: "SaaS / Fintech", status: "Soonicorn" },
  { name: "FPT Corporation", valuation: "$8B+", sector: "Technology", status: "Public (HOSE: FPT)" },
  { name: "Techcombank", valuation: "$6B+", sector: "Digital Banking", status: "Public (HOSE: TCB)" },
];

export async function fetchUnicorns(): Promise<Unicorn[]> {
  const rows = await fetchEditorialSheet("unicorns");
  if (rows.length === 0) return UNICORN_FALLBACK;
  return rows.map((r) => ({
    name: r["Name"] || r["name"] || "",
    valuation: r["Valuation"] || r["valuation"] || "",
    sector: r["Sector"] || r["sector"] || "",
    status: r["Status"] || r["status"] || "",
  }));
}

// ── Regulatory Milestones ──

export interface RegulatoryMilestone {
  date: string;
  event: string;
  url: string;
}

export async function fetchRegulatoryMilestones(): Promise<RegulatoryMilestone[]> {
  const rows = await fetchEditorialSheet("milestones");
  if (rows.length === 0) {
    // Fallback to static data
    const { regulatoryMilestones } = await import("./trend-data");
    return regulatoryMilestones;
  }
  return rows.map((r) => ({
    date: r["Date"] || r["date"] || "",
    event: r["Event"] || r["event"] || "",
    url: r["URL"] || r["url"] || "",
  }));
}

// ── Market Size Sectors ──

export interface MarketSector {
  sector: string;
  tam: string;
  sam: string;
  som: string;
  growth: string;
  penetration: string;
  keyPlayers: string;
  outlook: string;
}

export async function fetchMarketSize(): Promise<MarketSector[]> {
  const rows = await fetchEditorialSheet("market_size");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    sector: r["Sector"] || "",
    tam: r["TAM"] || "",
    sam: r["SAM"] || "",
    som: r["SOM"] || "",
    growth: r["Growth"] || "",
    penetration: r["Penetration"] || "",
    keyPlayers: r["KeyPlayers"] || r["Key Players"] || "",
    outlook: r["Outlook"] || "",
  }));
}

// ── VIFC Incentives ──

export interface VIFCIncentive {
  icon: string;
  title: string;
  description: string;
}

export async function fetchVIFCIncentives(): Promise<VIFCIncentive[]> {
  const rows = await fetchEditorialSheet("vifc_incentives");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    icon: r["Icon"] || r["icon"] || "📋",
    title: r["Title"] || r["title"] || "",
    description: r["Description"] || r["description"] || "",
  }));
}

// ── VIFC Entity Types ──

export interface VIFCEntityType {
  type: string;
  description: string;
  requirements: string;
}

export async function fetchVIFCEntityTypes(): Promise<VIFCEntityType[]> {
  const rows = await fetchEditorialSheet("vifc_entities");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    type: r["Type"] || r["type"] || "",
    description: r["Description"] || r["description"] || "",
    requirements: r["Requirements"] || r["requirements"] || "",
  }));
}

// ── Investor Guide Steps ──

export interface InvestorGuideStep {
  step: string;
  title: string;
  description: string;
  details: string;
}

export async function fetchInvestorGuideSteps(): Promise<InvestorGuideStep[]> {
  const rows = await fetchEditorialSheet("investor_steps");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    step: r["Step"] || r["step"] || "",
    title: r["Title"] || r["title"] || "",
    description: r["Description"] || r["description"] || "",
    details: r["Details"] || r["details"] || "",
  }));
}

// ── Investor Guide Costs ──

export interface InvestorGuideCost {
  item: string;
  range: string;
  notes: string;
}

export async function fetchInvestorGuideCosts(): Promise<InvestorGuideCost[]> {
  const rows = await fetchEditorialSheet("investor_costs");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    item: r["Item"] || r["item"] || "",
    range: r["Range"] || r["range"] || "",
    notes: r["Notes"] || r["notes"] || "",
  }));
}

// ── Risk Categories ──

export interface RiskItem {
  category: string;
  title: string;
  description: string;
  impact: string;
}

export async function fetchRisks(): Promise<RiskItem[]> {
  const rows = await fetchEditorialSheet("risks");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    category: r["Category"] || r["category"] || "",
    title: r["Title"] || r["title"] || "",
    description: r["Description"] || r["description"] || "",
    impact: r["Impact"] || r["impact"] || "",
  }));
}

// ── Economic Calendar Events ──

export interface CalendarEvent {
  month: string;
  day: string;
  event: string;
  type: string;
  impact: string;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const rows = await fetchEditorialSheet("calendar");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    month: r["Month"] || r["month"] || "",
    day: r["Day"] || r["day"] || "",
    event: r["Event"] || r["event"] || "",
    type: r["Type"] || r["type"] || "",
    impact: r["Impact"] || r["impact"] || "",
  }));
}

// ── DFI Institutions ──

export interface DFIInstitution {
  name: string;
  type: string;
  portfolio: string;
  focus: string;
  keyProjects: string;
  url: string;
}

export async function fetchDFIInstitutions(): Promise<DFIInstitution[]> {
  const rows = await fetchEditorialSheet("dfi");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    name: r["Name"] || r["name"] || "",
    type: r["Type"] || r["type"] || "",
    portfolio: r["Portfolio"] || r["portfolio"] || "",
    focus: r["Focus"] || r["focus"] || "",
    keyProjects: r["KeyProjects"] || r["Key Projects"] || "",
    url: r["URL"] || r["url"] || "",
  }));
}

// ── Carbon Timeline & Credits ──

export interface CarbonTimelineEntry {
  period: string;
  event: string;
  description: string;
}

export interface CarbonCreditType {
  type: string;
  description: string;
  eligibility: string;
  status: string;
}

export async function fetchCarbonTimeline(): Promise<CarbonTimelineEntry[]> {
  const rows = await fetchEditorialSheet("carbon_timeline");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    period: r["Period"] || r["period"] || "",
    event: r["Event"] || r["event"] || "",
    description: r["Description"] || r["description"] || "",
  }));
}

export async function fetchCarbonCredits(): Promise<CarbonCreditType[]> {
  const rows = await fetchEditorialSheet("carbon_credits");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    type: r["Type"] || r["type"] || "",
    description: r["Description"] || r["description"] || "",
    eligibility: r["Eligibility"] || r["eligibility"] || "",
    status: r["Status"] || r["status"] || "",
  }));
}

// ── Commodity Products & Brokers (editorial) ──

export interface CommodityProduct {
  category: string;
  name: string;
  note: string;
  volume: string;
}

export interface CommodityBroker {
  name: string;
  license: string;
  hq: string;
  website: string;
}

export async function fetchCommodityProducts(): Promise<CommodityProduct[]> {
  const rows = await fetchEditorialSheet("commodity_products");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    category: r["Category"] || r["category"] || "",
    name: r["Name"] || r["name"] || "",
    note: r["Note"] || r["note"] || "",
    volume: r["Volume"] || r["volume"] || "",
  }));
}

export async function fetchCommodityBrokers(): Promise<CommodityBroker[]> {
  const rows = await fetchEditorialSheet("commodity_brokers");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    name: r["Name"] || r["name"] || "",
    license: r["License"] || r["license"] || "",
    hq: r["HQ"] || r["hq"] || "",
    website: r["Website"] || r["website"] || "",
  }));
}

// ── Quarterly Investment (trend data) ──

export interface QuarterlyInvestment {
  quarter: string;
  domestic: number;
  foreign: number;
}

export async function fetchQuarterlyInvestment(): Promise<QuarterlyInvestment[]> {
  const rows = await fetchEditorialSheet("quarterly_investment");
  if (rows.length === 0) {
    const { quarterlyInvestment } = await import("./trend-data");
    return quarterlyInvestment;
  }
  return rows.map((r) => ({
    quarter: r["Quarter"] || r["quarter"] || "",
    domestic: Number(r["Domestic"] || r["domestic"]) || 0,
    foreign: Number(r["Foreign"] || r["foreign"]) || 0,
  }));
}

// ── Startup Stages ──

export interface StartupStage {
  stage: string;
  count: number;
  avgTicket: number;
}

export async function fetchStartupStages(): Promise<StartupStage[]> {
  const rows = await fetchEditorialSheet("startup_stages");
  if (rows.length === 0) {
    const { startupStages } = await import("./trend-data");
    return startupStages;
  }
  return rows.map((r) => ({
    stage: r["Stage"] || r["stage"] || "",
    count: Number(r["Count"] || r["count"]) || 0,
    avgTicket: Number(r["AvgTicket"] || r["Avg Ticket"]) || 0,
  }));
}

// ── Investor Countries ──

export interface InvestorCountry {
  country: string;
  deals: number;
  amount: number;
}

export async function fetchInvestorCountries(): Promise<InvestorCountry[]> {
  const rows = await fetchEditorialSheet("investor_countries");
  if (rows.length === 0) {
    const { investorCountries } = await import("./trend-data");
    return investorCountries;
  }
  return rows.map((r) => ({
    country: r["Country"] || r["country"] || "",
    deals: Number(r["Deals"] || r["deals"]) || 0,
    amount: Number(r["Amount"] || r["amount"]) || 0,
  }));
}

// ── Related Links ──

export interface RelatedLink {
  title: string;
  url: string;
  source: string;
  description: string;
}

export async function fetchRelatedLinks(): Promise<RelatedLink[]> {
  const rows = await fetchEditorialSheet("related_links");
  if (rows.length === 0) {
    const { relatedLinks } = await import("./trend-data");
    return relatedLinks;
  }
  return rows.map((r) => ({
    title: r["Title"] || r["title"] || "",
    url: r["URL"] || r["url"] || "",
    source: r["Source"] || r["source"] || "",
    description: r["Description"] || r["description"] || "",
  }));
}

// ── Rating Agencies (editorial) ──

export interface RatingAgency {
  name: string;
  type: string;
  established: string;
  regulator: string;
  description: string;
  coverage: string[];
  website: string;
  methodology: string;
}

export async function fetchRatingAgencies(): Promise<RatingAgency[]> {
  const rows = await fetchEditorialSheet("rating_agencies");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    name: r["Name"] || r["name"] || "",
    type: r["Type"] || r["type"] || "",
    established: r["Established"] || r["established"] || "",
    regulator: r["Regulator"] || r["regulator"] || "",
    description: r["Description"] || r["description"] || "",
    coverage: (r["Coverage"] || r["coverage"] || "").split("|").map((s: string) => s.trim()).filter(Boolean),
    website: r["Website"] || r["website"] || "",
    methodology: r["Methodology"] || r["methodology"] || "",
  }));
}

// ── Why Vietnam Highlights ──

export interface WhyVietnamHighlight {
  label: string;
  value: string;
  sub: string;
}

export async function fetchWhyVietnamHighlights(): Promise<WhyVietnamHighlight[]> {
  const rows = await fetchEditorialSheet("why_vietnam");
  if (rows.length === 0) return [];
  return rows.map((r) => ({
    label: r["Label"] || r["label"] || "",
    value: r["Value"] || r["value"] || "",
    sub: r["Sub"] || r["sub"] || "",
  }));
}

// ── Sandbox Participants ──

export interface SandboxParticipant {
  company: string;
  sandbox: string;
  category: string;
  status: string;
  entryDate: string;
  exitDate: string;
  city: string;
  notes: string;
}

const SANDBOX_PARTICIPANTS_FALLBACK: SandboxParticipant[] = [
  { company: "Basal Pay (Alphatrue Solutions)", sandbox: "VIFC Da Nang", category: "Crypto Asset Conversion", status: "Active", entryDate: "Mar 2025", exitDate: "", city: "Da Nang", notes: "" },
  { company: "MB Bank x Dunamu (Upbit)", sandbox: "Crypto Pilot", category: "Crypto Exchange", status: "Pilot", entryDate: "Late 2025", exitDate: "", city: "Hanoi", notes: "" },
  { company: "Techcombank Digital Assets", sandbox: "Crypto Pilot", category: "Digital Asset Issuance", status: "Pilot", entryDate: "Late 2025", exitDate: "", city: "Ho Chi Minh City", notes: "" },
  { company: "Tima", sandbox: "SBV Fintech", category: "P2P Lending", status: "Active", entryDate: "Jul 2025", exitDate: "", city: "Hanoi", notes: "" },
  { company: "Trusting Social", sandbox: "SBV Fintech", category: "Credit Scoring / AI", status: "Active", entryDate: "Jul 2025", exitDate: "", city: "Ho Chi Minh City", notes: "" },
  { company: "Robocash Vietnam", sandbox: "SBV Fintech", category: "P2P Lending", status: "Active", entryDate: "Jul 2025", exitDate: "", city: "Ho Chi Minh City", notes: "" },
  { company: "Fundiin", sandbox: "SBV Fintech", category: "Buy Now Pay Later", status: "Active", entryDate: "Jul 2025", exitDate: "", city: "Ho Chi Minh City", notes: "" },
  { company: "Lendela Vietnam", sandbox: "SBV Fintech", category: "Loan Marketplace", status: "Active", entryDate: "Jul 2025", exitDate: "", city: "Ho Chi Minh City", notes: "" },
];

export async function fetchSandboxParticipants(): Promise<SandboxParticipant[]> {
  const rows = await fetchEditorialSheet("sandbox_participants");
  if (rows.length === 0) return SANDBOX_PARTICIPANTS_FALLBACK;
  return rows.map((r) => ({
    company: r["Company"] || r["company"] || "",
    sandbox: r["Sandbox"] || r["sandbox"] || "",
    category: r["Category"] || r["category"] || "",
    status: r["Status"] || r["status"] || "",
    entryDate: r["EntryDate"] || r["Entry Date"] || r["entry_date"] || "",
    exitDate: r["ExitDate"] || r["Exit Date"] || r["exit_date"] || "",
    city: r["City"] || r["city"] || "",
    notes: r["Notes"] || r["notes"] || "",
  }));
}

// ── Sandbox Programs ──

export interface SandboxProgram {
  name: string;
  authority: string;
  status: string;
  since: string;
  scope: string;
  excluded: string;
  legal: string;
  participants: string;
}

const SANDBOX_PROGRAMS_FALLBACK: SandboxProgram[] = [
  { name: "SBV Fintech Sandbox", authority: "State Bank of Vietnam", status: "Active", since: "Jul 2025", scope: "Credit scoring|Open APIs / Open Banking|P2P lending platforms", excluded: "Digital asset trading|Robo-advisory|InsurTech", legal: "Decree 94/2025/ND-CP", participants: "Limited to entities registered in Vietnam" },
  { name: "VIFC Da Nang Innovation Sandbox", authority: "VIFC Da Nang Authority", status: "Active", since: "Mar 2025", scope: "Fintech|Blockchain & digital assets|Green finance|Cross-border payments|Stablecoin pilots|DeFi protocols", excluded: "", legal: "Resolution 222/2025/QH15, Article 24", participants: "Domestic and international entities" },
  { name: "Crypto Asset Pilot", authority: "National Assembly / Government", status: "Active", since: "Late 2025", scope: "Licensed crypto exchanges|Digital asset issuance|Crypto custody|Stablecoin operations", excluded: "", legal: "Resolution 05/2025", participants: "Minimum VND 10T (~$380M) capital, foreign ownership capped at 49%" },
];

export async function fetchSandboxPrograms(): Promise<SandboxProgram[]> {
  const rows = await fetchEditorialSheet("sandbox_programs");
  if (rows.length === 0) return SANDBOX_PROGRAMS_FALLBACK;
  return rows.map((r) => ({
    name: r["Name"] || r["name"] || "",
    authority: r["Authority"] || r["authority"] || "",
    status: r["Status"] || r["status"] || "",
    since: r["Since"] || r["since"] || "",
    scope: r["Scope"] || r["scope"] || "",
    excluded: r["Excluded"] || r["excluded"] || "",
    legal: r["Legal"] || r["legal"] || "",
    participants: r["Participants"] || r["participants"] || "",
  }));
}

// ── Licensing Pipeline ──

export interface LicenseEntry {
  company: string;
  licenseType: string;
  authority: string;
  status: string;
  applicationDate: string;
  issueDate: string;
  licenseNumber: string;
  category: string;
  notes: string;
}

const LICENSE_FALLBACK: LicenseEntry[] = [
  { company: "MoMo (M_Service)", licenseType: "E-Wallet", authority: "SBV", status: "Issued", applicationDate: "2015", issueDate: "2016", licenseNumber: "GP-SBV/044", category: "Payments", notes: "Largest e-wallet by users (~40M MAU)" },
  { company: "VNPay", licenseType: "E-Wallet", authority: "SBV", status: "Issued", applicationDate: "2014", issueDate: "2015", licenseNumber: "GP-SBV/038", category: "Payments", notes: "QR payment leader. Backed by SoftBank, GIC" },
  { company: "ZaloPay (VNG)", licenseType: "E-Wallet", authority: "SBV", status: "Issued", applicationDate: "2016", issueDate: "2017", licenseNumber: "GP-SBV/056", category: "Payments", notes: "Integrated with Zalo messenger (75M users)" },
  { company: "ShopeePay Vietnam", licenseType: "E-Wallet", authority: "SBV", status: "Issued", applicationDate: "2018", issueDate: "2019", licenseNumber: "GP-SBV/071", category: "Payments", notes: "Subsidiary of Sea Group (NYSE: SE)" },
  { company: "Tima", licenseType: "P2P Lending (Sandbox)", authority: "SBV", status: "Sandbox Active", applicationDate: "Apr 2025", issueDate: "Jul 2025", licenseNumber: "SB-001", category: "Lending", notes: "First P2P sandbox participant" },
  { company: "Fundiin", licenseType: "BNPL (Sandbox)", authority: "SBV", status: "Sandbox Active", applicationDate: "Apr 2025", issueDate: "Jul 2025", licenseNumber: "SB-004", category: "Lending", notes: "Buy Now Pay Later sandbox entrant" },
  { company: "FE Credit", licenseType: "Consumer Finance", authority: "SBV", status: "Issued", applicationDate: "2010", issueDate: "2010", licenseNumber: "CF-SBV/012", category: "Lending", notes: "Largest consumer finance company. Subsidiary of VPBank" },
  { company: "MB Bank x Dunamu (Upbit)", licenseType: "Crypto Exchange (Pilot)", authority: "Government", status: "Pilot", applicationDate: "2025", issueDate: "Late 2025", licenseNumber: "CRYPTO-001", category: "Digital Assets", notes: "First licensed crypto exchange pilot" },
  { company: "Techcombank Digital Assets", licenseType: "Digital Asset Issuance (Pilot)", authority: "Government", status: "Pilot", applicationDate: "2025", issueDate: "Late 2025", licenseNumber: "CRYPTO-002", category: "Digital Assets", notes: "Tokenized asset issuance pilot" },
  { company: "Viettel Money", licenseType: "E-Wallet / Mobile Money", authority: "SBV", status: "Issued", applicationDate: "2020", issueDate: "2021", licenseNumber: "GP-SBV/088", category: "Payments", notes: "Telco-backed mobile money. 15M+ users" },
  { company: "Basal Pay", licenseType: "Crypto Conversion (VIFC Sandbox)", authority: "VIFC Da Nang", status: "Sandbox Active", applicationDate: "Jan 2025", issueDate: "Mar 2025", licenseNumber: "VIFC-SB-001", category: "Digital Assets", notes: "First VIFC Da Nang sandbox entrant" },
  { company: "VNDirect", licenseType: "Securities Broker", authority: "SSC", status: "Issued", applicationDate: "2006", issueDate: "2006", licenseNumber: "SSC-068", category: "Securities", notes: "Top 5 brokerage by market share" },
  { company: "SSI Securities", licenseType: "Securities Broker", authority: "SSC", status: "Issued", applicationDate: "2000", issueDate: "2000", licenseNumber: "SSC-003", category: "Securities", notes: "Largest brokerage in Vietnam. $2B+ market cap" },
  { company: "Manulife Vietnam", licenseType: "Life Insurance", authority: "MOF", status: "Issued", applicationDate: "1999", issueDate: "1999", licenseNumber: "INS-MOF/015", category: "Insurance", notes: "Largest foreign life insurer in Vietnam" },
  { company: "Dai-ichi Life Vietnam", licenseType: "Life Insurance", authority: "MOF", status: "Issued", applicationDate: "2007", issueDate: "2007", licenseNumber: "INS-MOF/042", category: "Insurance", notes: "Bancassurance partnership with Sacombank" },
];

export async function fetchLicenses(): Promise<LicenseEntry[]> {
  const rows = await fetchEditorialSheet("licenses");
  if (rows.length === 0) return LICENSE_FALLBACK;
  return rows.map((r) => ({
    company: r["Company"] || r["company"] || "",
    licenseType: r["LicenseType"] || r["License Type"] || r["license_type"] || "",
    authority: r["Authority"] || r["authority"] || "",
    status: r["Status"] || r["status"] || "",
    applicationDate: r["ApplicationDate"] || r["Application Date"] || r["application_date"] || "",
    issueDate: r["IssueDate"] || r["Issue Date"] || r["issue_date"] || "",
    licenseNumber: r["LicenseNumber"] || r["License Number"] || r["license_number"] || "",
    category: r["Category"] || r["category"] || "",
    notes: r["Notes"] || r["notes"] || "",
  }));
}
