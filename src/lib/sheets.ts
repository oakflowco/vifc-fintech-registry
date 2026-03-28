export interface RegistryEntry {
  [key: string]: string;
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (inQuotes) {
      if (char === '"' && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && csv[i + 1] === "\n")) {
        row.push(current.trim());
        if (row.some((cell) => cell !== "")) rows.push(row);
        row = [];
        current = "";
        if (char === "\r") i++;
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

export async function fetchSheetData(
  sheetUrl: string
): Promise<{ headers: string[]; data: RegistryEntry[] }> {
  const res = await fetch(sheetUrl, { next: { revalidate: 60 } });
  const csv = await res.text();
  const rows = parseCSV(csv);

  if (rows.length < 2) return { headers: [], data: [] };

  // Clean headers — fix cases where a URL was pasted in the first cell
  const headers = rows[0].map((h) =>
    h.startsWith("http") ? "ID" : h
  );

  const data = rows.slice(1).map((row, i) => {
    const entry: RegistryEntry = {};
    headers.forEach((header, idx) => {
      entry[header] = row[idx] || "";
    });
    if (!entry["ID"] && !entry["id"] && !entry["#"]) {
      entry["#"] = String(i + 1);
    }
    return entry;
  });

  return { headers, data };
}

export function getUniqueValues(
  data: RegistryEntry[],
  field: string
): string[] {
  const values = new Set(data.map((d) => d[field]).filter(Boolean));
  return Array.from(values).sort();
}
