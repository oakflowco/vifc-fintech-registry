import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VIFC Database — Vietnam Financial Registry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f1117",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "#4B7BF5",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          VIFC
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          VIFC Database
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Vietnam Financial Registry & Market Intelligence
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            fontSize: 16,
            color: "#6b7280",
          }}
        >
          <span>300+ Companies</span>
          <span>•</span>
          <span>Live Market Data</span>
          <span>•</span>
          <span>VIFC Da Nang</span>
          <span>•</span>
          <span>ASEAN Comparison</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
