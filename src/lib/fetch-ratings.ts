// Sovereign credit ratings — fetched from editorial Google Sheet
// Falls back to cached data if sheet not configured

import { fetchSheetData } from "./sheets";

export interface SovereignRating {
  agency: string;
  rating: string;
  outlook: string;
  lastUpdate: string;
}

export async function fetchSovereignRatings(): Promise<SovereignRating[]> {
  try {
    // Use the same base URL + gid pattern as fetch-editorial
    const base = process.env.GOOGLE_SHEET_EDITORIAL_BASE;
    let gids: Record<string, string> = {};
    try {
      gids = JSON.parse(process.env.GOOGLE_SHEET_EDITORIAL_GIDS || "{}");
    } catch { /* ignore */ }

    const gid = gids["ratings"];
    if (base && gid != null) {
      const url = `${base}?gid=${gid}&single=true&output=csv`;
      const { data } = await fetchSheetData(url);
      if (data.length > 0) {
        return data.map((r) => ({
          agency: r["Agency"] || r["agency"] || "",
          rating: r["Rating"] || r["rating"] || "",
          outlook: r["Outlook"] || r["outlook"] || "",
          lastUpdate: r["LastUpdate"] || r["Last Update"] || r["lastUpdate"] || "",
        }));
      }
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback — last known values
  return [
    { agency: "S&P Global", rating: "BB+", outlook: "Stable", lastUpdate: "May 2025" },
    { agency: "Moody's", rating: "Ba2", outlook: "Stable", lastUpdate: "Mar 2025" },
    { agency: "Fitch", rating: "BB+", outlook: "Positive", lastUpdate: "Apr 2025" },
  ];
}
