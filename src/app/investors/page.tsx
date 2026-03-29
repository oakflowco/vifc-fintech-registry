import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry-page";

export const metadata: Metadata = {
  title: "Vietnam Investors & Fund Registry",
  description:
    "Directory of active investors, venture capital funds, and private equity firms investing in Vietnam's fintech and financial services sector.",
};

export default function InvestorsPage() {
  return (
    <RegistryPage
      title="Investors"
      description="Registered investors and investment funds operating within VIFC"
      sheetUrl={process.env.GOOGLE_SHEET_INVESTORS_URL}
      envVarName="GOOGLE_SHEET_INVESTORS_URL"
      exportType="investors"
    />
  );
}
