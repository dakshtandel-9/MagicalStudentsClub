"use client";

import { useRef, useCallback, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import "./BorderGlow.css";

/**
 * A card whose border and outer bloom light up along the edge nearest the
 * pointer. Wraps the boxes *inside* the section panels — the panels themselves
 * keep the static `.glow-lg` halo from globals.css.
 *
 * ## Two things that will silently break it
 *
 * 1. The bloom (`.edge-light`) is inset *negatively*, so it paints outside the
 *    card's own box. Any ancestor with `overflow: hidden` clips it away and you
 *    get the border tint with no halo. Clip on the inner wrapper instead — that
 *    is what `.border-glow-inner` is for.
 *
 * 2. The glow layers sit at `z-index: -1` behind an `isolation: isolate` root.
 *    That confines them to this card's stacking context, which is what keeps
 *    them from punching through the section panels the deck stacks on top of
 *    each other. Don't remove the isolation.
 */

type HSL = { h: number; s: number; l: number };

function parseHSL(hslStr: string): HSL {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 330, s: 78, l: 58 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

/** The bloom is one hue at seven opacities — a single colour, layered. */
function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]): Record<string, string> {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

/**
 * Brand defaults. The mesh is pink-dominant with one cooler violet so the border
 * has some depth instead of reading as a flat magenta line; the bloom is the
 * brand pink #e83e8c expressed in HSL.
 */
const BRAND_COLORS = ["#e83e8c", "#f052a0", "#a855f7"];
const BRAND_GLOW = "330 78 58";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  /** Rendered tag. `li`/`article` keep the semantics the plain Card had. */
  as?: "div" | "article" | "li";
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  colors?: string[];
  fillOpacity?: number;
};

export function BorderGlow({
  children,
  className = "",
  as: Tag = "div",
  edgeSensitivity = 30,
  glowColor = BRAND_GLOW,
  backgroundColor = "#11141c",
  borderRadius = 16,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  colors = BRAND_COLORS,
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  // Re-reading layout with getBoundingClientRect() on every raw pointermove is
  // what causes layout thrashing once ~20 of these are mounted at once. The
  // rect only actually changes on resize/scroll, so it is cached here and
  // refreshed by the ResizeObserver below (a scroll listener covers position
  // shifts from the page moving under a fixed viewport rect).
  const rectRef = useRef<DOMRect | null>(null);
  // The DOM writes (setProperty) are coalesced to one per animation frame
  // instead of one per pointer event, so a fast mouse move can't queue up
  // more style recalculations than the screen can actually paint.
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const refreshRect = () => {
      rectRef.current = card.getBoundingClientRect();
    };
    refreshRect();

    const ro = new ResizeObserver(refreshRect);
    ro.observe(card);
    window.addEventListener("scroll", refreshRect, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", refreshRect);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const applyPending = useCallback(() => {
    rafRef.current = 0;
    const card = cardRef.current;
    const rect = rectRef.current;
    const pending = pendingRef.current;
    if (!card || !rect || !pending) return;

    const x = pending.x - rect.left;
    const y = pending.y - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = x - cx;
    const dy = y - cy;

    // Edge proximity: 0 at the centre, 1 at whichever border the pointer is
    // heading for. Found by asking how far the ray from centre through the
    // pointer could travel before it hits a side, and taking the pointer's
    // fraction of that. The axis that runs out first is the edge it belongs to.
    const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
    const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    // Bearing from centre to pointer, rotated so 0deg is up — the cone masks in
    // the CSS are authored against a `from <angle>` conic gradient, which starts
    // at 12 o'clock.
    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(applyPending);
    },
    [applyPending],
  );

  // `colors` is an array, so a caller passing a literal hands us a new identity
  // every render. Key the memo on the contents instead, or the vars would be
  // rebuilt on every render of all ~25 cards on the page.
  const colorKey = colors.join(",");
  const glowVars = useMemo(
    () => buildGlowVars(glowColor, glowIntensity),
    [glowColor, glowIntensity],
  );
  const gradientVars = useMemo(
    () => buildGradientVars(colorKey.split(",")),
    [colorKey],
  );

  const style = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...glowVars,
    ...gradientVars,
  } as CSSProperties;

  return (
    <Tag
      ref={cardRef as React.Ref<never>}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={style}
    >
      <span className="edge-light" aria-hidden />
      <div className="border-glow-inner">{children}</div>
    </Tag>
  );
}
