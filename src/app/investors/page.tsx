import { RegistryPage } from "@/components/registry-page";

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
