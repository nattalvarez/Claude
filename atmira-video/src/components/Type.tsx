import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp, rng } from "../lib/anim";

/* ───────────────────────── Bloques de texto ───────────────────────── */

/** Una línea con revelado por máscara (sube desde abajo). Sin rebotes. */
export const MaskLine: React.FC<{
  children: React.ReactNode;
  start: number;
  dur?: number;
  style?: React.CSSProperties;
  /** distancia inicial, en em */
  rise?: number;
  /** salida: frame desde el que desaparece (más rápida que la entrada) */
  exitAt?: number;
}> = ({ children, start, dur = 22, style, rise = 1.08, exitAt }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, dur, EASE.out);
  const q = exitAt === undefined ? 0 : ramp(frame, exitAt, Math.max(6, Math.round(dur * 0.45)), EASE.in);
  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: "0.16em",
        marginBottom: "-0.16em",
        paddingTop: "0.06em",
        marginTop: "-0.06em",
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - p) * rise * 100 + q * -60}%)`,
          opacity: clamp(p * 1.6) * (1 - q),
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Varias líneas con retardo escalonado. */
export const Lines: React.FC<{
  lines: React.ReactNode[];
  start: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
  exitAt?: number;
}> = ({ lines, start, stagger = 6, dur = 22, style, lineStyle, exitAt }) => (
  <div style={style}>
    {lines.map((l, i) => (
      <MaskLine key={i} start={start + i * stagger} dur={dur} style={lineStyle} exitAt={exitAt === undefined ? undefined : exitAt + i * 2}>
        {l}
      </MaskLine>
    ))}
  </div>
);

/** Frase que entra de una vez (opacidad + desplazamiento + desenfoque); `stagger` se conserva por compatibilidad. */
export const Words: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  /** índices de palabra resaltadas (color alterno, serif cursiva) */
  accent?: number[];
  accentColor?: string;
}> = ({ text, start, dur = 24, style, accent = [], accentColor = C.magenta }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const p = ramp(frame, start, dur, EASE.out);
  return (
    <div style={{ opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 0.35}em)`, filter: `blur(${(1 - p) * 7}px)`, ...style }}>
      {words.map((w, i) => (
        <span key={i} style={accent.includes(i) ? { color: accentColor, fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500 } : undefined}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

/**
 * "Modernizamos": las letras parten desordenadas (jitter de posición, giro y desenfoque)
 * y se asientan en su sitio, una a una. Representa orden a partir de complejidad.
 */
export const CharSettle: React.FC<{
  text: string;
  start: number;
  seed?: number;
  style?: React.CSSProperties;
  mess?: number;
}> = ({ text, start, seed = 3, style, mess = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = rng(seed);
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => {
        const dx = (r() - 0.5) * 2;
        const dy = (r() - 0.5) * 2;
        const rot = (r() - 0.5) * 2;
        const sc = r();
        const s = spring({
          frame: frame - start - i * 1.6,
          fps,
          config: { damping: 22, stiffness: 90, mass: 0.9 },
        });
        const k = (1 - clamp(s)) * mess;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translate(${dx * 0.9 * k}em, ${dy * 0.55 * k}em) rotate(${rot * 38 * k}deg) scale(${1 + (sc - 0.5) * 0.7 * k})`,
              opacity: clamp(s * 3),
              filter: `blur(${k * 9}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/**
 * "aceleramos": entra deslizando con un rastro (copias fantasma) y frena en seco. Velocidad con intención.
 */
export const SpeedWord: React.FC<{
  text: string;
  start: number;
  dur?: number;
  from?: number;
  style?: React.CSSProperties;
  ghosts?: number;
  ghostColor?: string;
}> = ({ text, start, dur = 26, from = 1.25, style, ghosts = 5, ghostColor = C.magenta }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, dur, EASE.snap);
  const x = (1 - p) * from; // em, hasta 0
  const vis = clamp(p * 5);
  return (
    // la palabra emerge desde detrás del borde izquierdo de su caja (recorte), sin pisar el texto anterior
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "pre",
        overflow: "hidden",
        paddingRight: "0.1em",
        paddingBottom: "0.2em",
        marginBottom: "-0.2em",
        verticalAlign: "top",
        ...style,
      }}
    >
      <span style={{ visibility: "hidden" }}>{text}</span>
      {Array.from({ length: ghosts }).map((_, g) => (
        <span
          key={g}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translateX(${-(x + (1 - p) * (g + 1) * 0.1)}em)`,
            opacity: (1 - p) * 0.2 * (1 - g / ghosts) * vis,
            color: ghostColor,
            filter: `blur(${(1 - p) * (g + 1) * 0.9}px)`,
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      ))}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translateX(${-x}em) scaleX(${1 + (1 - p) * 0.1})`,
          transformOrigin: "left center",
          opacity: vis,
          filter: `blur(${(1 - p) * 2.5}px)`,
        }}
      >
        {text}
      </span>
    </span>
  );
};

/* ───────────────────────── Etiquetas y filetes ───────────────────────── */

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  start: number;
  color?: string;
  style?: React.CSSProperties;
  rule?: boolean;
}> = ({ children, start, color = C.magenta, style, rule = true }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 18, EASE.out);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: FONT.sans,
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        opacity: clamp(p * 1.4),
        transform: `translateX(${(1 - p) * -18}px)`,
        ...style,
      }}
    >
      {rule && <span style={{ display: "block", width: 44 * p, height: 2, background: color }} />}
      {children}
    </div>
  );
};

/** Filete que se dibuja de izquierda a derecha. */
export const Rule: React.FC<{
  start: number;
  width: number | string;
  dur?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({ start, width, dur = 28, color = C.ink, thickness = 2, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, dur, EASE.inOut);
  return (
    <div style={{ width, height: thickness, ...style }}>
      <div style={{ width: "100%", height: "100%", background: color, transform: `scaleX(${p})`, transformOrigin: "left center" }} />
    </div>
  );
};

/* ───────────────────────── Cifras ───────────────────────── */

/**
 * Cifra animada: cuenta de 0 al valor final con una única curva (sin pasar por valores aleatorios).
 * El número ya ocupa su ancho final (tabular) para que no "baile" la composición.
 */
export const Counter: React.FC<{
  to: number;
  start: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, start, dur = 40, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, dur, EASE.soft);
  const v = Math.round(to * p);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: "'tnum'", ...style }}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
};

/** Estilos tipográficos base. */
export const font = (size: number, weight = 400, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT.sans,
  fontSize: size,
  fontWeight: weight,
  lineHeight: 1.08,
  letterSpacing: size > 90 ? "-0.035em" : size > 50 ? "-0.025em" : size > 30 ? "-0.012em" : "0",
  color: C.ink,
  ...extra,
});
