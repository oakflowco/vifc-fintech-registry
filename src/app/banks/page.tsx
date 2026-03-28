import { RegistryPage } from "@/components/registry-page";

export default function BanksPage() {
  return (
    <RegistryPage
      title="Banks & Members"
      description="Banks and financial institutions that are members of IFC Vietnam"
      sheetUrl={process.env.GOOGLE_SHEET_BANKS_URL}
      envVarName="GOOGLE_SHEET_BANKS_URL"
      exportType="banks"
    />
  );
}
