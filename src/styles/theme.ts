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

/** Scene durations, in frames, BEFORE overlap is subtracted.
 * núcleo (intro) → esquema radial de 9 nodos (schema) → cierre. */
const RAW_DURATIONS = {
  intro: 270, // 9s — el núcleo
  schema: 390, // 13s — se forma el esquema de 9 nodos
  closing: 210, // 7s — el esquema se retira, aparece la frase final
} as const;

export const SCENE_KEYS = ["intro", "schema", "closing"] as const;

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

/** The nine nodes of the risk-management scheme, in the exact order they must appear
 * around the core — shared so the schema scene and the closing scene agree on
 * node positions/colors. */
export const SERVICES = [
  { key: "seguimiento", label: "SEGUIMIENTO DEL RIESGO" },
  { key: "prevencion", label: "GESTIÓN PREVENTIVA" },
  { key: "anticipacion", label: "GESTIÓN ANTICIPATIVA" },
  { key: "selfservice", label: "SELFSERVICE" },
  { key: "presencial", label: "PRESENCIAL" },
  { key: "agencias", label: "AGENCIAS" },
  { key: "amistosaInterna", label: "GESTIÓN AMISTOSA INTERNA" },
  { key: "litigiosaInterna", label: "GESTIÓN LITIGIOSA INTERNA" },
  { key: "despachoAbogados", label: "DESPACHO DE ABOGADOS" },
] as const;
