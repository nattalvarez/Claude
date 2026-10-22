// Single source of truth: brand palette (Atmira brief), fonts, easings and spring presets.
import { Easing } from "remotion";

export const theme = {
  colors: {
    blue: "#3365A2", // azul principal
    navy: "#233456", // azul oscuro
    turq: "#2ABBCE", // azul turquesa — hero sobre fondos oscuros
    ice: "#DDE7F4", // azul claro
    white: "#FFFFFF",
    // derived tints of the brand palette (never off-palette hues)
    navyDeep: "#121C32",
    navyMid: "#2C4574",
    blueLift: "#5C8CC6",
    paper: "#F5F8FC",
    ink: "#1B2A47",
    dim: "rgba(221,231,244,0.66)",
    dimInk: "rgba(35,52,86,0.62)",
    line: "rgba(221,231,244,0.22)",
    lineInk: "rgba(35,52,86,0.16)",
  },
  fonts: {
    sans: "'Instrument Sans', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Instrument Serif', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.4, 0, 0.2, 1),
  },
  spring: {
    snappy: { damping: 15, stiffness: 170, mass: 0.6 },
    smooth: { damping: 22, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slam: { damping: 12, stiffness: 240, mass: 0.8 },
  },
} as const;
