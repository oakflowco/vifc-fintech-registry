// Vietnam IFC & Fintech Market Intelligence Data
//
// DATA SOURCES:
// ┌─────────────────────────────┬────────────┬──────────────────────────┐
// │ Data                        │ Source     │ Status                   │
// ├─────────────────────────────┼────────────┼──────────────────────────┤
// │ Key Metrics (GDP/FDI/VN)    │ World Bank │ LIVE — fetch-world-bank  │
// │ Macro Indicators            │ World Bank │ LIVE — fetch-world-bank  │
// │ VN-Index                    │ Yahoo Fin  │ LIVE — fetch-stock       │
// │ News                        │ Google RSS │ LIVE — fetch-news        │
// │ Category Distribution       │ Sheets     │ LIVE — computed in page  │
// │ Startups by City            │ Sheets     │ LIVE — computed in page  │
// │ Quarterly Investment        │ Manual     │ STATIC — no public API   │
// │ Startup Stages              │ Manual     │ STATIC — no public API   │
// │ Investor Countries          │ Manual     │ STATIC — no public API   │
// │ Regulatory Milestones       │ Curated    │ STATIC — hand-maintained │
// │ Related Links               │ Curated    │ STATIC — hand-maintained │
// └─────────────────────────────┴────────────┴──────────────────────────┘
//
// To update static data: edit the arrays below.
// To make more data dynamic: add a Google Sheet tab or find a free API.

// ── Quarterly Investment Flow (STATIC — update manually each quarter) ──
// Sources: Tracxn, Deckvalley, IMARC Group, The Investor VN (updated Mar 2026)
// Vietnam startups raised ~$2.3B across 141 deals in 2024; ~$1.5B in early-stage in 2025-26
export const quarterlyInvestment = [
  { quarter: "Q1 2025", domestic: 85, foreign: 290 },
  { quarter: "Q2 2025", domestic: 110, foreign: 345 },
  { quarter: "Q3 2025", domestic: 95, foreign: 410 },
  { quarter: "Q4 2025", domestic: 130, foreign: 520 },
  { quarter: "Q1 2026", domestic: 145, foreign: 480 },
];

// ── Startup Stages (STATIC — update when new data available) ──
// Sources: NSSC Vietnam, Tracxn, Papermark (updated Mar 2026)
// 11.5K total startups, 7 unicorns, $20.7B raised lifetime
// Distribution: Pre-seed 45%, Seed 31%, Series A 17%, Series B+ ~7%
export const startupStages = [
  { stage: "Pre-Seed", count: 186, avgTicket: 0.12 },
  { stage: "Seed", count: 126, avgTicket: 1.0 },
  { stage: "Series A", count: 72, avgTicket: 7.5 },
  { stage: "Series B", count: 32, avgTicket: 22.0 },
  { stage: "Series C+", count: 16, avgTicket: 58.0 },
  { stage: "PE/Growth", count: 9, avgTicket: 110.0 },
];

// ── Top Investor Countries (STATIC — update annually) ──
// Sources: InCorp Vietnam, ANT Consulting, MPI FIA (updated Mar 2026)
// South Korea overtook Singapore as #1 FDI source in early 2026 ($1.34B in Jan-Feb 2026)
// Cumulative FDI: Korea $92B, Singapore ~$75B, Japan $74B across all sectors
export const investorCountries = [
  { country: "South Korea", deals: 52, amount: 680 },
  { country: "Singapore", deals: 48, amount: 590 },
  { country: "Japan", deals: 35, amount: 420 },
  { country: "USA", deals: 26, amount: 380 },
  { country: "China/HK", deals: 22, amount: 310 },
  { country: "Taiwan", deals: 15, amount: 220 },
  { country: "Vietnam (domestic)", deals: 78, amount: 450 },
];

// ── IFC Regulatory Milestones (CURATED — add new milestones as they occur) ──
export const regulatoryMilestones = [
  { date: "2017", event: "SBV launches fintech regulatory sandbox pilot program", url: "https://www.sbv.gov.vn" },
  { date: "2019", event: "Decree 80/2019 on cashless payments — target 80% non-cash by 2025", url: "https://thuvienphapluat.vn/van-ban/Tien-te-Ngan-hang/Nghi-dinh-80-2019-ND-CP-thanh-toan-khong-dung-tien-mat/425381/noi-dung.aspx" },
  { date: "2020", event: "Mobile Money pilot approved for Viettel, VNPT, MobiFone", url: "https://vietnamnet.vn/en/three-telcos-licensed-to-pilot-mobile-money-services-in-vietnam-E185912.html" },
  { date: "2021", event: "E-KYC guidelines released by State Bank of Vietnam", url: "https://www.sbv.gov.vn" },
  { date: "2022", event: "Draft decree on fintech sandbox regulation published", url: "https://www.globalgovernmentfintech.com/vietnam-progresses-fintech-sandbox/" },
  { date: "2023", event: "Digital banking license framework proposed by SBV", url: "https://vir.com.vn/from-idea-to-market-fintech-sandbox-takes-shape-128543.html" },
  { date: "Jun 2024", event: "Resolution 98 — VIFC Da Nang special financial zone established", url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Nghi-quyet-98-2023-QH15" },
  { date: "Sep 2024", event: "VIFC Da Nang begins accepting entity registrations", url: "https://vifcdanang.vn" },
  { date: "Jan 2025", event: "Cross-border payment integration pilot with ASEAN nations", url: "https://www.napas.com.vn" },
  { date: "Mar 2025", event: "VIFC regulatory sandbox opens for fintech & blockchain startups", url: "https://www.tilleke.com/insights/vietnams-regulatory-sandboxes-paving-the-way-for-digital-innovation/" },
  { date: "Apr 2025", event: "Decree 94/2025 — SBV fintech sandbox formally enacted", url: "https://www.lexology.com/library/detail.aspx?g=9cc56020-1d65-4024-a503-72ade1dbeafb" },
  { date: "Jun 2025", event: "Vietnam carbon ETS pilot launches (Decision 232)", url: "https://icapcarbonaction.com/en/news/vietnam-approves-carbon-market-roadmap-pilot-ets-launch-june-2025" },
];

// ── Related Links (CURATED — add/remove as needed) ──
export const relatedLinks = [
  {
    title: "VIFC Da Nang Official Portal",
    url: "https://danang.gov.vn/vifc",
    source: "VIFC",
    description: "Official registration portal and regulatory guidelines for VIFC Da Nang",
  },
  {
    title: "State Bank of Vietnam — Fintech Regulations",
    url: "https://www.sbv.gov.vn",
    source: "SBV",
    description: "Central bank circulars on digital banking, e-wallets, and payment licensing",
  },
  {
    title: "Resolution 98/2023/QH15 — Full Text",
    url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Nghi-quyet-98-2023-QH15",
    source: "Government",
    description: "National Assembly resolution establishing the VIFC special financial zone",
  },
  {
    title: "FTSE Russell — Vietnam Market Classification",
    url: "https://www.ftserussell.com/equity-country-classification",
    source: "FTSE Russell",
    description: "Country classification review for Vietnam's potential upgrade to emerging market",
  },
  {
    title: "ASEAN Financial Innovation Network",
    url: "https://www.afin.tech",
    source: "ASEAN",
    description: "Cross-border fintech sandbox and payment interoperability initiatives",
  },
  {
    title: "Vietnam Fintech Club",
    url: "https://fintechclub.vn",
    source: "Industry",
    description: "Industry association tracking fintech ecosystem growth and policy advocacy",
  },
  {
    title: "SSC — Vietnam Securities Commission",
    url: "https://www.ssc.gov.vn",
    source: "Government",
    description: "Capital markets regulation, IPO guidelines, and foreign investor frameworks",
  },
  {
    title: "MPI — Foreign Investment Agency",
    url: "https://www.mpi.gov.vn/en",
    source: "Government",
    description: "FDI policy, special economic zone incentives, and investment procedures",
  },
];
