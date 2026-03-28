import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InvestorGuidePage() {
  const steps = [
    {
      step: "1",
      title: "Choose Your Investment Structure",
      content: [
        { option: "Direct FDI", desc: "Set up a 100% foreign-owned company (LLC or JSC) — full control, takes 3-6 weeks", best: "Operating businesses, fintech companies" },
        { option: "Joint Venture", desc: "Partner with a Vietnamese entity — required in some sectors (banking, media)", best: "Regulated sectors, local market access" },
        { option: "VIFC Registration", desc: "Register in VIFC Da Nang for financial services — special incentives, streamlined process", best: "Financial institutions, fintech, blockchain" },
        { option: "Representative Office", desc: "No revenue-generating activities, used for market research and liaison — 1-2 weeks setup", best: "Market exploration phase" },
        { option: "Portfolio Investment", desc: "Invest in listed securities via foreign investor account at a licensed broker", best: "Public equity, bonds" },
      ],
    },
    {
      step: "2",
      title: "Understand Foreign Ownership Rules",
      content: [
        { option: "100% Foreign Owned", desc: "Allowed in most sectors including fintech, technology, consulting, manufacturing", best: "Default for most investors" },
        { option: "49% Cap", desc: "Banking, telecom, crypto exchanges, media — foreign ownership capped", best: "Must find local partner" },
        { option: "30% Cap", desc: "Public listed companies (standard cap, can apply for higher)", best: "Stock market investment" },
        { option: "No Cap (VIFC)", desc: "100% foreign ownership for most financial activities within VIFC zone", best: "Financial institutions targeting VIFC" },
      ],
    },
    {
      step: "3",
      title: "Register Your Business",
      content: [
        { option: "Business Registration Certificate", desc: "Apply at Department of Planning & Investment (DPI) — online at National Business Registration Portal", best: "First step for all entities" },
        { option: "Investment Registration Certificate (IRC)", desc: "Required for FDI projects — apply at DPI or Industrial Zone authority", best: "Projects with foreign capital" },
        { option: "VIFC Registration", desc: "Apply via VIFC e-Registration portal — concurrent with IRC application", best: "Financial services entities" },
        { option: "Sector License", desc: "Additional license from SBV (banking/payments), SSC (securities), or MOF (insurance)", best: "Regulated financial activities" },
      ],
    },
    {
      step: "4",
      title: "Tax Planning",
      content: [
        { option: "Standard CIT", desc: "20% corporate income tax — standard rate for most businesses", best: "Non-incentivized sectors" },
        { option: "VIFC Incentive", desc: "0% first 4 years, 5% next 9 years, 10% thereafter — for qualified VIFC entities", best: "Financial services in Da Nang" },
        { option: "SEZ/Hi-Tech Incentive", desc: "10-17% CIT for companies in special economic zones or hi-tech parks", best: "Tech companies, R&D centers" },
        { option: "Withholding Tax", desc: "Dividends to foreign shareholders: 0% (already taxed at CIT level). Interest: 5%. Royalties: 10%", best: "Tax treaty planning" },
        { option: "Transfer Pricing", desc: "Vietnam follows OECD guidelines — arm's length principle, documentation required for related-party transactions", best: "Multinational structures" },
      ],
    },
    {
      step: "5",
      title: "Set Up Operations",
      content: [
        { option: "Office Space", desc: "Grade A office: Da Nang $8-15/sqft, HCMC $25-40/sqft, Hanoi $20-35/sqft", best: "Physical presence required for most licenses" },
        { option: "Bank Account", desc: "Open direct investment capital account (DICA) at any commercial bank — Vietcombank, BIDV, Techcombank recommended for foreign companies", best: "Required for capital contribution" },
        { option: "Work Permits", desc: "Required for foreign employees — apply at DOLISA, takes 2-4 weeks. VIFC has streamlined process", best: "All foreign staff" },
        { option: "Accounting & Compliance", desc: "Vietnam Accounting Standards (VAS) — annual audit required for FDI companies. Tax filing monthly/quarterly", best: "Hire local accounting firm" },
      ],
    },
    {
      step: "6",
      title: "Repatriate Profits",
      content: [
        { option: "Profit Repatriation", desc: "Freely allowed after fulfilling tax obligations — no approval needed, just tax clearance certificate", best: "Annual after audit" },
        { option: "Capital Repatriation", desc: "Allowed upon dissolution or capital reduction — requires Investment Registration amendment", best: "Exit planning" },
        { option: "Tax Treaties", desc: "Vietnam has 80+ double taxation agreements — check treaty with your home country for reduced withholding rates", best: "Optimize via holding structure" },
      ],
    },
  ];

  const keyCosts = [
    { item: "Company Registration", cost: "$500-2,000", timeline: "3-6 weeks" },
    { item: "VIFC Registration", cost: "$1,000-3,000", timeline: "2-4 weeks" },
    { item: "Banking License", cost: "$50,000+", timeline: "6-12 months" },
    { item: "Payment Intermediary License", cost: "$5,000-15,000", timeline: "3-6 months" },
    { item: "Securities License", cost: "$10,000-30,000", timeline: "3-6 months" },
    { item: "Office (12-month lease)", cost: "$3,000-15,000/year", timeline: "1-2 weeks" },
    { item: "Work Permit (per person)", cost: "$400-600", timeline: "2-4 weeks" },
    { item: "Annual Audit", cost: "$2,000-10,000", timeline: "Annual" },
    { item: "Legal Counsel (setup)", cost: "$5,000-20,000", timeline: "Ongoing" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">For Foreign Investors</Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          How to Invest in Vietnam — Step by Step
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          A practical guide for international investors looking to enter Vietnam&apos;s
          fintech and financial services market, covering legal structures, licensing,
          tax planning, and operations.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8 mb-12">
        {steps.map((step) => (
          <div key={step.step}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {step.step}
              </div>
              <h2 className="text-lg font-bold">{step.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
              {step.content.map((item) => (
                <Card key={item.option}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{item.option}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                    <Badge variant="outline" className="text-[10px]">Best for: {item.best}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Estimates */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Setup Costs</CardTitle>
          <CardDescription>Typical costs for establishing a financial services entity in Vietnam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2.5 font-medium text-muted-foreground">Item</th>
                  <th className="text-right py-2.5 font-medium text-muted-foreground">Estimated Cost</th>
                  <th className="text-right py-2.5 font-medium text-muted-foreground">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {keyCosts.map((row) => (
                  <tr key={row.item} className="border-b last:border-0">
                    <td className="py-2.5">{row.item}</td>
                    <td className="py-2.5 text-right font-mono">{row.cost}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{row.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
