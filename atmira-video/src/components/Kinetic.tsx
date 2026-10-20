import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, FONT, H, W } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { font } from "./Type";

/** Línea de progreso del vídeo (fina, magenta, abajo del todo). Se coloca una sola vez sobre todo el montaje. */
export const ProgressLine: React.FC<{ total: number; hideFrom?: number }> = ({ total, hideFrom }) => {
  const frame = useCurrentFrame();
  const p = clamp(frame / total);
  const vis = hideFrom === undefined ? 1 : 1 - ramp(frame, hideFrom, 18, EASE.in);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, opacity: vis, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.07)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: C.magenta }} />
    </div>
  );
};

/**
 * Plano de color a pantalla completa que se abre como una mancha desde un punto (ox, oy en px) y se cierra
 * hacia otro. Todo lo que contiene queda recortado por la mancha. Sustituye a las «tarjetas» de énfasis:
 * el énfasis es el propio lienzo, no una caja dentro de la pantalla.
 */
export const Flood: React.FC<{
  start: number;
  end: number;
  from?: [number, number];
  to?: [number, number];
  color?: string;
  inDur?: number;
  outDur?: number;
  children?: React.ReactNode;
}> = ({ start, end, from = [W * 0.5, H * 0.55], to = [W * 0.5, H * 0.3], color = C.magenta, inDur = 30, outDur = 26, children }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, start, inDur, EASE.inOut);
  const b = ramp(frame, end, outDur, EASE.inOut);
  if (a <= 0.001 || b >= 0.999) return null;
  const R = Math.hypot(W, H) * 1.05;
  // entra desde `from` y sale cerrándose hacia `to`
  const r = a * R * (1 - b);
  const cx = from[0] + (to[0] - from[0]) * b;
  const cy = from[1] + (to[1] - from[1]) * b;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${color} 0%, ${C.magentaDeep} 160%)` }} />
      {children}
    </AbsoluteFill>
  );
};

/** Numeral gigante «fantasma» (solo trazo) detrás de una lista. */
export const GhostNum: React.FC<{ n: string; x: number; y: number; size?: number; opacity?: number; stroke?: string }> = ({
  n,
  x,
  y,
  size = 520,
  opacity = 1,
  stroke = C.magentaSoft,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      ...font(size, 700, { color: "transparent", letterSpacing: "-0.06em", lineHeight: 0.9 }),
      WebkitTextStroke: `2px ${stroke}`,
      opacity,
      pointerEvents: "none",
    }}
  >
    {n}
  </div>
);

/**
 * Lista «a foco»: líneas de texto abiertas (sin cajas). La línea activa se pone en tinta y las anteriores
 * quedan en gris; una marca magenta señala la activa. `cues` son los fotogramas en que se pronuncia cada una.
 */
export const SpotList: React.FC<{
  items: { t: string; d?: string }[];
  cues: number[];
  x: number;
  y: number;
  width: number;
  size?: number;
  gap?: number;
  descSize?: number;
  on?: string;
  off?: string;
  mark?: string;
  /** altura reservada para la descripción bajo cada línea (0 = sin descripciones) */
  descH?: number;
  /** desvanece toda la lista a partir de este fotograma */
  exitAt?: number;
}> = ({ items, cues, x, y, width, size = 56, gap = 22, descSize = 26, on = C.ink, off = "#BEBDC4", mark = C.magenta, descH = 0, exitAt }) => {
  const frame = useCurrentFrame();
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, 14, EASE.in);
  const rowH = size * 1.14 + descH + gap;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, opacity: 1 - q }}>
      {items.map((it, i) => {
        const p = ramp(frame, cues[i] - 10, 22, EASE.out);
        const act = ramp(frame, cues[i] - 6, 10, EASE.out) * (1 - (i + 1 < items.length ? ramp(frame, cues[i + 1] - 6, 10, EASE.out) : 0));
        const col = mix(off, on, act);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: i * rowH, width, height: rowH, opacity: clamp(p * 1.6) }}>
            <div style={{ position: "absolute", left: -34, top: size * 0.56, width: 14 * act, height: 3, background: mark, opacity: act }} />
            <div style={{ transform: `translateY(${(1 - p) * 22}px)`, ...font(size, act > 0.5 ? 600 : 500, { color: col, letterSpacing: "-0.03em", lineHeight: 1.14 }) }}>{it.t}</div>
            {it.d && descH > 0 && (
              <div style={{ marginTop: 4, opacity: act, transform: `translateY(${(1 - act) * 8}px)`, ...font(descSize, 400, { color: C.mute, letterSpacing: 0, lineHeight: 1.3 }) }}>{it.d}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const hex = (c: string) => {
  const n = parseInt(c.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
};

/** Palabra gigante que entra por máscara (sube desde abajo) con peso fuerte. */
export const Giant: React.FC<{
  children: React.ReactNode;
  start: number;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
  dur?: number;
}> = ({ children, start, size = 150, color = C.ink, weight = 700, style, dur = 24 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, dur, EASE.out);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", ...style }}>
      <div style={{ ...font(size, weight, { color, letterSpacing: "-0.05em", lineHeight: 1.02 }), transform: `translateY(${(1 - p) * 105}%)`, opacity: clamp(p * 2) }}>{children}</div>
    </div>
  );
};

export { FONT };
