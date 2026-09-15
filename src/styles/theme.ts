import { Easing } from "remotion";

// SIREC — brand palette. Blues from brand guidelines; white/off-white carry
// most of the frame; magenta is a single controlled accent, never a base.
export const COLORS = {
  white: "#FFFFFF",
  offWhite: "#F7F9FC",
  navy: "#233456", // azul oscuro
  blue: "#3365A2", // azul principal
  turquoise: "#2ABBCE", // azul turquesa
  lightBlue: "#DDE7F4", // azul claro
  magenta: "#A73E72", // single controlled accent — never a base color
  glow: "rgba(42, 187, 206, 0.45)",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 900; // 30s @ 30fps

// Overlap window (frames) used for every scene-to-scene match-cut.
export const TRANSITION_FRAMES = 16;

// Scene durations as authored in the storyboard (seconds → frames), BEFORE
// the overlap compensation applied by buildTimeline() in ../timeline.ts.
export const SCENE_BEATS = [
  { id: "s01", duration: 120 }, // 0:00–0:04 — El riesgo
  { id: "s02", duration: 120 }, // 0:04–0:08 — SIREC
  { id: "s03", duration: 150 }, // 0:08–0:13 — Automatización → autonomía
  { id: "s04", duration: 150 }, // 0:13–0:18 — Fuerza de trabajo agéntica
  { id: "s05", duration: 150 }, // 0:18–0:23 — Autonomía gobernada
  { id: "s06", duration: 120 }, // 0:23–0:27 — Especialización
  { id: "s07", duration: 90 }, // 0:27–0:30 — Cierre
] as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
  inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — moves, camera
  in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const SPRING = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  smooth: { damping: 20, stiffness: 90, mass: 1 },
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
} as const;

export const FONT_FAMILY = "Roboto";

// Shared 3D material language — matte, low-metalness, corporate. No chrome,
// no neon emissive blow-outs.
export const MATERIAL = {
  matteNavy: { color: COLORS.navy, roughness: 0.55, metalness: 0.12, clearcoat: 0.15 },
  matteBlue: { color: COLORS.blue, roughness: 0.5, metalness: 0.14, clearcoat: 0.2 },
  matteTurquoise: { color: COLORS.turquoise, roughness: 0.4, metalness: 0.1, clearcoat: 0.25 },
  matteWhite: { color: COLORS.white, roughness: 0.65, metalness: 0.04, clearcoat: 0.1 },
  glassLight: { color: COLORS.lightBlue, roughness: 0.15, metalness: 0, transmission: 0.75, thickness: 0.6, ior: 1.2 },
  glassDark: { color: COLORS.navy, roughness: 0.2, metalness: 0, transmission: 0.55, thickness: 0.8, ior: 1.3 },
} as const;
