import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry-page";

export const metadata: Metadata = {
  title: "Vietnam Fintech Registry — 300+ Companies, Investors & Banks",
  description:
    "Browse Vietnam's most comprehensive fintech database. 300+ licensed companies, investors, banks, securities firms, and insurance providers registered with VIFC Da Nang.",
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
