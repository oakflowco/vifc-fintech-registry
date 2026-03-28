// Fetch Vietnam financial market & deal news from Google News RSS

export interface DealNewsItem {
  date: string;
  title: string;
  source: string;
  url: string;
  amount: string | null;
  stage: string | null;
  category: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function extractLink(itemXml: string): string {
  const selfClosing = itemXml.match(/<link\s*\/>\s*(https?:\/\/[^\s<]+)/);
  if (selfClosing) return selfClosing[1].trim();
  const wrapped = itemXml.match(/<link>([\s\S]*?)<\/link>/);
  if (wrapped) return wrapped[1].trim();
  return "";
}

function extractSource(description: string): string {
  const decoded = decodeEntities(description);
  const match = decoded.match(/<font[^>]*>([^<]+)<\/font>/);
  return match ? match[1].trim() : "News";
}

function extractAmount(title: string): string | null {
  const patterns = [
    /\$[\d,.]+\s*[BMbm](?:illion|illion)?/i,
    /US\$[\d,.]+\s*[BMbm](?:illion|illion)?/i,
    /\$[\d,.]+\s*(?:million|billion)/i,
    /\$[\d,.]+[BMbm]\b/i,
  ];
  for (const p of patterns) {
    const match = title.match(p);
    if (match) return match[0];
  }
  return null;
}

function extractStage(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("series a")) return "Series A";
  if (t.includes("series b")) return "Series B";
  if (t.includes("series c")) return "Series C";
  if (t.includes("series d")) return "Series D";
  if (t.includes("series e")) return "Series E";
  if (t.includes("pre-seed")) return "Pre-Seed";
  if (t.includes("seed round") || t.includes("seed funding")) return "Seed";
  if (t.includes("ipo") || t.includes("listing")) return "IPO";
  if (t.includes("acquisition") || t.includes("acquired") || t.includes("acquires")) return "M&A";
  if (t.includes("merger") || t.includes("merge")) return "M&A";
  return null;
}

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("raises") || t.includes("funding") || t.includes("investment") || t.includes("series"))
    return "Funding";
  if (t.includes("ipo") || t.includes("listing") || t.includes("stock") || t.includes("vn-index"))
    return "Capital Markets";
  if (t.includes("acquisition") || t.includes("merger") || t.includes("acquire"))
    return "M&A";
  if (t.includes("crypto") || t.includes("blockchain") || t.includes("bitcoin") || t.includes("digital asset"))
    return "Crypto";
  if (t.includes("bank") || t.includes("lending") || t.includes("credit"))
    return "Banking";
  if (t.includes("payment") || t.includes("wallet") || t.includes("fintech"))
    return "Fintech";
  if (t.includes("regulation") || t.includes("law") || t.includes("decree") || t.includes("license"))
    return "Regulation";
  return "Market";
}

function isFinancialRelevant(title: string): boolean {
  const t = title.toLowerCase();
  const keywords = [
    "fintech", "startup", "funding", "raises", "investment", "venture",
    "series a", "series b", "series c", "seed", "ipo", "acquisition",
    "merger", "bank", "payment", "wallet", "crypto", "blockchain",
    "finance", "capital", "stock", "market", "vn-index", "fdi",
    "lending", "insurance", "securities", "digital", "vifc",
    "financial", "money", "fund", "investor", "billion", "million",
  ];
  return keywords.some((kw) => t.includes(kw));
}

async function fetchRSS(query: string): Promise<DealNewsItem[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en&gl=VN&ceid=VN:en`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: DealNewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const item = match[1];
      const title = stripHtml(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
      const link = extractLink(item);
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      const source = extractSource(description);

      const date = pubDate
        ? new Date(pubDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";

      if (title && date && isFinancialRelevant(title)) {
        items.push({
          date,
          title,
          source,
          url: link,
          amount: extractAmount(title),
          stage: extractStage(title),
          category: categorize(title),
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}

export async function fetchDealNews(): Promise<DealNewsItem[]> {
  const queries = [
    "Vietnam fintech",
    "Vietnam startup funding",
    "Vietnam financial market",
    "Vietnam bank digital",
    "Vietnam investment capital",
    "Vietnam crypto blockchain",
    "Vietnam IPO stock market",
  ];

  const results = await Promise.all(queries.map(fetchRSS));

  // Merge and deduplicate
  const seen = new Set<string>();
  const all: DealNewsItem[] = [];

  for (const items of results) {
    for (const item of items) {
      const key = item.title.toLowerCase().slice(0, 60);
      if (!seen.has(key)) {
        seen.add(key);
        all.push(item);
      }
    }
  }

  return all
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);
}
