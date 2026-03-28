import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";
import { fetchMacroData } from "@/lib/fetch-world-bank";
import { fetchVNIndex, summarizeByYear } from "@/lib/fetch-stock";
import { IndicatorDetail } from "@/components/indicator-detail";

export const revalidate = 3600;

const INDICATORS: Record<
  string,
  { title: string; description: string; dataKey: string; unit: string; source: string }
> = {
  gdp: {
    title: "Gross Domestic Product (GDP)",
    description:
      "Vietnam's GDP measures the total economic output. The country has been one of the fastest-growing economies in Southeast Asia, driven by manufacturing, exports, and a young workforce.",
    dataKey: "gdpBillions",
    unit: "$B",
    source: "World Bank Open Data",
  },
  fdi: {
    title: "Foreign Direct Investment (FDI)",
    description:
      "FDI inflows reflect international investor confidence. Vietnam attracts significant FDI in manufacturing, technology, and increasingly in fintech and financial services, especially with the establishment of VIFC Da Nang.",
    dataKey: "fdi",
    unit: "$B",
    source: "World Bank Open Data",
  },
  "vn-index": {
    title: "VN-Index (Ho Chi Minh Stock Exchange)",
    description:
      "The VN-Index is the benchmark stock market index for Vietnam, tracking all companies listed on the Ho Chi Minh Stock Exchange (HOSE). Vietnam is on track for a potential upgrade from frontier to emerging market status by FTSE Russell.",
    dataKey: "vnIndex",
    unit: "points",
    source: "Yahoo Finance",
  },
  population: {
    title: "Population",
    description:
      "Vietnam's population of ~100 million makes it the 15th most populous country globally. A young demographic (median age ~31) and rapid urbanization drive consumer demand and digital adoption.",
    dataKey: "population",
    unit: "M",
    source: "World Bank Open Data",
  },
  internet: {
    title: "Internet Penetration",
    description:
      "Vietnam has one of the highest internet penetration rates in Southeast Asia. High smartphone adoption and affordable mobile data have fueled the growth of digital payments, e-commerce, and fintech services.",
    dataKey: "internetPenetration",
    unit: "%",
    source: "World Bank Open Data",
  },
  inflation: {
    title: "Consumer Price Inflation (CPI)",
    description:
      "Vietnam has maintained relatively stable inflation, generally kept within the State Bank of Vietnam's target of 4%. This stability supports long-term investment planning and currency confidence.",
    dataKey: "inflation",
    unit: "%",
    source: "World Bank Open Data",
  },
};

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ indicator: string }>;
}) {
  const { indicator } = await params;
  const config = INDICATORS[indicator];
  if (!config) notFound();

  // Auth check
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;
  if (!user || !hasActiveSubscription(user)) {
    redirect("/trends");
  }

  // Fetch data
  if (indicator === "vn-index") {
    const monthlyData = await fetchVNIndex();
    const yearlyData = summarizeByYear(monthlyData);

    const tableData = yearlyData.map((y) => ({
      year: y.year,
      value: y.yearEnd,
      high: y.yearHigh,
      low: y.yearLow,
      volume: y.avgVolume,
    }));

    return (
      <IndicatorDetail
        title={config.title}
        description={config.description}
        source={config.source}
        unit={config.unit}
        chartData={monthlyData.map((d) => ({ label: d.date, value: d.close }))}
        tableData={tableData}
        tableColumns={[
          { key: "year", label: "Year" },
          { key: "value", label: "Year End" },
          { key: "high", label: "Year High" },
          { key: "low", label: "Year Low" },
          { key: "volume", label: "Avg Volume (M)" },
        ]}
        chartLabel="VN-Index"
      />
    );
  }

  // World Bank indicators
  const macroData = await fetchMacroData();
  const dataKey = config.dataKey as keyof (typeof macroData)[0];

  const chartData = macroData.map((d) => ({
    label: d.year,
    value: Number(d[dataKey]) || 0,
  }));

  const tableData = macroData.map((d) => {
    const row: Record<string, string | number> = { year: d.year };
    row.value = d[dataKey] ?? 0;
    row.gdpGrowth = d.gdpGrowth;
    row.fdi = d.fdi;
    row.inflation = d.inflation;
    row.population = d.population;
    row.internet = d.internetPenetration;
    row.gdp = d.gdpBillions;
    return row;
  });

  const allColumns = [
    { key: "year", label: "Year" },
    { key: "gdp", label: "GDP ($B)" },
    { key: "gdpGrowth", label: "GDP Growth (%)" },
    { key: "fdi", label: "FDI ($B)" },
    { key: "inflation", label: "Inflation (%)" },
    { key: "population", label: "Population (M)" },
    { key: "internet", label: "Internet (%)" },
  ];

  return (
    <IndicatorDetail
      title={config.title}
      description={config.description}
      source={config.source}
      unit={config.unit}
      chartData={chartData}
      tableData={tableData}
      tableColumns={allColumns}
      chartLabel={config.title.split("(")[0].trim()}
      highlightColumn={config.dataKey === "gdpBillions" ? "gdp" : config.dataKey}
    />
  );
}
