// World Bank API — Vietnam banking & financial depth indicators

interface WBDataPoint {
  date: string;
  value: number | null;
}

const BANKING_INDICATORS = {
  domesticCredit: "FS.AST.DOMS.GD.ZS",      // Domestic credit to private sector (% of GDP)
  bankNPL: "FB.AST.NPER.ZS",                  // Bank nonperforming loans (% of total)
  accountOwnership: "FX.OWN.TOTL.ZS",         // Account ownership (% of population 15+)
  broadMoney: "FM.LBL.BMNY.GD.ZS",           // Broad money (% of GDP)
  bankCapital: "FB.BNK.CAPA.ZS",             // Bank capital to assets ratio (%)
  debtGDP: "GC.DOD.TOTL.GD.ZS",              // Central government debt (% of GDP)
  reserves: "FI.RES.TOTL.CD",                 // Total reserves (current USD)
  tradeBalance: "NE.RSB.GNFS.CD",             // External balance on goods & services (current USD)
  exportsGDP: "NE.EXP.GNFS.ZS",              // Exports of goods and services (% of GDP)
  importsGDP: "NE.IMP.GNFS.ZS",              // Imports of goods and services (% of GDP)
};

async function fetchIndicator(
  indicator: string,
  startYear: number,
  endYear: number
): Promise<WBDataPoint[]> {
  const url = `https://api.worldbank.org/v2/country/VNM/indicator/${indicator}?date=${startYear}:${endYear}&format=json&per_page=50`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return [];
    return (data[1] as WBDataPoint[]) || [];
  } catch {
    return [];
  }
}

export interface BankingData {
  year: string;
  domesticCredit: number;   // % of GDP
  bankNPL: number;          // %
  accountOwnership: number; // % of pop 15+
  broadMoney: number;       // % of GDP
  bankCapital: number;      // %
  debtGDP: number;          // %
  reservesBillions: number; // USD B
  tradeBalanceBillions: number; // USD B
  exportsGDP: number;       // %
  importsGDP: number;       // %
}

export async function fetchBankingData(): Promise<BankingData[]> {
  const endYear = new Date().getFullYear();
  const startYear = endYear - 10;

  const results = await Promise.all(
    Object.values(BANKING_INDICATORS).map((ind) =>
      fetchIndicator(ind, startYear, endYear)
    )
  );

  const keys = Object.keys(BANKING_INDICATORS) as (keyof typeof BANKING_INDICATORS)[];
  const byYear = new Map<string, Partial<BankingData>>();

  keys.forEach((key, i) => {
    for (const d of results[i]) {
      if (d.value != null) {
        const entry = byYear.get(d.date) || { year: d.date };
        switch (key) {
          case "domesticCredit": entry.domesticCredit = Math.round(d.value * 10) / 10; break;
          case "bankNPL": entry.bankNPL = Math.round(d.value * 100) / 100; break;
          case "accountOwnership": entry.accountOwnership = Math.round(d.value * 10) / 10; break;
          case "broadMoney": entry.broadMoney = Math.round(d.value * 10) / 10; break;
          case "bankCapital": entry.bankCapital = Math.round(d.value * 100) / 100; break;
          case "debtGDP": entry.debtGDP = Math.round(d.value * 10) / 10; break;
          case "reserves": entry.reservesBillions = Math.round(d.value / 1e9 * 10) / 10; break;
          case "tradeBalance": entry.tradeBalanceBillions = Math.round(d.value / 1e9 * 10) / 10; break;
          case "exportsGDP": entry.exportsGDP = Math.round(d.value * 10) / 10; break;
          case "importsGDP": entry.importsGDP = Math.round(d.value * 10) / 10; break;
        }
        byYear.set(d.date, entry);
      }
    }
  });

  return Array.from(byYear.values())
    .filter((d) => d.year)
    .map((d) => ({
      year: d.year!,
      domesticCredit: d.domesticCredit ?? 0,
      bankNPL: d.bankNPL ?? 0,
      accountOwnership: d.accountOwnership ?? 0,
      broadMoney: d.broadMoney ?? 0,
      bankCapital: d.bankCapital ?? 0,
      debtGDP: d.debtGDP ?? 0,
      reservesBillions: d.reservesBillions ?? 0,
      tradeBalanceBillions: d.tradeBalanceBillions ?? 0,
      exportsGDP: d.exportsGDP ?? 0,
      importsGDP: d.importsGDP ?? 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}
