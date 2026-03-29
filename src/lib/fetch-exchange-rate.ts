// Exchange rate data — free APIs, no key required
// VND/USD and other key currency pairs

export interface ExchangeRate {
  pair: string;
  rate: number;
  change24h: number;
  lastUpdated: string;
}

export interface ExchangeRateData {
  vndPerUsd: number;
  rates: ExchangeRate[];
  lastUpdated: string;
}

// Primary: frankfurter.app (free, ECB data, no key)
// Fallback: exchangerate-api.com (free tier)
export async function fetchExchangeRates(): Promise<ExchangeRateData> {
  const fallback: ExchangeRateData = {
    vndPerUsd: 0,
    rates: [],
    lastUpdated: "",
  };

  try {
    // Fetch current rates
    const [currentRes, yesterdayRes] = await Promise.all([
      fetch("https://api.frankfurter.app/latest?from=USD&to=VND,SGD,JPY,KRW,CNY,THB", {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.frankfurter.app/${getYesterday()}?from=USD&to=VND,SGD,JPY,KRW,CNY,THB`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!currentRes.ok) return fallback;

    const current = await currentRes.json();
    const yesterday = yesterdayRes.ok ? await yesterdayRes.json() : null;

    const pairs: ExchangeRate[] = [];
    const currencies = ["VND", "SGD", "JPY", "KRW", "CNY", "THB"];

    for (const curr of currencies) {
      const rate = current.rates?.[curr];
      if (rate == null) continue;

      const prevRate = yesterday?.rates?.[curr] || rate;
      const change = ((rate - prevRate) / prevRate) * 100;

      pairs.push({
        pair: `USD/${curr}`,
        rate: Math.round(rate * 100) / 100,
        change24h: Math.round(change * 100) / 100,
        lastUpdated: current.date || new Date().toISOString().slice(0, 10),
      });
    }

    return {
      vndPerUsd: current.rates?.VND || 0,
      rates: pairs,
      lastUpdated: current.date || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return fallback;
  }
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  // Skip weekends (no forex data)
  if (d.getDay() === 0) d.setDate(d.getDate() - 2);
  if (d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
