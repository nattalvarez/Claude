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

/** Scene durations, in frames, BEFORE overlap is subtracted — mirrors the brief's
 * per-scene second ranges. Order matches the ecosystem narrative:
 * núcleo → inception → change management → sats → cloud → uaas → taas → support → ecosystem → end card. */
const RAW_DURATIONS = {
  intro: 270, // 9s — el núcleo
  inception: 255, // 8.5s
  changeManagement: 255, // 8.5s
  sats: 285, // 9.5s
  cloud: 285, // 9.5s
  uaas: 240, // 8s
  taas: 255, // 8.5s
  support: 240, // 8s
  ecosystem: 330, // 11s
  endCard: 120, // 4s
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
  "ecosystem",
  "endCard",
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

/** The seven SIREC services, in the order they orbit the core in Scene09 — shared so the
 * ecosystem scene and the end card agree on node positions/colors. */
export const SERVICES = [
  { key: "inception", label: "INCEPTION" },
  { key: "changeManagement", label: "CHANGE MANAGEMENT" },
  { key: "sats", label: "SATS" },
  { key: "cloud", label: "SIREC CLOUD SERVICES" },
  { key: "uaas", label: "UaaS" },
  { key: "taas", label: "TaaS" },
  { key: "support", label: "DEDICATED SUPPORT" },
] as const;
