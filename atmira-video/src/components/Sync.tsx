import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { alignTokens } from "../lib/tl";

type Common = {
  scene: string;
  text: string;
  /** primera palabra (o secuencia) hablada que corresponde al inicio del texto */
  from: string;
  block?: number;
  nth?: number;
  style?: React.CSSProperties;
  /** índices de token en color de acento */
  accent?: number[];
  accentColor?: string;
};

/**
 * Cada palabra aparece justo cuando se pronuncia (tiempos reales de la locución):
 * opacidad + desplazamiento + desenfoque. Para titulares que la voz lee literalmente.
 */
export const SyncWords: React.FC<Common & { lead?: number; dur?: number; exitAt?: number }> = ({
  scene,
  text,
  from,
  block = 0,
  nth = 0,
  style,
  accent = [],
  accentColor = C.magenta,
  lead = 5,
  dur = 16,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const al = alignTokens(scene, text, from, block, nth);
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, 12, EASE.in);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.27em", rowGap: 0, opacity: 1 - q, ...style }}>
      {al.map((a, i) => {
        const p = ramp(frame, a.s - lead, dur, EASE.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: clamp(p * 1.6),
              transform: `translateY(${(1 - p) * 0.42}em)`,
              filter: `blur(${(1 - p) * 7}px)`,
              color: accent.includes(i) ? accentColor : undefined,
            }}
          >
            {a.tok}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Texto corrido legible desde el principio, con "resaltado" progresivo: cada palabra pasa de gris claro
 * a tinta cuando se pronuncia. Ideal para párrafos: no se oculta nada, la mirada sigue a la voz.
 */
export const Karaoke: React.FC<
  Common & { appear?: number; dim?: string; on?: string; accentOn?: string; exitAt?: number }
> = ({
  scene,
  text,
  from,
  block = 0,
  nth = 0,
  style,
  accent = [],
  accentColor = C.magenta,
  appear = 0,
  dim = "#C9C8CE",
  on = C.ink,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const al = alignTokens(scene, text, from, block, nth);
  const pIn = ramp(frame, appear, 20, EASE.out);
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, 14, EASE.in);
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        opacity: clamp(pIn * 1.5) * (1 - q),
        transform: `translateY(${(1 - pIn) * 18 + q * -24}px)`,
        ...style,
      }}
    >
      {al.map((a, i) => {
        const k = ramp(frame, a.s - 2, 8, EASE.out);
        const isAccent = accent.includes(i);
        return (
          <span
            key={i}
            style={{
              color: mix(dim, isAccent ? accentColor : on, k),
              transition: "none",
            }}
          >
            {a.tok}{" "}
          </span>
        );
      })}
    </div>
  );
};

const hex = (c: string) => {
  const n = parseInt(c.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
};
