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

/** Palabra de acento: serif cursiva en magenta (como en la película de marca). */
const accentStyle = (serif: boolean, color: string): React.CSSProperties =>
  serif ? { color, fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.01em" } : { color };

/**
 * Titular que entra de una vez, como frase completa, en el momento en que arranca su primera palabra hablada.
 * No sigue a la voz palabra a palabra: se lee entero desde el principio.
 */
export const SyncWords: React.FC<Common & { lead?: number; dur?: number; exitAt?: number; serif?: boolean }> = ({
  scene,
  text,
  from,
  block = 0,
  nth = 0,
  style,
  accent = [],
  accentColor = C.magenta,
  lead = 5,
  dur = 22,
  exitAt,
  serif = true,
}) => {
  const frame = useCurrentFrame();
  const al = alignTokens(scene, text, from, block, nth);
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, 12, EASE.in);
  const p = ramp(frame, (al[0]?.s ?? 0) - lead, dur, EASE.out);
  return (
    <div
      style={{
        opacity: clamp(p * 1.5) * (1 - q),
        transform: `translateY(${(1 - p) * 0.3}em)`,
        filter: `blur(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {al.map((a, i) => (
        <span key={i} style={accent.includes(i) ? accentStyle(serif, accentColor) : undefined}>
          {a.tok}
          {i < al.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

/**
 * Texto corrido que aparece completo y se queda: sin resaltado palabra a palabra.
 * Las palabras de acento van en serif cursiva magenta.
 */
export const Karaoke: React.FC<
  Common & { appear?: number; dim?: string; on?: string; accentOn?: string; exitAt?: number; serif?: boolean }
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
  on = C.ink,
  exitAt,
  serif = true,
}) => {
  const frame = useCurrentFrame();
  const al = alignTokens(scene, text, from, block, nth);
  const pIn = ramp(frame, appear, 26, EASE.out);
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, 14, EASE.in);
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        opacity: clamp(pIn * 1.5) * (1 - q),
        transform: `translateY(${(1 - pIn) * 22 + q * -24}px)`,
        filter: `blur(${(1 - pIn) * 6}px)`,
        ...style,
        color: on,
      }}
    >
      {al.map((a, i) => (
        <span key={i} style={accent.includes(i) ? accentStyle(serif, accentColor) : undefined}>
          {a.tok}
          {i < al.length - 1 ? " " : ""}
        </span>
      ))}
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
