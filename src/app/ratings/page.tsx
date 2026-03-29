import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchSovereignRatings } from "@/lib/fetch-ratings";
import { fetchRatingAgencies } from "@/lib/fetch-editorial";

export const metadata: Metadata = {
  title: "Vietnam Credit Ratings & Data Providers",
  description:
    "Credit rating agencies and financial data providers covering Vietnam: Fitch, Moody's, S&P, and local agencies.",
};

export const revalidate = 3600;

// Fallback agencies data — used when Google Sheet is not configured
const AGENCIES_FALLBACK = [
  {
    name: "FiinRatings",
    type: "Domestic",
    established: "2017",
    regulator: "MOF / SSC",
    description: "Vietnam's first and largest domestic credit rating agency. Subsidiary of FiinGroup. Rates corporate bonds, bank deposits, and insurance companies. ESMA-comparable standards.",
    coverage: ["Corporate bonds (200+ issuers)", "Bank deposits & financial strength", "Insurance company ratings", "Structured finance", "ESG assessments"],
    website: "fiinratings.vn",
    methodology: "Based on international best practices (S&P/Moody's aligned). 20-notch rating scale from AAA to D.",
  },
  {
    name: "Saigon Ratings (SaigonRatings)",
    type: "Domestic",
    established: "2023",
    regulator: "MOF / SSC",
    description: "Vietnam's second domestic credit rating agency. Licensed by MOF. Focuses on corporate bonds and financial institutions in the southern market.",
    coverage: ["Corporate bond ratings", "Financial institution assessments", "SME credit assessments"],
    website: "saigonratings.com.vn",
    methodology: "Developing proprietary methodology aligned with Vietnamese market conditions.",
  },
  {
    name: "S&P Global Ratings",
    type: "International (Big 3)",
    established: "Coverage since 2002",
    regulator: "SEC (US)",
    description: "Rates Vietnam's sovereign credit and major corporations/banks. Vietnam sovereign: BB+ (one notch below investment grade).",
    coverage: ["Sovereign rating: BB+ (stable outlook)", "Major banks (Vietcombank, BIDV, VietinBank)", "State-owned enterprises", "Government-related entities"],
    website: "spglobal.com/ratings",
    methodology: "Global methodology. Key upgrade factors: fiscal consolidation, banking sector NPL resolution, governance improvements.",
  },
  {
    name: "Moody's Investors Service",
    type: "International (Big 3)",
    established: "Coverage since 2005",
    regulator: "SEC (US)",
    description: "Rates Vietnam sovereign and major financial institutions. Vietnam sovereign: Ba2 (equivalent to BB).",
    coverage: ["Sovereign rating: Ba2 (stable outlook)", "Major commercial banks", "Insurance companies", "Infrastructure bonds"],
    website: "moodys.com",
    methodology: "Global methodology. Vietnam on upgrade watchlist due to economic resilience and banking reform progress.",
  },
  {
    name: "Fitch Ratings",
    type: "International (Big 3)",
    established: "Coverage since 2008",
    regulator: "SEC (US)",
    description: "Rates Vietnam sovereign and selectively covers banks and corporates. Vietnam sovereign: BB+ (positive outlook).",
    coverage: ["Sovereign rating: BB+ (positive outlook)", "Selected banks", "Government bonds", "Structured finance"],
    website: "fitchratings.com",
    methodology: "Positive outlook — closest to investment grade upgrade among the Big 3. Key factor: continued GDP growth and fiscal discipline.",
  },
  {
    name: "FiinGroup (Research & Data)",
    type: "Domestic Data Provider",
    established: "2008",
    regulator: "SSC",
    description: "Vietnam's leading financial data and research platform. Parent of FiinRatings. Provides FiinPro terminal (Vietnam's 'Bloomberg'), industry analytics, and ESG data.",
    coverage: ["FiinPro terminal (700+ institutional users)", "Listed company financials", "Bond market data", "Industry research reports", "ESG scoring (FiinESG)"],
    website: "fiingroup.vn",
    methodology: "Proprietary database covering 3,000+ Vietnamese companies. Real-time market data and analytics.",
  },
  {
    name: "Vietnam Bond Market Association (VBMA)",
    type: "Industry Body",
    established: "2007",
    regulator: "MOF",
    description: "Self-regulatory organization for the bond market. Publishes bond market reports, yield curves, and trading data. Key infrastructure for bond market transparency.",
    coverage: ["Monthly bond market reports", "Government bond yield curves", "Corporate bond trading data", "Market statistics & analysis"],
    website: "vbma.org.vn",
    methodology: "Aggregates data from HNX, commercial banks, and bond dealers.",
  },
];

export default async function RatingsPage() {
  const [sovereignRatings, sheetAgencies] = await Promise.all([
    fetchSovereignRatings(),
    fetchRatingAgencies(),
  ]);

  const agencies = sheetAgencies.length > 0 ? sheetAgencies : AGENCIES_FALLBACK;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Credit Rating Agencies & Data Providers</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Domestic and international credit rating agencies covering Vietnam, sovereign ratings,
          and financial data infrastructure supporting the capital markets.
        </p>
      </div>

      {/* Sovereign Ratings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vietnam Sovereign Credit Ratings</CardTitle>
          <CardDescription>One notch below investment grade — upgrade watch by all three agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sovereignRatings.map((sr) => (
              <div key={sr.agency} className="border rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{sr.agency}</p>
                <p className="text-3xl font-bold mt-1">{sr.rating}</p>
                <Badge variant={sr.outlook === "Positive" ? "default" : "outline"} className="mt-2 text-[10px]">
                  {sr.outlook} Outlook
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">Last: {sr.lastUpdate}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            BB+ / Ba2 = one notch below investment grade (BBB- / Baa3). Fitch&apos;s positive outlook
            suggests potential upgrade to investment grade, which would be transformative for capital inflows.
          </p>
        </CardContent>
      </Card>

      {/* Agency Cards */}
      <div className="space-y-4">
        {agencies.map((ag) => (
          <Card key={ag.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{ag.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{ag.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={ag.type.includes("Domestic") ? "default" : "outline"} className="text-[10px]">
                    {ag.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                <div><span className="text-muted-foreground">Established:</span> <span className="font-medium">{ag.established}</span></div>
                <div><span className="text-muted-foreground">Regulator:</span> <span className="font-medium">{ag.regulator}</span></div>
              </div>
              <div className="mb-3">
                <p className="text-[10px] text-muted-foreground mb-1.5">Coverage:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ag.coverage.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2"><span className="font-medium">Methodology:</span> {ag.methodology}</p>
              <a href={`https://${ag.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline underline-offset-4">
                {ag.website}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
