export const COLORS = {
  white: "#FFFFFF",
  offWhite: "#FAFBFD",
  navy: "#233456",
  blue: "#3365A2",
  turquoise: "#2ABBCE",
  lightBlue: "#DDE7F4",
  glow: "rgba(42, 187, 206, 0.4)",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Frames each scene overlaps the next by — the outgoing scene's exit motif and the
 * incoming scene's entrance motif share this window so cuts read as one continuous
 * transformation instead of a hard edit. */
export const OVERLAP = 15;

/** Scene durations, in frames, BEFORE overlap is subtracted. Editorial-catalog narrative:
 * intro → inception → change management → sats → cloud → uaas → taas → support →
 * full catalog → closing. */
const RAW_DURATIONS = {
  intro: 210, // 7s
  inception: 240, // 8s
  changeManagement: 240, // 8s
  sats: 270, // 9s
  cloud: 270, // 9s
  uaas: 240, // 8s
  taas: 240, // 8s
  support: 240, // 8s
  catalog: 330, // 11s
  closing: 210, // 7s
} as const;

export const SCENE_KEYS = [
  "intro",
  "inception",
  "changeManagement",
  "sats",
  "cloud",
  "uaas",
  "taas",
  "support",
  "catalog",
  "closing",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export const SCENE_DURATIONS: Record<SceneKey, number> = RAW_DURATIONS;

export const DURATION_IN_FRAMES =
  SCENE_KEYS.reduce((sum, key) => sum + SCENE_DURATIONS[key], 0) - OVERLAP * (SCENE_KEYS.length - 1);

export const EASE = {
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
  soft: [0.33, 1, 0.68, 1] as [number, number, number, number],
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.83, 0, 0.17, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number], // exits only
};

export const SPRING = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  smooth: { damping: 20, stiffness: 90, mass: 1 },
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
} as const;

export const FONT_FAMILY = "Roboto";

/** Safe-area margins for 16:9 event-screen projection — nothing important crosses these. */
export const SAFE = {
  x: 140,
  y: 90,
} as const;

/** The seven SIREC services with the exact catalog copy from the brief — shared between
 * the full-catalog scene and the closing scene so wording never drifts. */
export const SERVICES = [
  {
    key: "inception",
    label: "INCEPTION",
    description: "Consultoría y acompañamiento experto durante la definición de un proyecto.",
  },
  {
    key: "changeManagement",
    label: "CHANGE MANAGEMENT",
    description: "Impulsa la adopción y el máximo aprovechamiento de SIREC.",
  },
  {
    key: "sats",
    label: "SATS",
    description: "Automatización de pruebas para reducir costes y mejorar el time to market.",
  },
  {
    key: "cloud",
    label: "SIREC CLOUD SERVICES",
    description: "Servicios Cloud para operar SIREC con seguridad y escalabilidad.",
  },
  {
    key: "uaas",
    label: "UaaS",
    description: "Actualizaciones de software para aprovechar las versiones más recientes.",
  },
  {
    key: "taas",
    label: "TaaS",
    description: "Formación planificada con sesiones presenciales y contenido formativo.",
  },
  {
    key: "support",
    label: "DEDICATED SUPPORT",
    description: "Asignación directa de especialistas de SIREC, temporal o permanente.",
  },
] as const;
