// World Bank API — compare Vietnam with ASEAN peers

interface WBDataPoint {
  countryiso3code: string;
  date: string;
  value: number | null;
}

const COUNTRIES = {
  VNM: "Vietnam",
  THA: "Thailand",
  IDN: "Indonesia",
  PHL: "Philippines",
  SGP: "Singapore",
  MYS: "Malaysia",
};

const INDICATORS = {
  gdpGrowth: "NY.GDP.MKTP.KD.ZG",
  gdpCurrent: "NY.GDP.MKTP.CD",
  fdi: "BX.KLT.DINV.CD.WD",
  inflation: "FP.CPI.TOTL.ZG",
  population: "SP.POP.TOTL",
  internet: "IT.NET.USER.ZS",
  mobileSubscriptions: "IT.CEL.SETS.P2",
  gdpPerCapita: "NY.GDP.PCAP.CD",
};

async function fetchMultiCountry(
  indicator: string,
  year: number
): Promise<Record<string, number>> {
  const codes = Object.keys(COUNTRIES).join(";");
  const url = `https://api.worldbank.org/v2/country/${codes}/indicator/${indicator}?date=${year}&format=json&per_page=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return {};
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return {};

    const result: Record<string, number> = {};
    for (const d of (data[1] as WBDataPoint[]) || []) {
      if (d.value != null) {
        result[d.countryiso3code] = d.value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export interface ASEANCountryData {
  code: string;
  name: string;
  gdpGrowth: number;
  gdpBillions: number;
  gdpPerCapita: number;
  fdi: number;
  inflation: number;
  population: number;
  internet: number;
  mobile: number;
}

export async function fetchASEANComparison(): Promise<ASEANCountryData[]> {
  const year = new Date().getFullYear() - 1; // latest full year
  const prevYear = year - 1;

  // Try latest year first, fall back to previous
  const tryFetch = async (y: number) => {
    const [gdpGrowth, gdpCurrent, fdi, inflation, pop, internet, mobile, gdpPC] =
      await Promise.all([
        fetchMultiCountry(INDICATORS.gdpGrowth, y),
        fetchMultiCountry(INDICATORS.gdpCurrent, y),
        fetchMultiCountry(INDICATORS.fdi, y),
        fetchMultiCountry(INDICATORS.inflation, y),
        fetchMultiCountry(INDICATORS.population, y),
        fetchMultiCountry(INDICATORS.internet, y),
        fetchMultiCountry(INDICATORS.mobileSubscriptions, y),
        fetchMultiCountry(INDICATORS.gdpPerCapita, y),
      ]);
    return { gdpGrowth, gdpCurrent, fdi, inflation, pop, internet, mobile, gdpPC };
  };

  let d = await tryFetch(year);
  // If most data missing, try previous year
  if (Object.keys(d.gdpGrowth).length < 3) {
    d = await tryFetch(prevYear);
  }

  return Object.entries(COUNTRIES).map(([code, name]) => ({
    code,
    name,
    gdpGrowth: Math.round((d.gdpGrowth[code] ?? 0) * 10) / 10,
    gdpBillions: Math.round((d.gdpCurrent[code] ?? 0) / 1e9),
    gdpPerCapita: Math.round(d.gdpPC[code] ?? 0),
    fdi: Math.round((d.fdi[code] ?? 0) / 1e9 * 10) / 10,
    inflation: Math.round((d.inflation[code] ?? 0) * 10) / 10,
    population: Math.round((d.pop[code] ?? 0) / 1e6 * 10) / 10,
    internet: Math.round((d.internet[code] ?? 0) * 10) / 10,
    mobile: Math.round(d.mobile[code] ?? 0),
  }));
}

export { COUNTRIES };
