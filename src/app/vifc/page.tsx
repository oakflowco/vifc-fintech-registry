import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VIFCPage() {
  const incentives = [
    { title: "Corporate Income Tax", detail: "0% for first 4 years, 5% for next 9 years, 10% thereafter for qualified entities", icon: "%" },
    { title: "Personal Income Tax", detail: "Flat 15% for foreign experts working in VIFC (vs. up to 35% standard)", icon: "U" },
    { title: "Work Permits & Visas", detail: "Streamlined visa-on-arrival, 5-year multiple entry for VIFC-registered employees", icon: "V" },
    { title: "Foreign Ownership", detail: "100% foreign ownership permitted for most financial services activities", icon: "F" },
    { title: "Currency & FX", detail: "Free foreign exchange transactions within VIFC zone, relaxed capital controls", icon: "$" },
    { title: "Land & Office", detail: "Preferential land lease rates, modern Grade A office space at $8-15/sqft/year", icon: "B" },
    { title: "Regulatory Sandbox", detail: "Fast-track sandbox for fintech, blockchain, digital assets, and green finance", icon: "S" },
    { title: "Dispute Resolution", detail: "International arbitration center with English common law option", icon: "J" },
  ];

  const entityTypes = [
    { type: "Banks & Financial Institutions", examples: "Commercial banks, investment banks, securities firms", requirements: "SBV license + VIFC registration" },
    { type: "Fintech Companies", examples: "E-wallets, P2P lending, InsurTech, credit scoring", requirements: "VIFC registration + sandbox (if applicable)" },
    { type: "Blockchain & Digital Assets", examples: "Exchanges, stablecoin issuers, DeFi protocols", requirements: "VIFC sandbox approval required" },
    { type: "Fund Management", examples: "Venture capital, private equity, hedge funds, REITs", requirements: "SSC license + VIFC registration" },
    { type: "Professional Services", examples: "Law firms, accounting, consulting, auditing", requirements: "VIFC registration + professional license" },
    { type: "Insurance", examples: "Life, non-life, reinsurance, InsurTech", requirements: "MOF license + VIFC registration" },
  ];

  const timeline = [
    { step: "1", title: "Pre-Application", duration: "1-2 weeks", desc: "Review eligibility, prepare documentation, initial consultation with VIFC authority" },
    { step: "2", title: "Application Submission", duration: "1 week", desc: "Submit registration via e-Registration portal with required documents" },
    { step: "3", title: "Review & Approval", duration: "2-4 weeks", desc: "VIFC authority reviews application, may request additional information" },
    { step: "4", title: "Registration Certificate", duration: "1-3 days", desc: "Receive VIFC registration certificate and entity number" },
    { step: "5", title: "Operational Setup", duration: "2-4 weeks", desc: "Office setup, bank account opening, staff visa processing, regulatory compliance" },
    { step: "6", title: "Commence Operations", duration: "—", desc: "Begin operations with ongoing compliance reporting to VIFC authority" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12">
        <Badge variant="default" className="mb-4">Vietnam&apos;s First International Financial Centre</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">VIFC Da Nang</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Established by National Assembly Resolution 98/2023, the Vietnam
          International Financial Centre in Da Nang offers a world-class
          regulatory environment, competitive tax incentives, and a strategic
          gateway to ASEAN&apos;s 680 million consumers.
        </p>
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">2024</div><div className="text-xs text-muted-foreground">Established</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">Da Nang</div><div className="text-xs text-muted-foreground">Location</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">0-10%</div><div className="text-xs text-muted-foreground">Corporate Tax</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">100%</div><div className="text-xs text-muted-foreground">Foreign Ownership</div></CardContent></Card>
      </div>

      {/* Incentives */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Incentive Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {incentives.map((inc) => (
            <Card key={inc.title}>
              <CardHeader className="pb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary text-sm font-bold mb-2">
                  {inc.icon}
                </div>
                <CardTitle className="text-sm">{inc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{inc.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Entity Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Who Can Register?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entityTypes.map((et) => (
            <Card key={et.type}>
              <CardHeader>
                <CardTitle className="text-sm">{et.type}</CardTitle>
                <CardDescription className="text-xs">{et.examples}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-[10px]">{et.requirements}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Registration Timeline */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Registration Process</h2>
        <div className="space-y-4">
          {timeline.map((step) => (
            <div key={step.step} className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {step.step}
              </div>
              <div className="flex-1 border-b pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">{step.duration}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact VIFC Da Nang</CardTitle>
          <CardDescription>Official registration and inquiry channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Phone</p>
              <p className="font-mono">02363.667766</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Email</p>
              <p className="font-mono">ifc@danang.gov.vn</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Website</p>
              <a href="https://vifcdanang.vn" target="_blank" rel="noopener noreferrer" className="font-mono text-primary underline underline-offset-4">vifcdanang.vn</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
