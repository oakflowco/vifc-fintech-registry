// Unified chart color system for dark mode
// All charts should use these values for consistency

// Tooltip & chart container styling
export const CHART_TOOLTIP = {
  backgroundColor: "hsl(240, 6%, 12%)",
  border: "1px solid hsl(240, 4%, 22%)",
  borderRadius: "8px",
  color: "#f0f0f5",
};

// Grid and axis colors — visible but not distracting
export const GRID_STROKE = "hsl(240, 4%, 22%)";
export const AXIS_STROKE = "hsl(240, 2%, 45%)";

// 9-color palette — perceptually distinct on dark backgrounds
// Each color has ~0.70 lightness in OKLCH for readability
export const PALETTE = [
  "hsl(220, 70%, 60%)",  // Blue     — primary data, VN-Index
  "hsl(165, 60%, 50%)",  // Teal     — growth, FDI
  "hsl(280, 55%, 62%)",  // Purple   — secondary metrics
  "hsl(35, 85%, 58%)",   // Amber    — warm accent
  "hsl(350, 60%, 60%)",  // Rose     — Vietnam highlight
  "hsl(190, 65%, 52%)",  // Cyan     — tertiary data
  "hsl(50, 75%, 55%)",   // Gold     — financial data
  "hsl(140, 50%, 50%)",  // Green    — positive / nature
  "hsl(10, 65%, 58%)",   // Coral    — alerts / attention
];

// ASEAN country colors — mnemonic and distinct
export const COUNTRY = {
  VNM: "hsl(350, 60%, 60%)",  // Rose-red — Vietnam flag
  THA: "hsl(220, 70%, 60%)",  // Blue — Thai flag
  IDN: "hsl(10, 65%, 58%)",   // Coral-red — Indonesian flag
  PHL: "hsl(35, 85%, 58%)",   // Amber — Philippine sun
  SGP: "hsl(280, 55%, 62%)",  // Purple — unique identifier
  MYS: "hsl(165, 60%, 50%)",  // Teal — Malaysian flag crescent
} as Record<string, string>;

// Muted version for non-highlighted bars (40% opacity feel)
export const COUNTRY_MUTED = "hsl(220, 15%, 32%)";

// Semantic colors for data indicators
export const POSITIVE = "hsl(155, 60%, 52%)";  // Green — gains, live
export const NEGATIVE = "hsl(0, 65%, 58%)";    // Red — losses
export const WARNING = "hsl(40, 85%, 58%)";    // Amber — PRO, attention
