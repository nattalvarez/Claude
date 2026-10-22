import { Easing } from "remotion";

/** Formato de salida. Todo el montaje deriva de FPS: no hay frames "mágicos". */
export const FPS = 25;
export const W = 1920;
export const H = 1080;

/** Paleta atmira. Magenta y tintas medidos sobre el vídeo original (ver public/brand/brand.json). */
export const C = {
  paper: "#FCFCFC",
  paper2: "#F3F2F4",
  ink: "#111111",
  ink2: "#3A3A3F",
  mute: "#6E6E75",
  line: "#D9D8DD",
  magenta: "#E1037A",
  magentaLogo: "#E31F74",
  magentaSoft: "#F9D3E6",
  magentaMist: "#FCEAF3",
  magentaDeep: "#8F0152",
  plum: "#2B0619",
  plumDeep: "#14030C",
  charcoal: "#1D1D20",
  panel: "#353535",
  white: "#FFFFFF",
} as const;

export const FONT = {
  sans: "'Roboto Variable', 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Roboto Variable', 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
} as const;

/** Curvas de aceleración. Nada es lineal. */
export const EASE = {
  /** entrada con desaceleración larga (expo) */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** entrada más suave */
  soft: Easing.bezier(0.22, 1, 0.36, 1),
  /** movimientos de ida y vuelta */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** salida rápida */
  in: Easing.bezier(0.5, 0, 0.9, 0.4),
  /** arranque brusco, frenada seca: "aceleración" */
  snap: Easing.bezier(0.7, 0, 0.16, 1),
} as const;

/** Safe area: margen de composición general. */
export const PAD = { x: 120, top: 96, bottom: 90 } as const;

/** Escalón tipográfico (px a 1920×1080). */
export const T = {
  hero: 188,
  display: 124,
  h1: 84,
  h2: 58,
  h3: 40,
  lead: 34,
  body: 28,
  small: 24,
  label: 20,
} as const;
