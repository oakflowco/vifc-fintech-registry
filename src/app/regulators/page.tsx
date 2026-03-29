import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Vietnam Financial Regulators & Authorities",
  description:
    "Guide to Vietnam's financial regulatory bodies: SBV, SSC, MOF, and their roles in fintech, banking, and capital markets oversight.",
};

export default function RegulatorsPage() {
  const regulators = [
    {
      name: "State Bank of Vietnam (SBV)",
      nameVi: "Ngân hàng Nhà nước Việt Nam",
      role: "Central bank and primary financial regulator",
      oversees: ["Commercial banks", "E-wallets & payment intermediaries", "P2P lending (sandbox)", "Foreign exchange", "Monetary policy", "Fintech regulatory sandbox"],
      website: "https://www.sbv.gov.vn",
      key: "SBV",
    },
    {
      name: "State Securities Commission (SSC)",
      nameVi: "Ủy ban Chứng khoán Nhà nước",
      role: "Capital markets regulator under Ministry of Finance",
      oversees: ["Stock exchanges (HOSE, HNX, UPCOM)", "Securities firms", "Fund management companies", "Listed companies", "IPO approvals", "Investment funds & REITs"],
      website: "https://www.ssc.gov.vn",
      key: "SSC",
    },
    {
      name: "Ministry of Finance (MOF)",
      nameVi: "Bộ Tài chính",
      role: "Fiscal policy, tax, insurance regulation",
      oversees: ["Insurance companies", "Tax policy & incentives", "Government bonds", "Public finance", "Customs & trade finance", "Accounting & auditing standards"],
      website: "https://www.mof.gov.vn",
      key: "MOF",
    },
    {
      name: "Ministry of Planning & Investment (MPI)",
      nameVi: "Bộ Kế hoạch và Đầu tư",
      role: "FDI policy, business registration, SEZ management",
      oversees: ["Foreign investment licensing", "Business registration", "Special economic zones", "PPP projects", "ODA management", "VIFC policy coordination"],
      website: "https://www.mpi.gov.vn",
      key: "MPI",
    },
    {
      name: "VIFC Da Nang Authority",
      nameVi: "Ban Quản lý TTTCQT Đà Nẵng",
      role: "Manages Vietnam's International Financial Centre",
      oversees: ["VIFC entity registration", "Regulatory sandbox (fintech, blockchain)", "Tax incentive approvals", "Investor services", "International arbitration", "Cross-border payment pilots"],
      website: "https://vifcdanang.vn",
      key: "VIFC",
    },
    {
      name: "Ministry of Information & Communications (MIC)",
      nameVi: "Bộ Thông tin và Truyền thông",
      role: "Digital infrastructure, cybersecurity, data protection",
      oversees: ["Cybersecurity regulations", "Data protection & privacy", "Digital transformation policy", "Telecom licensing", "E-government", "Digital identity (eKYC standards)"],
      website: "https://www.mic.gov.vn",
      key: "MIC",
    },
    {
      name: "Vietnam National Payment Corporation (NAPAS)",
      nameVi: "Công ty CP Thanh toán Quốc gia Việt Nam",
      role: "National payment switching and interbank settlement",
      oversees: ["Interbank payment switching", "ATM/POS network", "QR payment standards", "ASEAN cross-border payments", "Chip card migration", "Real-time gross settlement"],
      website: "https://www.napas.com.vn",
      key: "NAPAS",
    },
    {
      name: "Deposit Insurance of Vietnam (DIV)",
      nameVi: "Bảo hiểm tiền gửi Việt Nam",
      role: "Deposit protection and bank resolution",
      oversees: ["Deposit insurance (up to 125M VND)", "Bank monitoring & early warning", "Bank resolution support", "Depositor protection", "Financial stability reporting"],
      website: "https://www.div.gov.vn",
      key: "DIV",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Regulatory Bodies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Key regulators, authorities, and institutions governing Vietnam&apos;s financial ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regulators.map((reg) => (
          <Card key={reg.key}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{reg.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{reg.nameVi}</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">{reg.key}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{reg.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground mb-2">Oversees:</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {reg.oversees.map((item) => (
                  <Badge key={item} variant="secondary" className="text-[10px]">
                    {item}
                  </Badge>
                ))}
              </div>
              <a
                href={reg.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline underline-offset-4"
              >
                {reg.website.replace("https://", "")}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
