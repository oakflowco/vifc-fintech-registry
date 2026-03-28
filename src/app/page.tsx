import { RegistryPage } from "@/components/registry-page";

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
