import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SandboxPage() {
  const sandboxes = [
    {
      name: "SBV Fintech Sandbox",
      authority: "State Bank of Vietnam",
      status: "Active",
      since: "Jul 2025",
      scope: ["Credit scoring", "Open APIs / Open Banking", "P2P lending platforms"],
      excluded: ["Digital asset trading", "Robo-advisory", "InsurTech"],
      legal: "Decree 94/2025/ND-CP",
      participants: "Limited to entities registered in Vietnam",
    },
    {
      name: "VIFC Da Nang Innovation Sandbox",
      authority: "VIFC Da Nang Authority",
      status: "Active",
      since: "Mar 2025",
      scope: ["Fintech", "Blockchain & digital assets", "Green finance", "Cross-border payments", "Stablecoin pilots", "DeFi protocols"],
      excluded: [],
      legal: "Resolution 222/2025/QH15, Article 24",
      participants: "Domestic and international entities",
    },
    {
      name: "Crypto Asset Pilot",
      authority: "National Assembly / Government",
      status: "Active",
      since: "Late 2025",
      scope: ["Licensed crypto exchanges", "Digital asset issuance", "Crypto custody", "Stablecoin operations"],
      excluded: [],
      legal: "Resolution 05/2025",
      participants: "Minimum VND 10T (~$380M) capital, foreign ownership capped at 49%",
    },
  ];

  const participants = [
    { name: "Basal Pay (Alphatrue Solutions)", sandbox: "VIFC Da Nang", category: "Crypto Asset Conversion", status: "Active", city: "Da Nang" },
    { name: "MB Bank x Dunamu (Upbit)", sandbox: "Crypto Pilot", category: "Crypto Exchange", status: "Pilot", city: "Hanoi" },
    { name: "Techcombank Digital Assets", sandbox: "Crypto Pilot", category: "Digital Asset Issuance", status: "Pilot", city: "Ho Chi Minh City" },
    { name: "Tima", sandbox: "SBV Fintech", category: "P2P Lending", status: "Active", city: "Hanoi" },
    { name: "Trusting Social", sandbox: "SBV Fintech", category: "Credit Scoring / AI", status: "Active", city: "Ho Chi Minh City" },
    { name: "Robocash Vietnam", sandbox: "SBV Fintech", category: "P2P Lending", status: "Active", city: "Ho Chi Minh City" },
    { name: "Fundiin", sandbox: "SBV Fintech", category: "Buy Now Pay Later", status: "Active", city: "Ho Chi Minh City" },
    { name: "Lendela Vietnam", sandbox: "SBV Fintech", category: "Loan Marketplace", status: "Active", city: "Ho Chi Minh City" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Regulatory Sandboxes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vietnam&apos;s regulatory sandbox programs for fintech, blockchain, and digital asset innovation
        </p>
      </div>

      {/* Sandbox Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {sandboxes.map((sb) => (
          <Card key={sb.name}>
            <CardHeader>
              <div className="flex items-center justify-between mb-1">
                <Badge variant={sb.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                  {sb.status}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">Since {sb.since}</span>
              </div>
              <CardTitle className="text-base">{sb.name}</CardTitle>
              <CardDescription className="text-xs">{sb.authority}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Permitted Activities:</p>
                <div className="flex flex-wrap gap-1">
                  {sb.scope.map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>
              {sb.excluded.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Excluded:</p>
                  <div className="flex flex-wrap gap-1">
                    {sb.excluded.map((s) => (
                      <Badge key={s} variant="destructive" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Legal basis:</span> {sb.legal}</p>
                <p><span className="font-medium">Eligibility:</span> {sb.participants}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Related Links & Official Resources */}
      <div className="mb-12">
        <h2 className="text-xl font-bold tracking-tight mb-4">Related Links & Official Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Decree 94/2025/ND-CP — SBV Fintech Sandbox",
              url: "https://thuvienphapluat.vn/van-ban/Tien-te-Ngan-hang/Nghi-dinh-94-2025-co-che-thu-nghiem-co-kiem-soat-cong-nghe-tai-chinh-fintech-lam-moi",
              source: "Government",
              description: "Full text of the decree establishing the controlled fintech sandbox under the State Bank of Vietnam",
            },
            {
              title: "Resolution 222/2025/QH15 — VIFC Da Nang",
              url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Nghi-quyet-222-2025-QH15",
              source: "National Assembly",
              description: "Legal framework for VIFC Da Nang including the innovation sandbox (Article 24) and special financial zone incentives",
            },
            {
              title: "Resolution 05/2025 — Crypto Asset Pilot",
              url: "https://thuvienphapluat.vn/van-ban/Cong-nghe-thong-tin/Nghi-quyet-05-2025",
              source: "Government",
              description: "Resolution authorizing the pilot program for crypto exchanges, digital asset issuance, and custody services",
            },
            {
              title: "State Bank of Vietnam — Fintech Division",
              url: "https://www.sbv.gov.vn",
              source: "SBV",
              description: "Central bank portal for fintech licensing circulars, sandbox applications, and compliance guidelines",
            },
            {
              title: "VIFC Da Nang Authority",
              url: "https://danang.gov.vn/vifc",
              source: "VIFC",
              description: "Official VIFC portal for entity registration, sandbox applications, and regulatory updates",
            },
            {
              title: "MAS Fintech Regulatory Sandbox",
              url: "https://www.mas.gov.sg/development/fintech/regulatory-sandbox",
              source: "Singapore (Reference)",
              description: "Singapore's sandbox model — a key reference for Vietnam's sandbox design and ASEAN regulatory alignment",
            },
            {
              title: "ASEAN Financial Innovation Network (AFIN)",
              url: "https://www.afin.tech",
              source: "ASEAN",
              description: "Cross-border fintech sandbox and API exchange facilitating multi-market testing across ASEAN member states",
            },
            {
              title: "Vietnam Ministry of Finance — Fintech Policy",
              url: "https://www.mof.gov.vn",
              source: "MOF",
              description: "Ministry of Finance portal for securities sandbox policy, digital asset taxation, and InsurTech regulation",
            },
            {
              title: "SSC — Securities Sandbox Guidelines",
              url: "https://www.ssc.gov.vn",
              source: "SSC",
              description: "State Securities Commission guidelines for tokenized securities, digital asset exchanges, and blockchain pilots",
            },
          ].map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="text-[10px]">{link.source}</Badge>
                <svg
                  className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Sandbox Participants */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Known Sandbox Participants</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground">Company</th>
                    <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Sandbox</th>
                    <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">City</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{p.name}</td>
                      <td className="py-2.5 px-4"><Badge variant="outline" className="text-[10px]">{p.sandbox}</Badge></td>
                      <td className="py-2.5 px-4 text-muted-foreground">{p.category}</td>
                      <td className="py-2.5 px-4"><Badge variant={p.status === "Active" ? "default" : "secondary"} className="text-[10px]">{p.status}</Badge></td>
                      <td className="py-2.5 px-4 text-muted-foreground">{p.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
