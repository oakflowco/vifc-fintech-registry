import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CapitalMarketsPage() {
  const keyStats = [
    { label: "VN-Index (2025)", value: "1,784", sub: "+41% YTD" },
    { label: "Market Cap", value: "$289B", sub: "~55% of GDP" },
    { label: "Listed Companies", value: "795+", sub: "HOSE + HNX + UPCOM" },
    { label: "Bond Market Size", value: "$147B", sub: "33.3% of GDP" },
    { label: "Corporate Bond Issuance", value: "$21.8B", sub: "+11.3% YoY (2025)" },
    { label: "Daily Trading Volume", value: "$1.2B+", sub: "HOSE average" },
  ];

  const exchanges = [
    {
      name: "HOSE (Ho Chi Minh Stock Exchange)",
      code: "HOSE",
      description: "Vietnam's main stock exchange and largest by market cap. Lists large-cap companies. Home to VN-Index — the benchmark index.",
      stats: [
        { label: "Listed Companies", value: "400+" },
        { label: "Market Cap", value: "~$250B" },
        { label: "Key Index", value: "VN-Index" },
        { label: "Listing Requirement", value: "VND 120B+ charter capital" },
      ],
      topListings: ["Vietcombank (VCB)", "Vingroup (VIC)", "Vinhomes (VHM)", "FPT Corp (FPT)", "Mobile World (MWG)", "Techcombank (TCB)"],
    },
    {
      name: "HNX (Hanoi Stock Exchange)",
      code: "HNX",
      description: "Secondary exchange for mid-cap stocks. Also operates the government bond market and UPCOM (unlisted public company market).",
      stats: [
        { label: "Listed Companies", value: "300+" },
        { label: "Market Cap", value: "~$20B" },
        { label: "Key Index", value: "HNX-Index" },
        { label: "Listing Requirement", value: "VND 30B+ charter capital" },
      ],
      topListings: ["SHB Bank", "Military Bank (MBB)", "Vietnam Gas (GAS)", "PV Drilling (PVD)"],
    },
    {
      name: "UPCOM (Unlisted Public Company Market)",
      code: "UPCOM",
      description: "OTC market for unlisted public companies, operated by HNX. Stepping stone before full listing on HOSE or HNX. Includes state-owned enterprises post-equitization.",
      stats: [
        { label: "Companies", value: "900+" },
        { label: "Market Cap", value: "~$19B" },
        { label: "Key Index", value: "UPCOM-Index" },
        { label: "Listing Requirement", value: "VND 10B+ charter capital" },
      ],
      topListings: ["ACV (Airports Corp)", "Agribank Securities", "Various SOEs"],
    },
  ];

  const bondMarket = {
    overview: "Vietnam's bond market reached VND 3,830 trillion ($147B) in 2025, representing 33.3% of GDP. Government bonds dominate at ~70%, with corporate bonds growing rapidly at 44% YoY in the first 9 months of 2025.",
    segments: [
      {
        name: "Government Bonds",
        size: "$95B+ (listed value)",
        growth: "+11.1% YoY",
        details: "Average issuance term: 9.84 years. Average yield: 3.07%/year. 57% of 2025 plan completed by Oct 2025. Daily trading: VND 15,271B/session (+29.6% YoY).",
      },
      {
        name: "Corporate Bonds",
        size: "$21.8B issued (2025)",
        growth: "+11.3% YoY",
        details: "Banking sector: 70% of private placements, 86% of public offerings. Real estate: 22% private, 10% public. Green bonds emerging as new segment.",
      },
      {
        name: "Municipal Bonds",
        size: "Emerging",
        growth: "New segment",
        details: "Da Nang, HCMC, and Hanoi exploring municipal bond issuance for infrastructure projects. VIFC could facilitate international municipal bond listings.",
      },
    ],
  };

  const foreignInvestor = {
    rules: [
      { rule: "Foreign Ownership Limit", detail: "49% for most sectors, 30% for banking. Some companies (e.g., FPT, HCMC Securities) have applied for room expansion." },
      { rule: "FTSE Upgrade Watch", detail: "FTSE Russell reviewing Vietnam for potential frontier → emerging market upgrade by 2026. Could unlock $8B+ in passive inflows." },
      { rule: "MSCI Classification", detail: "MSCI classifying Vietnam as Frontier Market. Pre-accessibility review underway. Central clearing (CCP) is the key remaining requirement." },
      { rule: "KRX System Launch", detail: "Korea Exchange (KRX) system deployment replaces legacy trading infrastructure. Enables T+2 settlement, short selling expansion, and derivatives." },
      { rule: "Foreign Account Setup", detail: "Register securities trading code via SSC. Open custodian account at local bank. Typical setup: 2-3 weeks. Need indirect investment license for >10% stakes." },
      { rule: "Tax Treatment", detail: "Capital gains tax: 0.1% of selling value (flat rate) or 20% of net gain (can choose). Dividend tax: 0% (already taxed at corporate level). No inheritance tax on securities." },
    ],
  };

  const derivatives = [
    { product: "VN30 Index Futures", exchange: "HOSE", status: "Active", launched: "2017", volume: "150,000+ contracts/day" },
    { product: "Government Bond Futures (5-year)", exchange: "HNX", status: "Active", launched: "2019", volume: "1,000+ contracts/day" },
    { product: "Covered Warrants", exchange: "HOSE", status: "Active", launched: "2019", volume: "50M+ warrants/day" },
    { product: "Stock Index Options", exchange: "HOSE", status: "Planned", launched: "2026 (expected)", volume: "—" },
    { product: "Single Stock Futures", exchange: "HOSE", status: "Planned", launched: "2026-2027", volume: "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vietnam Capital Markets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive overview of Vietnam&apos;s stock exchanges, bond market, derivatives, and foreign investor framework
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {keyStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-1">{s.label}</div>
              <div className="text-[10px] text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Exchanges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Stock Exchanges</h2>
        <div className="space-y-4">
          {exchanges.map((ex) => (
            <Card key={ex.code}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{ex.name}</CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px]">{ex.code}</Badge>
                </div>
                <CardDescription>{ex.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {ex.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Key Listings:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.topListings.map((l) => (
                      <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bond Market */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Bond Market</h2>
        <p className="text-sm text-muted-foreground mb-4">{bondMarket.overview}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bondMarket.segments.map((seg) => (
            <Card key={seg.name}>
              <CardHeader>
                <CardTitle className="text-sm">{seg.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">{seg.size}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{seg.growth}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{seg.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Derivatives */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Derivatives Market</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2.5 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground">Exchange</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground">Launched</th>
                    <th className="text-right py-2.5 font-medium text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {derivatives.map((d) => (
                    <tr key={d.product} className="border-b last:border-0">
                      <td className="py-2.5 font-medium">{d.product}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-[10px]">{d.exchange}</Badge></td>
                      <td className="py-2.5"><Badge variant={d.status === "Active" ? "default" : "secondary"} className="text-[10px]">{d.status}</Badge></td>
                      <td className="py-2.5 text-muted-foreground font-mono text-xs">{d.launched}</td>
                      <td className="py-2.5 text-right text-muted-foreground text-xs">{d.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Foreign Investor Rules */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Foreign Investor Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foreignInvestor.rules.map((r) => (
            <Card key={r.rule}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{r.rule}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
