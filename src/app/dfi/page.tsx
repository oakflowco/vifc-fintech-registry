import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DFIPage() {
  const institutions = [
    {
      name: "World Bank Group — IFC",
      type: "Multilateral DFI",
      role: "Private sector investment & advisory in emerging markets",
      vietnamPortfolio: "$2.5B+ committed",
      focusAreas: ["Banking & financial sector reform", "Infrastructure (power, transport)", "Climate finance & green bonds", "SME lending programs", "Capital market development"],
      website: "ifc.org",
      keyProjects: "Backed VPBank, Techcombank, VIB. Funded Mekong Delta climate resilience. Supporting FTSE upgrade preparation.",
    },
    {
      name: "Asian Development Bank (ADB)",
      type: "Multilateral DFI",
      role: "Sovereign & non-sovereign lending for development in Asia-Pacific",
      vietnamPortfolio: "$22B+ cumulative",
      focusAreas: ["Infrastructure (roads, power, water)", "Climate change adaptation", "Financial sector development", "Urban development", "Health & education"],
      website: "adb.org",
      keyProjects: "Ho Chi Minh City metro line, Mekong Delta flood management, national power grid expansion, financial inclusion programs.",
    },
    {
      name: "Japan International Cooperation Agency (JICA)",
      type: "Bilateral DFI (Japan)",
      role: "ODA loans, technical cooperation, grant aid",
      vietnamPortfolio: "$30B+ cumulative ODA",
      focusAreas: ["Infrastructure (Noi Bai–Lao Cai highway, metro)", "Industrial zone development", "JCM carbon credits (Joint Credit Mechanism)", "Technology transfer", "Human resource development"],
      website: "jica.go.jp",
      keyProjects: "Largest bilateral donor. Funded Long Thanh Airport, HCMC Metro, Da Nang port. Key partner in JCM carbon credits.",
    },
    {
      name: "Korea Development Finance (EDCF/KOICA)",
      type: "Bilateral DFI (South Korea)",
      role: "Concessional loans and grant aid",
      vietnamPortfolio: "$3B+ cumulative",
      focusAreas: ["Smart city development", "E-government", "Fintech cooperation (KRX system)", "Green growth", "Vocational training"],
      website: "koica.go.kr",
      keyProjects: "KRX trading system for HOSE/HNX. Smart city pilots in Da Nang. Korea-Vietnam fintech cooperation MOU.",
    },
    {
      name: "KfW Development Bank (Germany)",
      type: "Bilateral DFI (Germany)",
      role: "Development financing for climate, energy, and financial systems",
      vietnamPortfolio: "$1.5B+ committed",
      focusAreas: ["Renewable energy (solar, wind)", "Energy efficiency", "Green building finance", "Environmental protection", "Urban infrastructure"],
      website: "kfw-entwicklungsbank.de",
      keyProjects: "Funded Vietnam's largest solar farm financing. Green credit lines through Vietnamese banks.",
    },
    {
      name: "Agence Française de Développement (AFD)",
      type: "Bilateral DFI (France)",
      role: "Sustainable development financing",
      vietnamPortfolio: "$1B+ committed",
      focusAreas: ["Climate finance", "Urban transport", "Water management", "Biodiversity", "Sustainable cities"],
      website: "afd.fr",
      keyProjects: "HCMC metro line 3, Da Nang sustainable urban development, green credit lines for Vietnam banks.",
    },
    {
      name: "International Finance Corporation (IFC — World Bank)",
      type: "Multilateral DFI",
      role: "Private sector arm of World Bank Group",
      vietnamPortfolio: "$2.5B+",
      focusAreas: ["Banking sector reform", "SME finance", "Climate-smart agriculture", "Renewable energy", "Capital markets"],
      website: "ifc.org",
      keyProjects: "Equity investments in VPBank, TPBank, HDBank. Vietnam Manufacturing Competitiveness program. Green bond framework support.",
    },
    {
      name: "European Bank for Reconstruction & Development (EBRD)",
      type: "Multilateral DFI",
      role: "Transition economy investment (expanded to Asia)",
      vietnamPortfolio: "$500M+",
      focusAreas: ["Green economy transition", "Financial institutions", "Infrastructure", "Energy transition", "SME support"],
      website: "ebrd.com",
      keyProjects: "Entered Vietnam 2022. Focus on energy transition and green finance. Credit lines to Vietnamese banks.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Development Finance Institutions</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Multilateral and bilateral development banks providing capital, technical assistance,
          and policy support to Vietnam&apos;s financial ecosystem. Combined portfolio of $60B+ in commitments.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">8+</div><div className="text-xs text-muted-foreground">Major DFIs Active</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">$60B+</div><div className="text-xs text-muted-foreground">Cumulative Commitments</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">Japan</div><div className="text-xs text-muted-foreground">Largest Bilateral Donor</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">ADB</div><div className="text-xs text-muted-foreground">Largest Multilateral</div></CardContent></Card>
      </div>

      {/* DFI Cards */}
      <div className="space-y-4">
        {institutions.map((inst) => (
          <Card key={inst.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{inst.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{inst.role}</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-[10px]">{inst.type}</Badge>
                  <Badge variant="secondary" className="text-[10px] font-mono">{inst.vietnamPortfolio}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{inst.keyProjects}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {inst.focusAreas.map((f) => (
                  <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                ))}
              </div>
              <a href={`https://${inst.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline underline-offset-4">
                {inst.website}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
