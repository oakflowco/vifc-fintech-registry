import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarketSizePage() {
  const sectors = [
    {
      name: "Digital Payments & E-Wallets",
      tam: "$25B",
      sam: "$12B",
      som: "$4.8B",
      growth: "28%",
      penetration: "45%",
      keyPlayers: ["MoMo", "VNPay", "ZaloPay", "Viettel Money", "ShopeePay"],
      outlook: "Expected to reach $25B transaction value by 2027. Mobile Money pilot expanding to full license. QR payments becoming ubiquitous.",
    },
    {
      name: "Digital Lending (P2P & Consumer)",
      tam: "$15B",
      sam: "$6B",
      som: "$2.1B",
      growth: "35%",
      penetration: "18%",
      keyPlayers: ["FE Credit", "MCredit", "Tima", "Robocash", "Fundiin"],
      outlook: "Massive underbanked population (31M adults). BNPL growing 50%+ YoY. Regulatory sandbox maturing into full framework.",
    },
    {
      name: "InsurTech",
      tam: "$8B",
      sam: "$2.5B",
      som: "$400M",
      growth: "32%",
      penetration: "3.5%",
      keyPlayers: ["Mfast", "Papaya", "Saladin", "LIAN", "OPES"],
      outlook: "Insurance penetration at only 3.5% of GDP vs 8-12% in developed markets. Digital distribution is the main growth driver.",
    },
    {
      name: "Investment & WealthTech",
      tam: "$5B",
      sam: "$1.5B",
      som: "$300M",
      growth: "40%",
      penetration: "8%",
      keyPlayers: ["Finhay", "Infina", "TCBS", "SSI iBoard"],
      outlook: "New investor accounts grew 300% 2020-2022. Retail participation in stock market at 8% vs 55% in US. Massive room for robo-advisory and micro-investing.",
    },
    {
      name: "Blockchain & Digital Assets",
      tam: "$4B",
      sam: "$1.5B",
      som: "$500M",
      growth: "45%",
      penetration: "21%",
      keyPlayers: ["Sky Mavis", "Kyber Network", "Coin98", "U2U Chain", "KardiaChain"],
      outlook: "21M crypto holders (#1 per capita globally). Government building regulatory framework. VIFC sandbox accepting blockchain projects.",
    },
    {
      name: "Banking Infrastructure & Open Banking",
      tam: "$3B",
      sam: "$1B",
      som: "$250M",
      growth: "25%",
      penetration: "12%",
      keyPlayers: ["NAPAS", "OneFin", "ECPay", "Payoo", "VNLife"],
      outlook: "SBV mandating Open API standards. BaaS emerging as banks partner with fintechs. Real-time payment volume growing 40% YoY.",
    },
    {
      name: "Credit Scoring & Data Analytics",
      tam: "$1B",
      sam: "$300M",
      som: "$80M",
      growth: "30%",
      penetration: "15%",
      keyPlayers: ["Trusting Social", "CIC Vietnam", "FiinGroup"],
      outlook: "National credit bureau expanding coverage. Alternative data scoring (telecom, social, e-commerce) gaining regulatory acceptance.",
    },
    {
      name: "Remittance & Cross-Border",
      tam: "$2B",
      sam: "$800M",
      som: "$200M",
      growth: "20%",
      penetration: "25%",
      keyPlayers: ["Remitano", "VNPay Intl", "MoneyGram/MoMo"],
      outlook: "Vietnam receives $18B+ in annual remittances (top 10 globally). ASEAN QR payment integration will transform cross-border flows.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Market Size Estimates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Total Addressable Market (TAM), Serviceable Market (SAM), and current obtainable market
          (SOM) for each fintech sector in Vietnam
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">$63B+</div>
            <div className="text-xs text-muted-foreground">Total TAM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">$25.6B</div>
            <div className="text-xs text-muted-foreground">Total SAM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">$8.6B</div>
            <div className="text-xs text-muted-foreground">Current SOM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">30%+</div>
            <div className="text-xs text-muted-foreground">Avg Growth Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Sectors */}
      <div className="space-y-6">
        {sectors.map((sector) => (
          <Card key={sector.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{sector.name}</CardTitle>
                  <CardDescription className="mt-1">{sector.outlook}</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                  {sector.growth} CAGR
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">TAM</p>
                  <p className="text-lg font-bold">{sector.tam}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SAM</p>
                  <p className="text-lg font-bold">{sector.sam}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SOM (Current)</p>
                  <p className="text-lg font-bold">{sector.som}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Penetration</p>
                  <p className="text-lg font-bold">{sector.penetration}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Key Players:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sector.keyPlayers.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Estimates based on industry reports, company disclosures, and market analysis.
          TAM = Total Addressable Market, SAM = Serviceable Addressable Market, SOM = Serviceable Obtainable Market.
        </p>
      </div>
    </div>
  );
}
