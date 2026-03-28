import { RegistryPage } from "@/components/registry-page";

export default function SecuritiesPage() {
  return (
    <RegistryPage
      title="Securities Firms"
      description="Licensed securities companies, brokerages, and fund management firms in Vietnam"
      sheetUrl={process.env.GOOGLE_SHEET_SECURITIES_URL}
      envVarName="GOOGLE_SHEET_SECURITIES_URL"
      exportType="securities"
    />
  );
}
