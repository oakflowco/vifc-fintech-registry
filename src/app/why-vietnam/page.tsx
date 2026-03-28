import { fetchMacroData } from "@/lib/fetch-world-bank";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400; // daily

export default async function WhyVietnamPage() {
  const macro = await fetchMacroData();
  const latest = macro[macro.length - 1];

  const highlights = [
    { stat: `$${latest?.gdpBillions || 430}B`, label: "GDP", sub: `${latest?.gdpGrowth || 6.5}% growth` },
    { stat: `${latest?.population || 100}M`, label: "Population", sub: "Median age ~31" },
    { stat: `$${latest?.fdi || 20}B+`, label: "FDI Inflows", sub: "Top 20 globally" },
    { stat: `${latest?.internetPenetration || 82}%`, label: "Internet Users", sub: "78M+ smartphones" },
    { stat: "312+", label: "Fintech Companies", sub: "7x growth since 2017" },
    { stat: "68M", label: "E-Wallet Users", sub: "3rd in Southeast Asia" },
  ];

  const reasons = [
    {
      title: "Fastest-Growing Economy in ASEAN",
      text: "Vietnam has averaged 6-7% GDP growth over the past decade, outperforming regional peers. The manufacturing sector, fueled by FDI from Samsung, Intel, and Apple suppliers, has transformed the economy. The government targets high-income status by 2045.",
    },
    {
      title: "Young, Digital-Native Population",
      text: "With a median age of 31 and 100+ million people, Vietnam has one of the youngest populations in Asia. Over 78 million smartphone users and 82%+ internet penetration create massive demand for digital financial services.",
    },
    {
      title: "Regulatory Momentum for Fintech",
      text: "The State Bank of Vietnam launched a fintech regulatory sandbox in 2017. In 2024, Resolution 98 established VIFC Da Nang as Vietnam's first international financial centre with special tax, visa, and regulatory incentives. Digital banking licenses are expected in 2025.",
    },
    {
      title: "FTSE Emerging Market Upgrade on Track",
      text: "FTSE Russell has signaled a potential upgrade from frontier to emerging market status by 2026. This could unlock $8B+ in passive fund inflows and dramatically increase institutional investor interest in Vietnamese equities.",
    },
    {
      title: "Strategic Geographic Position",
      text: "Vietnam sits at the crossroads of ASEAN's 680 million consumers. Da Nang, the site of VIFC, is centrally located between Hanoi and Ho Chi Minh City, with an international airport and growing tech ecosystem.",
    },
    {
      title: "Competitive Cost Advantage",
      text: "Operating costs are 40-60% lower than Singapore or Hong Kong. Office space in Da Nang is 1/10th the price of Singapore's CBD. Combined with VIFC's tax incentives (0-10% corporate tax for qualified entities), the value proposition is compelling.",
    },
    {
      title: "ASEAN Payment Integration",
      text: "Vietnam is part of the ASEAN cross-border QR payment interoperability initiative with Thailand, Singapore, Malaysia, and Philippines. This positions Vietnamese fintech companies for regional expansion.",
    },
    {
      title: "Crypto & Blockchain Openness",
      text: "With 21 million crypto holders (20% of population), Vietnam is the #1 country for crypto adoption per capita. The government is building a regulatory framework rather than banning — creating opportunities for compliant blockchain businesses.",
    },
  ];

  const comparisons = [
    { metric: "Corporate Tax (IFC zone)", vietnam: "0-10%", singapore: "17%", dubai: "0-9%", hongkong: "16.5%" },
    { metric: "Office Cost ($/sqft/yr)", vietnam: "$8-15", singapore: "$80-120", dubai: "$40-70", hongkong: "$100-180" },
    { metric: "Setup Time", vietnam: "2-4 weeks", singapore: "1-2 weeks", dubai: "2-4 weeks", hongkong: "1-2 weeks" },
    { metric: "Work Visa", vietnam: "Streamlined (VIFC)", singapore: "EP required", dubai: "Residence visa", hongkong: "Work permit" },
    { metric: "GDP Growth", vietnam: "6.5%+", singapore: "2-3%", dubai: "3-4%", hongkong: "2-3%" },
    { metric: "Median Age", vietnam: "31", singapore: "42", dubai: "33", hongkong: "45" },
    { metric: "Internet Users", vietnam: "82%+", singapore: "96%", dubai: "99%", hongkong: "93%" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">For Investors & Institutions</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Why Vietnam?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The fastest-growing fintech ecosystem in Southeast Asia, backed by
          100M digital-native consumers and a government committed to building
          an international financial centre.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {highlights.map((h) => (
          <Card key={h.label}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{h.stat}</div>
              <div className="text-sm font-medium mt-1">{h.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{h.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reasons */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          8 Reasons to Invest in Vietnam&apos;s Financial Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((r, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  {r.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Vietnam vs. Major Financial Centres
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Metric</th>
                    <th className="text-left py-3 px-4 font-semibold bg-primary/5">Vietnam (VIFC)</th>
                    <th className="text-left py-3 px-4 font-medium">Singapore</th>
                    <th className="text-left py-3 px-4 font-medium">Dubai (DIFC)</th>
                    <th className="text-left py-3 px-4 font-medium">Hong Kong</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{row.metric}</td>
                      <td className="py-3 px-4 font-medium bg-primary/5">{row.vietnam}</td>
                      <td className="py-3 px-4">{row.singapore}</td>
                      <td className="py-3 px-4">{row.dubai}</td>
                      <td className="py-3 px-4">{row.hongkong}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center py-8 border-t">
        <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Browse our registries, explore market trends, or learn about VIFC Da Nang.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/" className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Fintech Registry
          </a>
          <a href="/trends" className="inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium hover:bg-accent">
            Market Trends
          </a>
          <a href="/vifc" className="inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium hover:bg-accent">
            About VIFC Da Nang
          </a>
        </div>
      </div>
    </div>
  );
}
