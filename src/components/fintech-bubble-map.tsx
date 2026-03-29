"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { PALETTE } from "@/lib/chart-theme";

interface BubbleEntity {
  name: string;
  category: string;
  city: string;
  status: string;
}

interface FintechBubbleMapProps {
  entities: BubbleEntity[];
}

/* ── Circle-packing layout ── */

interface PackedCircle {
  x: number;
  y: number;
  r: number;
  category: string;
  count: number;
  colorIndex: number;
  entities: BubbleEntity[];
}

function packCircles(
  groups: { category: string; count: number; entities: BubbleEntity[] }[],
  width: number,
  height: number
): PackedCircle[] {
  const maxCount = Math.max(...groups.map((g) => g.count), 1);
  const minR = 28;
  const maxR = Math.min(width, height) * 0.18;

  const circles: PackedCircle[] = groups.map((g, i) => ({
    x: 0,
    y: 0,
    r: minR + (g.count / maxCount) * (maxR - minR),
    category: g.category,
    count: g.count,
    colorIndex: i,
    entities: g.entities,
  }));

  circles.sort((a, b) => b.r - a.r);

  const cx = width / 2;
  const cy = height / 2;
  const placed: PackedCircle[] = [];

  for (const circle of circles) {
    if (placed.length === 0) {
      circle.x = cx;
      circle.y = cy;
      placed.push(circle);
      continue;
    }

    let bestX = cx;
    let bestY = cy;
    let bestDist = Infinity;

    for (const other of placed) {
      const angles = 36;
      for (let a = 0; a < angles; a++) {
        const angle = (a / angles) * Math.PI * 2;
        const dist = other.r + circle.r + 4;
        const tx = other.x + Math.cos(angle) * dist;
        const ty = other.y + Math.sin(angle) * dist;

        let overlaps = false;
        for (const p of placed) {
          const dx = tx - p.x;
          const dy = ty - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < p.r + circle.r + 3) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          const d = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2);
          if (d < bestDist) {
            bestDist = d;
            bestX = tx;
            bestY = ty;
          }
        }
      }
    }

    circle.x = bestX;
    circle.y = bestY;
    placed.push(circle);
  }

  if (placed.length > 0) {
    const minX = Math.min(...placed.map((c) => c.x - c.r));
    const maxX = Math.max(...placed.map((c) => c.x + c.r));
    const minY = Math.min(...placed.map((c) => c.y - c.r));
    const maxY = Math.max(...placed.map((c) => c.y + c.r));
    const offsetX = cx - (minX + maxX) / 2;
    const offsetY = cy - (minY + maxY) / 2;
    for (const c of placed) {
      c.x += offsetX;
      c.y += offsetY;
    }
  }

  return placed;
}

/* ── SVG Bubble Canvas (shared between inline and fullscreen) ── */

interface BubbleCanvasProps {
  packed: PackedCircle[];
  width: number;
  height: number;
  totalEntities: number;
  groupCount: number;
  hovered: string | null;
  selected: string | null;
  onHover: (cat: string | null) => void;
  onSelect: (cat: string | null) => void;
  zoom: number;
  panX: number;
  panY: number;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  showControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

function BubbleCanvas({
  packed,
  width,
  height,
  totalEntities,
  groupCount,
  hovered,
  selected,
  onHover,
  onSelect,
  zoom,
  panX,
  panY,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  containerRef,
  showControls,
  onZoomIn,
  onZoomOut,
  onReset,
}: BubbleCanvasProps) {
  const activeCircle = packed.find(
    (c) => c.category === (selected || hovered)
  );

  // Compute viewBox based on zoom and pan
  const vw = width / zoom;
  const vh = height / zoom;
  const vx = width / 2 - vw / 2 - panX / zoom;
  const vy = height / 2 - vh / 2 - panY / zoom;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border border-border/50 bg-background select-none"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <svg
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        className="w-full h-auto"
        style={{ cursor: zoom > 1 ? "grab" : "default" }}
        role="img"
        aria-label="Vietnam Fintech Registry bubble map showing companies by category"
      >
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="hsl(240, 4%, 22%)" />
          </pattern>
        </defs>
        <rect x={vx - 50} y={vy - 50} width={vw + 100} height={vh + 100} fill="url(#dots)" />

        {packed.map((circle) => {
          const isActive =
            circle.category === hovered || circle.category === selected;
          const color = PALETTE[circle.colorIndex % PALETTE.length];
          return (
            <g
              key={circle.category}
              className="cursor-pointer"
              opacity={hovered || selected ? (isActive ? 1 : 0.3) : 1}
              style={{ transition: "opacity 0.2s" }}
              onMouseEnter={() => onHover(circle.category)}
              onMouseLeave={() => onHover(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected === circle.category ? null : circle.category);
              }}
            >
              <circle
                cx={circle.x}
                cy={circle.y}
                r={circle.r + 2}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 2 : 0}
                opacity={0.5}
              />
              <circle
                cx={circle.x}
                cy={circle.y}
                r={circle.r}
                fill={color}
                fillOpacity={isActive ? 0.3 : 0.15}
                stroke={color}
                strokeWidth={1.5}
              />
              <text
                x={circle.x}
                y={circle.y - (circle.r > 45 ? 8 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={circle.r > 50 ? 22 : circle.r > 35 ? 16 : 13}
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {circle.count}
              </text>
              {circle.r > 40 && (
                <text
                  x={circle.x}
                  y={circle.y + 14}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="hsl(240, 2%, 65%)"
                  fontSize={10}
                  className="pointer-events-none select-none"
                >
                  {circle.category.length > 16
                    ? circle.category.slice(0, 14) + "…"
                    : circle.category}
                </text>
              )}
            </g>
          );
        })}

        <text
          x={vx + 8}
          y={vy + vh - 8}
          fill="hsl(240, 2%, 45%)"
          fontSize={11 / zoom}
          className="select-none pointer-events-none"
        >
          {totalEntities} entities · {groupCount} categories
        </text>
      </svg>

      {/* Zoom controls */}
      {showControls && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <button
            onClick={onZoomIn}
            className="h-7 w-7 rounded border border-border/50 bg-popover text-foreground text-sm flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={onZoomOut}
            className="h-7 w-7 rounded border border-border/50 bg-popover text-foreground text-sm flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Zoom out"
          >
            −
          </button>
          {(zoom !== 1 || panX !== 0 || panY !== 0) && (
            <button
              onClick={onReset}
              className="h-7 px-2 rounded border border-border/50 bg-popover text-muted-foreground text-[10px] font-mono flex items-center justify-center hover:bg-muted transition-colors"
            >
              {Math.round(zoom * 100)}% · Reset
            </button>
          )}
        </div>
      )}

      {/* Tooltip overlay */}
      {activeCircle && (
        <div className="absolute top-3 right-3 w-56 rounded-lg border border-border/50 bg-popover p-3 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: PALETTE[activeCircle.colorIndex % PALETTE.length],
              }}
            />
            <span className="text-sm font-semibold">{activeCircle.category}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {activeCircle.count} entities (
            {((activeCircle.count / totalEntities) * 100).toFixed(1)}%)
          </p>
          <div className="space-y-1 max-h-40 overflow-y-auto pointer-events-auto">
            {activeCircle.entities.slice(0, 12).map((e, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="truncate text-foreground/80 max-w-[130px]">{e.name}</span>
                <span className="text-muted-foreground shrink-0 ml-1">{e.city}</span>
              </div>
            ))}
            {activeCircle.entities.length > 12 && (
              <p className="text-[10px] text-muted-foreground pt-1">
                +{activeCircle.entities.length - 12} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pan & Zoom hook ── */

function usePanZoom() {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only pan if zoomed in or middle-click
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPanX((p) => p + dx);
    setPanY((p) => p + dy);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(Math.max(z * delta, 0.5), 5));
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z * 1.3, 5)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z / 1.3, 0.5)), []);
  const reset = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  return {
    zoom,
    panX,
    panY,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    containerRef,
    zoomIn,
    zoomOut,
    reset,
  };
}

/* ── Fullscreen Modal ── */

function FullscreenModal({
  packed,
  width,
  height,
  totalEntities,
  groupCount,
  onClose,
}: {
  packed: PackedCircle[];
  width: number;
  height: number;
  totalEntities: number;
  groupCount: number;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const pz = usePanZoom();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-semibold">Vietnam Financial Registry Map</h2>
          <p className="text-xs text-muted-foreground">
            {totalEntities} entities · {groupCount} categories — scroll to zoom, drag to pan
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg border border-border/50 bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors text-sm"
          aria-label="Close fullscreen"
        >
          ✕
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 p-4 min-h-0">
        <div className="h-full">
          <BubbleCanvas
            packed={packed}
            width={width}
            height={height}
            totalEntities={totalEntities}
            groupCount={groupCount}
            hovered={hovered}
            selected={selected}
            onHover={setHovered}
            onSelect={setSelected}
            zoom={pz.zoom}
            panX={pz.panX}
            panY={pz.panY}
            onPointerDown={pz.onPointerDown}
            onPointerMove={pz.onPointerMove}
            onPointerUp={pz.onPointerUp}
            onWheel={pz.onWheel}
            containerRef={pz.containerRef}
            showControls
            onZoomIn={pz.zoomIn}
            onZoomOut={pz.zoomOut}
            onReset={pz.reset}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-6 py-3 border-t border-border/50">
        {packed.map((circle) => (
          <button
            key={circle.category}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            onMouseEnter={() => setHovered(circle.category)}
            onMouseLeave={() => setHovered(null)}
            onClick={() =>
              setSelected(selected === circle.category ? null : circle.category)
            }
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{
                backgroundColor: PALETTE[circle.colorIndex % PALETTE.length],
              }}
            />
            {circle.category} ({circle.count})
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function FintechBubbleMap({ entities }: FintechBubbleMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const pz = usePanZoom();

  const groups = useMemo(() => {
    const map = new Map<string, BubbleEntity[]>();
    for (const e of entities) {
      if (!e.category) continue;
      const existing = map.get(e.category) || [];
      existing.push(e);
      map.set(e.category, existing);
    }
    return Array.from(map.entries())
      .map(([category, ents]) => ({
        category,
        count: ents.length,
        entities: ents,
      }))
      .sort((a, b) => b.count - a.count);
  }, [entities]);

  const width = 720;
  const height = 480;

  const packed = useMemo(
    () => packCircles(groups, width, height),
    [groups, width, height]
  );

  const totalEntities = entities.length;

  return (
    <>
      <div className="space-y-3">
        <BubbleCanvas
          packed={packed}
          width={width}
          height={height}
          totalEntities={totalEntities}
          groupCount={groups.length}
          hovered={hovered}
          selected={selected}
          onHover={setHovered}
          onSelect={setSelected}
          zoom={pz.zoom}
          panX={pz.panX}
          panY={pz.panY}
          onPointerDown={pz.onPointerDown}
          onPointerMove={pz.onPointerMove}
          onPointerUp={pz.onPointerUp}
          onWheel={pz.onWheel}
          containerRef={pz.containerRef}
          showControls
          onZoomIn={pz.zoomIn}
          onZoomOut={pz.zoomOut}
          onReset={pz.reset}
        />

        {/* Legend + Expand */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex flex-wrap gap-3 flex-1">
            {packed.slice(0, 10).map((circle) => (
              <button
                key={circle.category}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                onMouseEnter={() => setHovered(circle.category)}
                onMouseLeave={() => setHovered(null)}
                onClick={() =>
                  setSelected(
                    selected === circle.category ? null : circle.category
                  )
                }
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: PALETTE[circle.colorIndex % PALETTE.length],
                  }}
                />
                {circle.category} ({circle.count})
              </button>
            ))}
          </div>
          <button
            onClick={() => setFullscreen(true)}
            className="shrink-0 flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/50 rounded px-2 py-1"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
            </svg>
            Expand
          </button>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <FullscreenModal
          packed={packed}
          width={width}
          height={height}
          totalEntities={totalEntities}
          groupCount={groups.length}
          onClose={() => setFullscreen(false)}
        />
      )}
    </>
  );
}
