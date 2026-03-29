import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry-page";

export const metadata: Metadata = {
  title: "Vietnam Digital Banks & Neobanks",
  description:
    "Digital-only banks and neobank platforms emerging in Vietnam's financial ecosystem.",
};

export default function NeobanksPage() {
  return (
    <RegistryPage
      title="Digital Banks & Neobanks"
      description="Digital banking platforms, neobanks, and mobile-first banking apps in Vietnam. First standalone digital bank licenses expected Q3 2025."
      sheetUrl={process.env.GOOGLE_SHEET_NEOBANKS_URL}
      envVarName="GOOGLE_SHEET_NEOBANKS_URL"
      exportType="neobanks"
    />
  );
}
