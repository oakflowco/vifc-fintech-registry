// Yahoo Finance — free, no key required
// Fetches VN-Index (^VNINDEX) historical data

export interface StockDataPoint {
  date: string;
  close: number;
  volume: number;
}

// Yahoo delisted ^VNINDEX — use the HOSE VN-Index fund symbol instead,
// with VNM ETF as a fallback (USD-denominated, different scale).
const VN_SYMBOLS = ["0P0000HY8X.VN", "VNM"];

export async function fetchVNIndex(): Promise<StockDataPoint[]> {
  const now = Math.floor(Date.now() / 1000);
  const fiveYearsAgo = now - 5 * 365 * 24 * 60 * 60;

  for (const symbol of VN_SYMBOLS) {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${fiveYearsAgo}&period2=${now}&interval=1mo`;
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result?.timestamp) continue;

      const timestamps: number[] = result.timestamp;
      const closes: (number | null)[] =
        result.indicators?.quote?.[0]?.close || [];
      const volumes: (number | null)[] =
        result.indicators?.quote?.[0]?.volume || [];

      const points = timestamps
        .map((ts, i) => ({
          date: new Date(ts * 1000).toISOString().slice(0, 7),
          close: Math.round(closes[i] ?? 0),
          volume: Math.round((volumes[i] ?? 0) / 1e6),
        }))
        .filter((d) => d.close > 0);

      if (points.length > 0) return points;
    } catch {
      continue;
    }
  }

  return [];
}

// Get yearly summary from monthly data
export interface YearlyStock {
  year: string;
  yearEnd: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
}

export function summarizeByYear(data: StockDataPoint[]): YearlyStock[] {
  const byYear = new Map<
    string,
    { closes: number[]; volumes: number[] }
  >();

  for (const d of data) {
    const year = d.date.slice(0, 4);
    const entry = byYear.get(year) || { closes: [], volumes: [] };
    entry.closes.push(d.close);
    entry.volumes.push(d.volume);
    byYear.set(year, entry);
  }

  return Array.from(byYear.entries())
    .map(([year, { closes, volumes }]) => ({
      year,
      yearEnd: closes[closes.length - 1],
      yearHigh: Math.max(...closes),
      yearLow: Math.min(...closes),
      avgVolume: Math.round(
        volumes.reduce((a, b) => a + b, 0) / volumes.length
      ),
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}
