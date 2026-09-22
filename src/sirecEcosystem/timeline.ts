// Ten scenes, sequenced with a short overlap so consecutive scenes hand off
// to one another (outgoing exits while incoming enters) instead of hard
// cutting. Each scene still gets its full requested duration — the overlap
// only pulls its start earlier against the running cursor.

export type SceneId =
  | "intro"
  | "inception"
  | "changeManagement"
  | "sats"
  | "cloud"
  | "uaas"
  | "taas"
  | "support"
  | "catalog"
  | "closing";

const RAW: { id: SceneId; duration: number }[] = [
  { id: "intro", duration: 220 },
  { id: "inception", duration: 240 },
  { id: "changeManagement", duration: 240 },
  { id: "sats", duration: 270 },
  { id: "cloud", duration: 270 },
  { id: "uaas", duration: 240 },
  { id: "taas", duration: 240 },
  { id: "support", duration: 240 },
  { id: "catalog", duration: 340 },
  { id: "closing", duration: 220 },
];

export const OVERLAP = 18;

type Scene = { id: SceneId; duration: number; from: number };

const build = (): Scene[] => {
  const out: Scene[] = [];
  let cursor = 0;
  for (let i = 0; i < RAW.length; i++) {
    const from = i === 0 ? 0 : cursor - OVERLAP;
    out.push({ ...RAW[i], from });
    cursor = from + RAW[i].duration;
  }
  return out;
};

export const SCENES = build();

export const scene = (id: SceneId): Scene => SCENES.find((s) => s.id === id)!;

export const DURATION_IN_FRAMES = (() => {
  const last = SCENES[SCENES.length - 1];
  return last.from + last.duration;
})();

// ---- Service copy — verbatim summaries of the source material, used both
// in each service's own scene and in the scene 09 catalog. -----------------
export const SERVICES: { id: string; title: string; kicker?: string; desc: string }[] = [
  {
    id: "inception",
    title: "INCEPTION",
    desc: "Consultoría y acompañamiento experto durante la definición de un proyecto.",
  },
  {
    id: "changeManagement",
    title: "CHANGE MANAGEMENT",
    desc: "Impulsa la adopción y el máximo aprovechamiento de SIREC.",
  },
  {
    id: "sats",
    title: "SATS",
    kicker: "SIREC Automated Testing Suite",
    desc: "Automatización de pruebas para reducir costes y mejorar el time to market.",
  },
  {
    id: "cloud",
    title: "SIREC CLOUD SERVICES",
    desc: "Servicios Cloud para operar SIREC con seguridad y escalabilidad.",
  },
  {
    id: "uaas",
    title: "UaaS",
    kicker: "Upgrade as a Service",
    desc: "Actualizaciones de software para aprovechar las versiones más recientes.",
  },
  {
    id: "taas",
    title: "TaaS",
    kicker: "Training as a Service",
    desc: "Formación planificada con sesiones presenciales y contenido formativo.",
  },
  {
    id: "support",
    title: "DEDICATED SUPPORT",
    desc: "Asignación directa de especialistas de SIREC, temporal o permanente.",
  },
];
