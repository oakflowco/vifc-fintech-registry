import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RisksPage() {
  const risks = [
    {
      category: "Regulatory",
      level: "Medium",
      items: [
        { risk: "Regulatory Uncertainty", detail: "Fintech-specific laws are still evolving. Decree 94 (sandbox) only covers 3 activities. Crypto framework still in pilot phase. Rules can change with limited notice." },
        { risk: "Licensing Complexity", detail: "Multiple regulators (SBV, SSC, MOF, MIC) with overlapping jurisdictions. License processing can take 3-12 months. Requirements may change during application." },
        { risk: "Data Localization", detail: "Cybersecurity Law requires certain data to be stored in Vietnam. Cross-border data transfer requires government approval in some cases." },
        { risk: "AML/CFT Compliance", detail: "Vietnam is on FATF grey list monitoring. Enhanced compliance requirements for financial institutions. KYC/AML standards are tightening." },
      ],
    },
    {
      category: "Market",
      level: "Medium",
      items: [
        { risk: "Currency Risk (VND)", detail: "VND has depreciated ~3-5% annually vs USD over the past decade. SBV manages the exchange rate within a band. Capital controls exist on large transactions." },
        { risk: "Competition Intensity", detail: "E-wallet market has 40+ players — consolidation expected. Banks are launching their own fintech arms. Regional giants (Grab, Sea) have deep pockets." },
        { risk: "Consumer Trust", detail: "Several P2P lending platforms have failed, damaging sector reputation. Crypto scams (iFan/Pincoin) created public skepticism. Trust building takes time." },
        { risk: "Talent Shortage", detail: "Demand for fintech talent exceeds supply. Senior product, compliance, and risk management roles are hard to fill. Salary inflation in tech sector." },
      ],
    },
    {
      category: "Operational",
      level: "Low-Medium",
      items: [
        { risk: "Infrastructure Gaps", detail: "Internet reliability varies outside major cities. Payment acceptance in rural areas is limited. Data center capacity is growing but still behind regional leaders." },
        { risk: "IP Protection", detail: "IP enforcement is improving but still weaker than developed markets. Software patents are difficult to enforce. Trade secret protection requires careful contracts." },
        { risk: "Bureaucracy", detail: "Government processes can be slow and require multiple touchpoints. Relationships matter — having a local partner or advisor is strongly recommended." },
        { risk: "Tax Disputes", detail: "Transfer pricing audits are increasing. Tax authorities may interpret regulations differently than expected. Pre-ruling options are limited." },
      ],
    },
    {
      category: "Political & Macro",
      level: "Low",
      items: [
        { risk: "Political Stability", detail: "One-party system provides policy continuity. Anti-corruption campaigns can disrupt business relationships. Leadership transitions are managed internally." },
        { risk: "Geopolitical Tensions", detail: "South China Sea disputes create periodic tensions. Vietnam maintains balanced foreign policy (US, China, ASEAN). Trade diversification reduces concentration risk." },
        { risk: "Climate & Natural Disasters", detail: "Central Vietnam (including Da Nang) is exposed to typhoons (Sept-Nov). Flooding in Mekong Delta affects agriculture. Climate adaptation infrastructure is improving." },
        { risk: "Global Economic Slowdown", detail: "Export-dependent economy is exposed to global demand. FDI flows can slow during global recessions. However, Vietnam has historically recovered faster than peers." },
      ],
    },
  ];

  const levelColors: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
    High: "destructive",
    "Medium-High": "destructive",
    Medium: "secondary",
    "Low-Medium": "outline",
    Low: "default",
  };

  const mitigations = [
    { risk: "Regulatory changes", mitigation: "Engage local legal counsel early. Join Vietnam Fintech Club for policy updates. Participate in regulatory consultations." },
    { risk: "Currency exposure", mitigation: "Use natural hedging (VND revenue, VND costs). Consider offshore holding structure. Monitor SBV policy announcements." },
    { risk: "Talent acquisition", mitigation: "Partner with universities (HUST, FPT, RMIT Vietnam). Offer equity/options (unusual in Vietnam = competitive advantage). Consider remote/hybrid from HCMC." },
    { risk: "IP protection", mitigation: "Register IP in Vietnam early. Use strong NDAs and employment contracts. Consider trade secret protection over patents." },
    { risk: "Operational complexity", mitigation: "Hire a reputable local law firm and accounting firm. Use VIFC one-stop-shop services. Build relationships with relevant regulators." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Risks & Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          An honest assessment of the risks investors should consider when entering
          Vietnam&apos;s financial ecosystem, with practical mitigation strategies.
        </p>
      </div>

      {/* Risk Cards */}
      <div className="space-y-6 mb-12">
        {risks.map((cat) => (
          <Card key={cat.category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{cat.category} Risks</CardTitle>
                <Badge variant={levelColors[cat.level]} className="text-[10px]">
                  Risk Level: {cat.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item) => (
                  <div key={item.risk} className="border rounded-lg p-3">
                    <h3 className="text-sm font-semibold mb-1">{item.risk}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mitigations */}
      <Card>
        <CardHeader>
          <CardTitle>Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mitigations.map((m) => (
              <div key={m.risk} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                <Badge variant="outline" className="shrink-0 text-[10px]">{m.risk}</Badge>
                <p className="text-sm text-muted-foreground">{m.mitigation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
