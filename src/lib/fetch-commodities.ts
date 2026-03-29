// Commodity prices — World Bank Commodity API (free, no key)
// Fetches real-time and historical commodity prices for Vietnam's key exports

export interface CommodityPrice {
  name: string;
  price: number;
  unit: string;
  change30d: number; // percentage change over 30 days
  lastUpdated: string;
}

export interface CommodityData {
  prices: CommodityPrice[];
  mxvStats: {
    dailyVolume: string;
    productsTraded: number;
    connectedExchanges: number;
    tradingAccounts: string;
  };
}

// World Bank commodity price API (Pink Sheet data)
// Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898590
const WB_COMMODITY_URL =
  "https://api.worldbank.org/v2/country/VNM/indicator/";

// Use Yahoo Finance for real-time commodity prices
const COMMODITY_SYMBOLS: Record<string, { symbol: string; unit: string }> = {
  "Robusta Coffee": { symbol: "RC=F", unit: "$/ton" },
  "Arabica Coffee": { symbol: "KC=F", unit: "¢/lb" },
  "Rice (Rough)": { symbol: "ZR=F", unit: "$/cwt" },
  "Rubber": { symbol: "TF=F", unit: "¥/kg" },
  "Sugar (Raw)": { symbol: "SB=F", unit: "¢/lb" },
  "Crude Oil (WTI)": { symbol: "CL=F", unit: "$/bbl" },
  "Crude Oil (Brent)": { symbol: "BZ=F", unit: "$/bbl" },
  "Natural Gas": { symbol: "NG=F", unit: "$/MMBtu" },
  "Copper": { symbol: "HG=F", unit: "$/lb" },
  "Gold": { symbol: "GC=F", unit: "$/oz" },
  "Steel (HRC)": { symbol: "HRC1!", unit: "$/ton" },
  "Corn": { symbol: "ZC=F", unit: "¢/bu" },
  "Soybeans": { symbol: "ZS=F", unit: "¢/bu" },
};

async function fetchYahooPrice(
  symbol: string
): Promise<{ price: number; change30d: number } | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 31 * 24 * 60 * 60;
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${thirtyDaysAgo}&period2=${now}&interval=1d`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result?.indicators?.quote?.[0]?.close) return null;

    const closes: (number | null)[] = result.indicators.quote[0].close;
    const validCloses = closes.filter((c): c is number => c != null && c > 0);
    if (validCloses.length < 2) return null;

    const current = validCloses[validCloses.length - 1];
    const previous = validCloses[0];
    const change30d = ((current - previous) / previous) * 100;

    return {
      price: Math.round(current * 100) / 100,
      change30d: Math.round(change30d * 10) / 10,
    };
  } catch {
    return null;
  }
}

export async function fetchCommodityPrices(): Promise<CommodityPrice[]> {
  const entries = Object.entries(COMMODITY_SYMBOLS);
  const results = await Promise.all(
    entries.map(async ([name, { symbol, unit }]) => {
      const data = await fetchYahooPrice(symbol);
      if (!data) return null;
      return {
        name,
        price: data.price,
        unit,
        change30d: data.change30d,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    })
  );

  return results.filter((r): r is CommodityPrice => r != null);
}

// Vietnam commodity export data from World Bank
const EXPORT_INDICATORS = {
  totalExports: "NE.EXP.GNFS.CD", // Exports of goods and services (current US$)
  agriExports: "TX.VAL.AGRI.ZS.UN", // Agricultural raw materials exports (% of merch)
};

export interface VietnamExportData {
  year: string;
  totalExportsBn: number;
  agriExportPct: number;
}

export async function fetchExportData(): Promise<VietnamExportData[]> {
  const endYear = new Date().getFullYear();
  const startYear = endYear - 5;

  try {
    const [totalRes, agriRes] = await Promise.all([
      fetch(
        `https://api.worldbank.org/v2/country/VNM/indicator/${EXPORT_INDICATORS.totalExports}?date=${startYear}:${endYear}&format=json&per_page=10`,
        { next: { revalidate: 86400 } }
      ),
      fetch(
        `https://api.worldbank.org/v2/country/VNM/indicator/${EXPORT_INDICATORS.agriExports}?date=${startYear}:${endYear}&format=json&per_page=10`,
        { next: { revalidate: 86400 } }
      ),
    ]);

    const totalData = await totalRes.json();
    const agriData = await agriRes.json();

    const totalMap = new Map<string, number>();
    const agriMap = new Map<string, number>();

    if (Array.isArray(totalData) && totalData[1]) {
      for (const d of totalData[1]) {
        if (d.value != null) totalMap.set(d.date, d.value / 1e9);
      }
    }
    if (Array.isArray(agriData) && agriData[1]) {
      for (const d of agriData[1]) {
        if (d.value != null) agriMap.set(d.date, d.value);
      }
    }

    const years = Array.from(
      new Set([...totalMap.keys(), ...agriMap.keys()])
    ).sort();
    return years.map((year) => ({
      year,
      totalExportsBn: Math.round((totalMap.get(year) || 0) * 10) / 10,
      agriExportPct: Math.round((agriMap.get(year) || 0) * 10) / 10,
    }));
  } catch {
    return [];
  }
}
