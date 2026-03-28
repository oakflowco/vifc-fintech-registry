// World Bank API — free, no key required
// Indicators: GDP growth, FDI, inflation, population, internet users

interface WBDataPoint {
  date: string;
  value: number | null;
}

interface WBResponse {
  [1]: WBDataPoint[];
}

const INDICATORS = {
  gdpGrowth: "NY.GDP.MKTP.KD.ZG", // GDP growth (annual %)
  fdi: "BX.KLT.DINV.CD.WD", // FDI net inflows (current USD)
  inflation: "FP.CPI.TOTL.ZG", // Inflation (CPI annual %)
  population: "SP.POP.TOTL", // Total population
  internetUsers: "IT.NET.USER.ZS", // Internet users (% of population)
  gdpCurrent: "NY.GDP.MKTP.CD", // GDP current USD
};

async function fetchIndicator(
  indicator: string,
  startYear: number,
  endYear: number
): Promise<WBDataPoint[]> {
  const url = `https://api.worldbank.org/v2/country/VNM/indicator/${indicator}?date=${startYear}:${endYear}&format=json&per_page=50`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return [];
  return (data as unknown as WBResponse)[1] || [];
}

export interface MacroYear {
  year: string;
  gdpGrowth: number;
  fdi: number; // in billions USD
  inflation: number;
  population: number; // in millions
  internetPenetration: number;
  gdpBillions: number;
}

export async function fetchMacroData(): Promise<MacroYear[]> {
  const endYear = new Date().getFullYear();
  const startYear = endYear - 8;

  const [gdpGrowth, fdi, inflation, population, internet, gdpCurrent] =
    await Promise.all([
      fetchIndicator(INDICATORS.gdpGrowth, startYear, endYear),
      fetchIndicator(INDICATORS.fdi, startYear, endYear),
      fetchIndicator(INDICATORS.inflation, startYear, endYear),
      fetchIndicator(INDICATORS.population, startYear, endYear),
      fetchIndicator(INDICATORS.internetUsers, startYear, endYear),
      fetchIndicator(INDICATORS.gdpCurrent, startYear, endYear),
    ]);

  const byYear = new Map<string, Partial<MacroYear>>();

  for (const d of gdpGrowth) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.gdpGrowth = Math.round(d.value * 10) / 10;
      byYear.set(d.date, entry);
    }
  }
  for (const d of fdi) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.fdi = Math.round(d.value / 1e9 * 10) / 10;
      byYear.set(d.date, entry);
    }
  }
  for (const d of inflation) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.inflation = Math.round(d.value * 10) / 10;
      byYear.set(d.date, entry);
    }
  }
  for (const d of population) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.population = Math.round(d.value / 1e6 * 10) / 10;
      byYear.set(d.date, entry);
    }
  }
  for (const d of internet) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.internetPenetration = Math.round(d.value * 10) / 10;
      byYear.set(d.date, entry);
    }
  }
  for (const d of gdpCurrent) {
    if (d.value != null) {
      const entry = byYear.get(d.date) || { year: d.date };
      entry.gdpBillions = Math.round(d.value / 1e9 * 10) / 10;
      byYear.set(d.date, entry);
    }
  }

  // World Bank data lags 1-2 years. Fill recent gaps with official
  // government/IMF estimates so the dashboard stays current.
  const ESTIMATES: Record<string, MacroYear> = {
    "2025": {
      year: "2025*",
      gdpGrowth: 6.5,       // Vietnam govt target / IMF projection
      fdi: 22.4,            // MPI preliminary (Jan-Dec registered)
      inflation: 3.8,       // SBV target ≤4.5%, IMF est ~3.8%
      population: 101.6,    // GSO projection
      internetPenetration: 86.0, // VNNIC estimate
      gdpBillions: 506.0,   // IMF WEO Oct 2024 projection
    },
  };

  const result = Array.from(byYear.values())
    .filter((d) => d.year && d.gdpGrowth != null)
    .map((d) => ({
      year: d.year!,
      gdpGrowth: d.gdpGrowth ?? 0,
      fdi: d.fdi ?? 0,
      inflation: d.inflation ?? 0,
      population: d.population ?? 0,
      internetPenetration: d.internetPenetration ?? 0,
      gdpBillions: d.gdpBillions ?? 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Append estimate rows for years the API hasn't published yet
  const latestYear = result.length > 0 ? result[result.length - 1].year : "";
  for (const [year, est] of Object.entries(ESTIMATES)) {
    if (year > latestYear) {
      result.push(est);
    }
  }

  return result;
}
