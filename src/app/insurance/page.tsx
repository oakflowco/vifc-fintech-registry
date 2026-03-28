import { RegistryPage } from "@/components/registry-page";

export default function InsurancePage() {
  return (
    <RegistryPage
      title="Insurance Companies"
      description="Licensed insurance, reinsurance, and InsurTech companies operating in Vietnam"
      sheetUrl={process.env.GOOGLE_SHEET_INSURANCE_URL}
      envVarName="GOOGLE_SHEET_INSURANCE_URL"
      exportType="insurance"
    />
  );
}
