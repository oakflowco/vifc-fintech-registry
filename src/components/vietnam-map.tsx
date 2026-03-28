"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface FinancialHub {
  name: string;
  x: number;
  y: number;
  role: string;
  highlights: string[];
  color: string;
}

// Positions calculated from geoViewBox: 102.14,23.39 → 109.46,8.56
// SVG base: 381 x 800. We extend canvas to 700 x 880 for islands.
// Formula: x = (lon - 102.14) / (109.46 - 102.14) * 381
//          y = (23.39 - lat) / (23.39 - 8.56) * 800
const HUBS: FinancialHub[] = [
  {
    name: "Hanoi",
    x: 193,
    y: 128,
    role: "Regulatory & Government Hub",
    color: "hsl(35, 85%, 58%)",
    highlights: [
      "HNX (Hanoi Stock Exchange)",
      "State Bank of Vietnam (SBV)",
      "Ministry of Finance (MOF)",
      "State Securities Commission (SSC)",
      "Government bond market operations",
    ],
  },
  {
    name: "Da Nang",
    x: 316,
    y: 395,
    role: "VIFC — International Financial Centre",
    color: "hsl(220, 70%, 60%)",
    highlights: [
      "Vietnam International Financial Centre (VIFC)",
      "Fintech & blockchain regulatory sandbox",
      "Special tax incentives (0-10% CIT)",
      "Cross-border payment pilot zone",
      "Green finance & digital asset hub",
    ],
  },
  {
    name: "Ho Chi Minh City",
    x: 234,
    y: 679,
    role: "Commercial & Financial Capital",
    color: "hsl(350, 60%, 60%)",
    highlights: [
      "HOSE (Ho Chi Minh Stock Exchange)",
      "60%+ of all fintech companies",
      "Major banks & VCs headquartered here",
      "Largest securities trading volume",
      "Fintech startup ecosystem center",
    ],
  },
];

export function VietnamFinancialMap() {
  const [active, setActive] = useState<string>("Da Nang");
  const [mapSvg, setMapSvg] = useState<string>("");
  const activeHub = HUBS.find((h) => h.name === active)!;

  useEffect(() => {
    fetch("/vietnam-admin.svg")
      .then((r) => r.text())
      .then((text) => {
        // Extract all <path> elements from the SVG
        const paths = text.match(/<path[\s\S]*?\/>/g) || [];
        setMapSvg(paths.join("\n"));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Map */}
      <div className="flex justify-center">
        <svg
          viewBox="-20 -20 700 880"
          className="w-full"
          style={{ height: "auto", maxHeight: "620px" }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea background */}
          <rect x="-20" y="-20" width="700" height="880" fill="hsl(215, 25%, 10%)" rx="12" />

          {/* Province paths from MapSVG (CC0 license) */}
          <g
            fill="hsl(215, 12%, 17%)"
            stroke="hsl(215, 18%, 25%)"
            strokeWidth="0.6"
            dangerouslySetInnerHTML={{ __html: mapSvg }}
          />

          {/* Hoàng Sa (Paracel Islands) — 16.5°N, 112°E → x≈513, y≈372 */}
          <g>
            <circle cx="510" cy="368" r="2.5" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="518" cy="362" r="1.8" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="525" cy="370" r="2" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="515" cy="375" r="1.5" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="522" cy="377" r="1.8" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="530" cy="365" r="1.2" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <ellipse cx="520" cy="370" rx="25" ry="18" fill="none" stroke="hsl(215, 25%, 28%)" strokeWidth="0.8" strokeDasharray="4 3" />
            <text x="520" y="398" fill="hsl(0, 0%, 50%)" fontSize="11" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="500">
              Hoàng Sa
            </text>
            <text x="520" y="411" fill="hsl(0, 0%, 38%)" fontSize="9" fontFamily="system-ui, sans-serif" textAnchor="middle">
              (Paracel Islands)
            </text>
          </g>

          {/* Trường Sa (Spratly Islands) — 10°N, 114°E → x≈617, y≈723 */}
          <g>
            <circle cx="610" cy="710" r="1.8" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="620" cy="700" r="1.5" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="628" cy="715" r="2" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="615" cy="720" r="1.5" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="625" cy="725" r="1.8" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="635" cy="705" r="1.2" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="632" cy="695" r="1.3" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <circle cx="612" cy="698" r="1" fill="hsl(215, 12%, 22%)" stroke="hsl(215, 18%, 32%)" strokeWidth="0.8" />
            <ellipse cx="622" cy="712" rx="28" ry="24" fill="none" stroke="hsl(215, 25%, 28%)" strokeWidth="0.8" strokeDasharray="4 3" />
            <text x="622" y="746" fill="hsl(0, 0%, 50%)" fontSize="11" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="500">
              Trường Sa
            </text>
            <text x="622" y="759" fill="hsl(0, 0%, 38%)" fontSize="9" fontFamily="system-ui, sans-serif" textAnchor="middle">
              (Spratly Islands)
            </text>
          </g>

          {/* Biển Đông label */}
          <text x="460" y="540" fill="hsl(215, 20%, 20%)" fontSize="14" fontFamily="system-ui, sans-serif" fontStyle="italic" textAnchor="middle" letterSpacing="2">
            Biển Đông
          </text>
          <text x="460" y="556" fill="hsl(215, 20%, 17%)" fontSize="9" fontFamily="system-ui, sans-serif" fontStyle="italic" textAnchor="middle" letterSpacing="1">
            (East Sea)
          </text>

          {/* Connection corridor between 3 hubs */}
          <path
            d={`M ${HUBS[0].x},${HUBS[0].y} L ${HUBS[1].x},${HUBS[1].y} L ${HUBS[2].x},${HUBS[2].y}`}
            fill="none"
            stroke="hsl(220, 50%, 40%)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity="0.5"
          />

          {/* Hub markers */}
          {HUBS.map((hub) => {
            const isActive = active === hub.name;
            const r = isActive ? 14 : 10;
            return (
              <g
                key={hub.name}
                onClick={() => setActive(hub.name)}
                className="cursor-pointer"
              >
                {/* Animated pulse rings */}
                {isActive && (
                  <>
                    <circle cx={hub.x} cy={hub.y} r={r} fill="none" stroke={hub.color} strokeWidth="1.5" opacity="0.6">
                      <animate attributeName="r" from={r + 3} to={r + 22} dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={hub.x} cy={hub.y} r={r} fill="none" stroke={hub.color} strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" from={r + 3} to={r + 22} dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Glow */}
                <circle cx={hub.x} cy={hub.y} r={r + 6} fill={hub.color} opacity={isActive ? 0.2 : 0.08} />

                {/* Main dot */}
                <circle
                  cx={hub.x} cy={hub.y} r={r}
                  fill={hub.color}
                  stroke={isActive ? "#fff" : hub.color}
                  strokeWidth={isActive ? 2.5 : 1}
                  filter={isActive ? "url(#glow)" : undefined}
                />

                {/* Inner dot */}
                <circle cx={hub.x} cy={hub.y} r={isActive ? 4 : 3} fill="#fff" opacity={isActive ? 0.9 : 0.5} />

                {/* City label */}
                <text
                  x={hub.x + r + 8}
                  y={hub.y + 5}
                  fill={isActive ? "#fff" : "hsl(0, 0%, 60%)"}
                  fontSize={isActive ? "14" : "12"}
                  fontWeight={isActive ? "600" : "400"}
                  fontFamily="system-ui, sans-serif"
                >
                  {hub.name}
                </text>

                {/* Role subtitle */}
                {isActive && (
                  <text
                    x={hub.x + r + 8}
                    y={hub.y + 20}
                    fill="hsl(0, 0%, 45%)"
                    fontSize="9"
                    fontFamily="system-ui, sans-serif"
                  >
                    {hub.role}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold mb-1">3 Financial Hubs</h3>
          <p className="text-sm text-muted-foreground">
            Vietnam&apos;s financial ecosystem is anchored by three cities forming a north-center-south corridor
          </p>
        </div>

        {/* Hub selector */}
        <div className="flex gap-2">
          {HUBS.map((hub) => (
            <button
              key={hub.name}
              onClick={() => setActive(hub.name)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active === hub.name
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span
                className="inline-block h-2 w-2 rounded-full mr-1.5"
                style={{ backgroundColor: hub.color }}
              />
              {hub.name === "Ho Chi Minh City" ? "HCMC" : hub.name}
            </button>
          ))}
        </div>

        {/* Active hub card */}
        <div className="rounded-lg border p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: activeHub.color }}
              />
              <h4 className="text-lg font-bold">{activeHub.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{activeHub.role}</p>
          </div>

          <ul className="space-y-2">
            {activeHub.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm">
                <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Corridor summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {HUBS.map((hub) => (
            <button
              key={hub.name}
              onClick={() => setActive(hub.name)}
              className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div
                className="text-xs font-semibold mb-0.5"
                style={{ color: hub.color }}
              >
                {hub.name === "Ho Chi Minh City" ? "HCMC" : hub.name}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {hub.name === "Hanoi" && "Regulation"}
                {hub.name === "Da Nang" && "VIFC"}
                {hub.name === "Ho Chi Minh City" && "Commerce"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
