import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry-page";

export const metadata: Metadata = {
  title: "Vietnam Banks & Financial Members Registry",
  description:
    "Complete list of banks, financial institutions, and VIFC members operating in Vietnam's banking sector.",
};

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
