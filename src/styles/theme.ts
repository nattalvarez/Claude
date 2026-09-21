export const COLORS = {
  white: "#FFFFFF",
  offWhite: "#FAFBFD",
  navy: "#233456",
  navyDeep: "#182644",
  blue: "#3365A2",
  turquoise: "#2ABBCE",
  lightBlue: "#DDE7F4",
  magenta: "#B15CE0",
  glow: "rgba(42, 187, 206, 0.4)",
  magentaGlow: "rgba(177, 92, 224, 0.4)",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 900; // 30s @ 30fps

// Scene boundaries, in frames — mirrors the 0-4/4-8/8-13/13-18/18-23/23-27/27-30s beats
export const SCENES = {
  s01: { from: 0, duration: 120 }, // 0:00–0:04 — Complejidad → orden
  s02: { from: 120, duration: 120 }, // 0:04–0:08 — Presentación SIREC
  s03: { from: 240, duration: 150 }, // 0:08–0:13 — Automatización → autonomía
  s04: { from: 390, duration: 150 }, // 0:13–0:18 — Fuerza de trabajo agéntica
  s05: { from: 540, duration: 150 }, // 0:18–0:23 — Autonomía gobernada
  s06: { from: 690, duration: 120 }, // 0:23–0:27 — Especialización
  s07: { from: 810, duration: 90 }, // 0:27–0:30 — Cierre
} as const;

export const EASE = {
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
  soft: [0.33, 1, 0.68, 1] as [number, number, number, number],
  // named to match the motion-graphics skill's convention — out === enter
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.83, 0, 0.17, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number], // exits only
};

export const SPRING = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
  smooth: { damping: 20, stiffness: 90, mass: 1 }, // big elements
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents
} as const;

export const FONT_FAMILY = "Roboto";
