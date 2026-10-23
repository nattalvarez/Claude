import React, { useLayoutEffect, useRef } from "react";
import { theme } from "../theme";
import { useGT, useExit } from "./Scene";
import { clamp, lerp, prog } from "../lib/anim";
import map from "../data/worldDots.json";
import { gap, vw } from "../timing";

const c = theme.colors;
const dots = map.dots as [number, number, number][];
const A = map.anchors;

export const MAP_START = gap("cumplimiento");
export const EUROPE_AT = vw("europa");
export const LATAM_AT = vw("latinoamerica");
export const ARCS_AT = LATAM_AT + 0.45;

/** Camera: zooms from the whole world into the Atlantic corridor (Europe + Latin America in frame). */
export const mapCamera = (gt: number) => {
  const p = prog(gt, MAP_START, 1.9, theme.ease.inOut);
  const drift = clamp(gt - (MAP_START + 1.9), 0, 4) * 0.012;
  const s = lerp(p, 1.0, 1.5) + drift;
  const cx = lerp(p, 960, 790);
  const cy = lerp(p, 500, 420);
  return { s, tx: 960 - cx * s, ty: 540 - cy * s };
};
export const toScreen = (gt: number, x: number, y: number) => {
  const k = mapCamera(gt);
  return { x: x * k.s + k.tx, y: y * k.s + k.ty };
};

const ARC_PAIRS: [number, number][] = [[0, 1], [3, 2], [1, 4], [2, 5], [4, 3], [0, 4]];
const hex = (h: string, a: number) => {
  const n = parseInt(h.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Dot-matrix world map drawn on canvas; Europe + LatAm light up with a radial wave, then arcs connect them. */
export const WorldMap: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gt = useGT();
  const ex = useExit(0.28);
  const appear = prog(gt, MAP_START, 0.6, theme.ease.out);

  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, 1920, 1080);
    const { s, tx, ty } = mapCamera(gt);
    const r0 = 1.45 * s;
    const reveal = (tag: number, x: number, y: number) => {
      const at = tag === 1 ? EUROPE_AT : LATAM_AT;
      const an = tag === 1 ? A.europe : A.latam;
      const d = Math.hypot(x - an[0], y - an[1]);
      return clamp((gt - at - d / 620) / 0.55);
    };
    // glow pass + dots
    for (let i = 0; i < dots.length; i++) {
      const [x, y, tag] = dots[i];
      const sx = x * s + tx, sy = y * s + ty;
      if (sx < -20 || sx > 1940 || sy < -20 || sy > 1100) continue;
      const q = tag ? reveal(tag, x, y) : 0;
      if (q > 0) {
        const pulse = 0.82 + 0.18 * Math.sin(gt * 2.6 + x * 0.03 + y * 0.02);
        const e = 1 - (1 - q) ** 3;
        const rr = r0 * (1 + 0.9 * e + 0.5 * Math.sin(q * Math.PI));
        ctx.fillStyle = hex(c.turq, 0.12 * e);
        ctx.beginPath(); ctx.arc(sx, sy, rr * 3.3, 0, 6.283); ctx.fill();
        ctx.fillStyle = hex(c.turq, (0.28 + 0.72 * e) * pulse);
        ctx.beginPath(); ctx.arc(sx, sy, rr, 0, 6.283); ctx.fill();
      } else {
        ctx.fillStyle = hex(c.ice, tag ? 0.34 : 0.27);
        ctx.beginPath(); ctx.arc(sx, sy, r0, 0, 6.283); ctx.fill();
      }
    }
    // arcs
    const pt = (n: number[]) => ({ x: n[0] * s + tx, y: n[1] * s + ty });
    ARC_PAIRS.forEach(([ei, li], k) => {
      const a = pt(A.europeNodes[ei]), b = pt(A.latamNodes[li]);
      const p = clamp((gt - ARCS_AT - k * 0.14) / 1.0);
      if (p <= 0) return;
      const mx = (a.x + b.x) / 2 - 40, my = Math.min(a.y, b.y) - Math.hypot(a.x - b.x, a.y - b.y) * 0.22;
      const P = (t: number) => ({
        x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x,
        y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y,
      });
      const e = 1 - (1 - p) ** 3;
      ctx.lineWidth = 2.2; ctx.lineCap = "round";
      const N = 48;
      for (let n = 0; n < N * e; n++) {
        const p0 = P(n / N), p1 = P((n + 1) / N);
        ctx.strokeStyle = hex(c.ice, 0.18 + 0.7 * (n / N));
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      }
      const head = P(e);
      ctx.fillStyle = hex(c.white, 0.95);
      ctx.beginPath(); ctx.arc(head.x, head.y, 4.2, 0, 6.283); ctx.fill();
      if (p >= 1) {
        const tt = ((gt * 0.42 + k * 0.17) % 1);
        const q = P(tt);
        ctx.fillStyle = hex(c.white, 0.9);
        ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, 6.283); ctx.fill();
        ctx.fillStyle = hex(c.turq, 0.35);
        ctx.beginPath(); ctx.arc(q.x, q.y, 9, 0, 6.283); ctx.fill();
      }
    });
    // node pulses
    const nodes = [...A.europeNodes.map((n) => ({ n, at: EUROPE_AT + 0.5 })), ...A.latamNodes.map((n) => ({ n, at: LATAM_AT + 0.5 }))];
    nodes.forEach(({ n, at }, i) => {
      if (gt < at) return;
      const q = pt(n);
      const ph = ((gt - at) * 0.8 + i * 0.13) % 1;
      ctx.strokeStyle = hex(c.turq, 0.75 * (1 - ph)); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(q.x, q.y, 6 + ph * 40 * s, 0, 6.283); ctx.stroke();
      ctx.fillStyle = hex(c.white, 0.95);
      ctx.beginPath(); ctx.arc(q.x, q.y, 4.6, 0, 6.283); ctx.fill();
    });
  }, [gt]);

  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity: appear * (1 - ex), transform: `scale(${1 + ex * 0.04})` }}
    />
  );
};
