import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Vietnam Carbon Credits & ETS Market",
  description:
    "Vietnam's carbon credit market: ETS pilot timeline, carbon pricing roadmap, and green finance opportunities.",
};

export default function CarbonPage() {
  const keyFacts = [
    { label: "ETS Pilot Launch", value: "Jun 2025", sub: "Decision 232/QĐ-TTg" },
    { label: "Exchange Pilot", value: "Late 2026", sub: "Originally planned 2025" },
    { label: "Covered Emissions", value: "50%", sub: "Of national CO₂" },
    { label: "Free Allowances Until", value: "2028", sub: "Auctions from 2029" },
    { label: "Offset Limit", value: "30%", sub: "Of total emissions" },
    { label: "Target Sectors", value: "3", sub: "Power, steel, cement" },
  ];

  const timeline = [
    { period: "2025 (H1)", event: "Pilot ETS launch", detail: "Mandatory MRV (monitoring, reporting, verification) for covered entities. First batch of free allowances allocated for 2025–2026 emissions.", status: "Active" },
    { period: "2025 (H2)", event: "Allowance distribution", detail: "Companies receive free emission allowances based on historical emissions and benchmarks. No auctioning yet.", status: "Active" },
    { period: "2026", event: "Carbon exchange pilot", detail: "HNX-operated carbon credit exchange begins trial trading. Domestic credits and international credits (CDM, JCM, Article 6) eligible.", status: "Planned" },
    { period: "2027", event: "Expansion", detail: "Additional sectors may be added (chemicals, paper, textile). Tightening of free allocation caps.", status: "Planned" },
    { period: "2028", event: "Review & transition", detail: "Assessment of pilot phase. Preparation for full market with auction-based allocation.", status: "Planned" },
    { period: "2029+", event: "Full ETS launch", detail: "Permit auctions begin. Price-based carbon signal emerges. Potential linkage with regional carbon markets (ASEAN, Article 6).", status: "Planned" },
  ];

  const creditTypes = [
    {
      type: "Domestic Voluntary Credits",
      description: "Credits generated from Vietnamese emissions reduction projects (renewable energy, forestry, waste management). Must be registered and verified under national standards.",
      eligible: true,
      mechanism: "Vietnam Carbon Registry",
    },
    {
      type: "Clean Development Mechanism (CDM)",
      description: "UN-issued CERs from Vietnamese CDM projects. Vietnam has 260+ registered CDM projects — one of the highest in ASEAN.",
      eligible: true,
      mechanism: "UNFCCC CDM Registry",
    },
    {
      type: "Joint Credit Mechanism (JCM)",
      description: "Bilateral Japan-Vietnam mechanism for technology transfer and emissions reductions. Japan funds low-carbon tech, both countries share credits.",
      eligible: true,
      mechanism: "JCM Registry (Japan-Vietnam)",
    },
    {
      type: "Article 6 Credits (Paris Agreement)",
      description: "International carbon credits under Article 6.2 (bilateral) and 6.4 (centralized) of the Paris Agreement. Vietnam signed Article 6.2 agreements with Japan, South Korea, Switzerland.",
      eligible: true,
      mechanism: "Paris Agreement Art. 6",
    },
    {
      type: "REDD+ Credits (Forestry)",
      description: "Vietnam received $51.5M from World Bank's FCPF for reducing deforestation in North Central region (2018-2024). 10.3M tons CO₂ verified.",
      eligible: true,
      mechanism: "World Bank FCPF / ERPA",
    },
    {
      type: "Verra / Gold Standard (International)",
      description: "Voluntary carbon credits from international registries. Eligibility for Vietnam's domestic offset mechanism still under review.",
      eligible: false,
      mechanism: "Under review",
    },
  ];

  const sectors = [
    {
      sector: "Power Generation",
      emissions: "~150 Mt CO₂/year",
      coverage: "Thermal power plants > 25MW",
      entities: "~50 facilities",
      opportunity: "Renewable energy certificates (RECs), coal-to-gas switching, solar/wind project credits",
    },
    {
      sector: "Steel",
      emissions: "~35 Mt CO₂/year",
      coverage: "Blast furnace operations",
      entities: "~20 facilities",
      opportunity: "Electric arc furnace conversion, energy efficiency credits, scrap-based steelmaking",
    },
    {
      sector: "Cement",
      emissions: "~50 Mt CO₂/year",
      coverage: "Clinker production facilities",
      entities: "~40 facilities",
      opportunity: "Alternative fuels, clinker substitution, carbon capture pilot projects",
    },
  ];

  const investmentOps = [
    {
      area: "Carbon Credit Project Development",
      potential: "High",
      detail: "Develop verified emissions reduction projects (solar, wind, biogas, forestry) and sell credits on the exchange. Early movers can establish inventory before demand increases in 2029.",
    },
    {
      area: "Carbon Trading & Brokerage",
      potential: "Medium-High",
      detail: "License as a carbon credit broker or trading firm on the HNX exchange. Requires financial services expertise and SSC/MOF approval.",
    },
    {
      area: "MRV Technology & Consulting",
      potential: "High",
      detail: "Monitoring, Reporting, and Verification services for covered entities. IoT-based emissions monitoring, digital MRV platforms, third-party verification.",
    },
    {
      area: "Carbon Finance & Insurance",
      potential: "Medium",
      detail: "Carbon credit-backed financing, carbon price hedging instruments, delivery risk insurance for forward carbon contracts.",
    },
    {
      area: "Forestry & REDD+ Credits",
      potential: "High",
      detail: "Vietnam has 14.7M hectares of forest (47% coverage). REDD+ credits from avoided deforestation and reforestation are high-quality and internationally recognized.",
    },
    {
      area: "Green Bond Issuance",
      potential: "Medium-High",
      detail: "Issue green bonds linked to carbon reduction projects. VIFC Da Nang is positioned to facilitate international green bond listings.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">Emerging Market</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Vietnam Carbon Credits Market</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Vietnam is building its Emissions Trading Scheme (ETS) and carbon credit exchange,
          targeting 50% of national CO₂ emissions. The pilot launched June 2025 with full
          market operations expected by 2029.
        </p>
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {keyFacts.map((f) => (
          <Card key={f.label}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{f.value}</div>
              <div className="text-xs font-medium mt-1">{f.label}</div>
              <div className="text-[10px] text-muted-foreground">{f.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Timeline */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Implementation Roadmap</h2>
        <div className="space-y-3">
          {timeline.map((t) => (
            <div key={t.period} className="flex gap-4 items-start">
              <div className="flex items-center gap-2 shrink-0 w-28">
                <Badge variant={t.status === "Active" ? "default" : "outline"} className="font-mono text-[10px]">
                  {t.period}
                </Badge>
              </div>
              <div className="border-b pb-3 flex-1">
                <h3 className="text-sm font-semibold">{t.event}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Covered Sectors */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Covered Sectors (Pilot Phase)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sectors.map((s) => (
            <Card key={s.sector}>
              <CardHeader>
                <CardTitle className="text-sm">{s.sector}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Emissions:</span> <span className="font-medium">{s.emissions}</span></div>
                  <div><span className="text-muted-foreground">Entities:</span> <span className="font-medium">{s.entities}</span></div>
                </div>
                <p className="text-[10px] text-muted-foreground">{s.coverage}</p>
                <div className="pt-2 border-t">
                  <p className="text-[10px] text-muted-foreground"><span className="font-medium">Opportunity:</span> {s.opportunity}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Eligible Credit Types */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Eligible Carbon Credit Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creditTypes.map((ct) => (
            <Card key={ct.type}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{ct.type}</CardTitle>
                  <Badge variant={ct.eligible ? "default" : "secondary"} className="text-[9px]">
                    {ct.eligible ? "Eligible" : "Under Review"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">{ct.description}</p>
                <Badge variant="outline" className="text-[9px]">{ct.mechanism}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Investment Opportunities */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Investment Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentOps.map((op) => (
            <Card key={op.area}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{op.area}</CardTitle>
                  <Badge variant={op.potential.includes("High") ? "default" : "secondary"} className="text-[9px] shrink-0">
                    {op.potential}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{op.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
