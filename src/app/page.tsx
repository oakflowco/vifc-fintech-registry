import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry-page";

export const metadata: Metadata = {
  title: "Vietnam Financial Registry — 300+ Companies, Investors & Banks",
  description:
    "Browse Vietnam's most comprehensive financial registry. 300+ licensed fintech companies, investors, banks, securities firms, and insurance providers. VIFC Da Nang registered entities.",
};

export default function FintechPage() {
  return (
    <RegistryPage
      title="Fintech Registry"
      description="Licensed and registered fintech companies operating in Vietnam"
      sheetUrl={process.env.GOOGLE_SHEET_FINTECH_URL}
      envVarName="GOOGLE_SHEET_FINTECH_URL"
      exportType="fintech"
    />
  );
}
