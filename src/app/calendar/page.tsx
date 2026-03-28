import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const events = [
    // Q1
    { date: "Jan", event: "SBV Annual Monetary Policy Direction", type: "Regulatory", recurring: true, impact: "High" },
    { date: "Jan", event: "GSO GDP & Economic Report (Full Year)", type: "Data Release", recurring: true, impact: "High" },
    { date: "Feb", event: "Tet Holiday (Lunar New Year) — Markets Closed 1 Week", type: "Market", recurring: true, impact: "Medium" },
    { date: "Mar", event: "VIFC Da Nang Quarterly Registration Report", type: "VIFC", recurring: true, impact: "Medium" },
    { date: "Mar", event: "SSC Annual Securities Market Report", type: "Data Release", recurring: true, impact: "Medium" },
    // Q2
    { date: "Apr", event: "Annual General Meeting Season (Listed Companies)", type: "Market", recurring: true, impact: "High" },
    { date: "Apr", event: "GSO Q1 GDP Preliminary Estimate", type: "Data Release", recurring: true, impact: "High" },
    { date: "May", event: "National Assembly Session (Legislation)", type: "Regulatory", recurring: true, impact: "High" },
    { date: "Jun", event: "FTSE Russell Annual Country Classification Review", type: "Market", recurring: true, impact: "Very High" },
    { date: "Jun", event: "VIFC Da Nang Semi-Annual Review", type: "VIFC", recurring: true, impact: "Medium" },
    // Q3
    { date: "Jul", event: "SBV Fintech Sandbox Annual Assessment (Decree 94)", type: "Regulatory", recurring: true, impact: "High" },
    { date: "Jul", event: "GSO Q2 GDP & H1 Economic Report", type: "Data Release", recurring: true, impact: "High" },
    { date: "Aug", event: "MSCI Annual Market Classification Review", type: "Market", recurring: true, impact: "Very High" },
    { date: "Sep", event: "VIFC Da Nang Anniversary & Annual Conference", type: "VIFC", recurring: true, impact: "Medium" },
    { date: "Sep", event: "Vietnam Fintech Summit (industry event)", type: "Industry", recurring: true, impact: "Medium" },
    // Q4
    { date: "Oct", event: "National Assembly Session (Budget & Legislation)", type: "Regulatory", recurring: true, impact: "High" },
    { date: "Oct", event: "GSO Q3 GDP Preliminary Estimate", type: "Data Release", recurring: true, impact: "High" },
    { date: "Nov", event: "SBV Interest Rate Decision (if applicable)", type: "Regulatory", recurring: false, impact: "High" },
    { date: "Nov", event: "Vietnam Blockchain Summit", type: "Industry", recurring: true, impact: "Medium" },
    { date: "Dec", event: "Annual Tax Filing Deadline for CIT", type: "Compliance", recurring: true, impact: "High" },
    { date: "Dec", event: "VIFC Da Nang Year-End Progress Report", type: "VIFC", recurring: true, impact: "Medium" },
    { date: "Dec", event: "Foreign Investor Quota Review (SSC)", type: "Regulatory", recurring: true, impact: "Medium" },
  ];

  const typeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Regulatory: "secondary",
    "Data Release": "outline",
    Market: "default",
    VIFC: "default",
    Industry: "outline",
    Compliance: "destructive",
  };

  const impactColors: Record<string, string> = {
    "Very High": "text-red-500",
    High: "text-amber-500",
    Medium: "text-muted-foreground",
  };

  const quarters = [
    { label: "Q1 (Jan-Mar)", months: ["Jan", "Feb", "Mar"] },
    { label: "Q2 (Apr-Jun)", months: ["Apr", "May", "Jun"] },
    { label: "Q3 (Jul-Sep)", months: ["Jul", "Aug", "Sep"] },
    { label: "Q4 (Oct-Dec)", months: ["Oct", "Nov", "Dec"] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Economic Calendar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Key dates for investors — regulatory decisions, data releases, market events,
          and VIFC milestones throughout the year
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(typeColors).map(([type, variant]) => (
          <Badge key={type} variant={variant} className="text-[10px]">{type}</Badge>
        ))}
      </div>

      {/* Calendar by Quarter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quarters.map((q) => (
          <Card key={q.label}>
            <CardHeader>
              <CardTitle className="text-base">{q.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter((e) => q.months.includes(e.date))
                  .map((e, i) => (
                    <div key={i} className="flex gap-3 items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <Badge variant="outline" className="shrink-0 font-mono text-[10px] w-10 justify-center">
                        {e.date}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{e.event}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={typeColors[e.type] || "outline"} className="text-[9px]">
                            {e.type}
                          </Badge>
                          <span className={`text-[10px] ${impactColors[e.impact]}`}>
                            {e.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Dates Callout */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Critical Dates for 2025-2026</CardTitle>
          <CardDescription>Non-recurring events with high market impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <Badge variant="destructive" className="shrink-0 text-[10px]">Jun 2026</Badge>
              <p className="text-sm"><span className="font-semibold">FTSE Russell Emerging Market Decision</span> — Potential upgrade from frontier to emerging. Could trigger $8B+ passive inflows.</p>
            </div>
            <div className="flex gap-3 items-start">
              <Badge variant="secondary" className="shrink-0 text-[10px]">Q3 2025</Badge>
              <p className="text-sm"><span className="font-semibold">First Digital Banking Licenses</span> — SBV expected to issue Vietnam&apos;s first digital-only bank licenses.</p>
            </div>
            <div className="flex gap-3 items-start">
              <Badge variant="secondary" className="shrink-0 text-[10px]">Late 2025</Badge>
              <p className="text-sm"><span className="font-semibold">Crypto Exchange Launch</span> — First licensed exchanges under Resolution 05/2025 expected to go live.</p>
            </div>
            <div className="flex gap-3 items-start">
              <Badge variant="outline" className="shrink-0 text-[10px]">2026</Badge>
              <p className="text-sm"><span className="font-semibold">ASEAN Cross-Border Payment Full Launch</span> — QR interoperability expanding from pilot to full deployment across 5 countries.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
