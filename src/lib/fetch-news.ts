// Fetch fintech & IFC news from Google News RSS (free, no key)

export interface NewsItem {
  date: string;
  title: string;
  summary: string;
  url: string;
  source: string;
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

function extractSource(html: string): string {
  const decoded = decodeEntities(html);
  const match = decoded.match(/<font[^>]*>([^<]+)<\/font>/);
  return match ? match[1].trim() : "News";
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function extractLink(itemXml: string): string {
  // Google News RSS has <link/> followed by the URL, or <link>URL</link>
  // Format 1: <link/>https://...
  const selfClosing = itemXml.match(/<link\s*\/>\s*(https?:\/\/[^\s<]+)/);
  if (selfClosing) return selfClosing[1].trim();

  // Format 2: <link>https://...</link>
  const wrapped = itemXml.match(/<link>([\s\S]*?)<\/link>/);
  if (wrapped) return wrapped[1].trim();

  return "";
}

function extractRealUrl(googleUrl: string): string {
  // Google News URLs redirect — extract the original URL if encoded in the path
  // Some formats encode the real URL in base64, which we can't easily decode
  // Just return the Google News URL — it will redirect when clicked
  return googleUrl;
}

function categorizeNews(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("vifc") || t.includes("financial centre") || t.includes("financial center"))
    return "VIFC";
  if (t.includes("regulation") || t.includes("decree") || t.includes("sandbox") || t.includes("sbv") || t.includes("law"))
    return "Regulation";
  if (t.includes("crypto") || t.includes("blockchain") || t.includes("bitcoin") || t.includes("digital asset"))
    return "Crypto";
  if (t.includes("payment") || t.includes("wallet") || t.includes("momo") || t.includes("vnpay"))
    return "Payments";
  if (t.includes("invest") || t.includes("fund") || t.includes("vc") || t.includes("startup"))
    return "Investment";
  if (t.includes("stock") || t.includes("vn-index") || t.includes("ipo") || t.includes("market cap"))
    return "Capital Markets";
  return "Fintech";
}

async function fetchRSS(query: string): Promise<NewsItem[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en&gl=VN&ceid=VN:en`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const item = match[1];
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = extractLink(item);
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const description =
        item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";

      const cleanTitle = stripHtml(title);
      const source = extractSource(description);
      const cleanSummary = stripHtml(description)
        .replace(source, "")
        .trim()
        .slice(0, 200);

      const date = pubDate
        ? new Date(pubDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";

      if (cleanTitle && date) {
        items.push({
          date,
          title: cleanTitle,
          summary: cleanSummary || cleanTitle,
          url: extractRealUrl(link),
          source,
          category: categorizeNews(cleanTitle),
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}

export async function fetchFintechNews(): Promise<NewsItem[]> {
  const [fintech, vifc, crypto] = await Promise.all([
    fetchRSS("Vietnam fintech"),
    fetchRSS("Vietnam international financial centre"),
    fetchRSS("Vietnam crypto blockchain regulation"),
  ]);

  // Merge and deduplicate by title
  const seen = new Set<string>();
  const all: NewsItem[] = [];

  for (const item of [...vifc, ...fintech, ...crypto]) {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      all.push(item);
    }
  }

  // Sort by date descending, limit to 12
  return all
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12);
}
