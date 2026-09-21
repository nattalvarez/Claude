import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC — orchestration hub. SIREC sits at the world origin; six management
 * channels radiate from it like spokes, and SIREC Agent Fabric + Agentes IA
 * rise on a separate vertical axis above it. One continuous camera visits
 * each spoke in turn — a push toward it, then a hold once the wheel opens
 * back up — before climbing to the Agent Fabric layer and finally gathering
 * everything into one large, held final shot.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 1320; // 44s @ 30fps — every beat now holds long enough to read

// ---- World-space layout ----------------------------------------------------
// Kept tighter than a first pass would suggest — less distance between
// layers means the camera can sit at a bigger zoom and still fit everything,
// which is what actually makes each beat (and the final reveal) read large.
export const CENTER = { x: 0, y: 0 };
export const TITLE_POS = { x: 0, y: -150 };

export const SPOKES = {
  amistosa: { x: 420, y: -420 }, // upper-right
  litigiosa: { x: 600, y: -30 }, // right
  cobranza: { x: 240, y: -580 }, // up, tilted off the vertical axis
  despachos: { x: -600, y: -30 }, // left
  presencial: { x: -30, y: 560 }, // down
  selfService: { x: 420, y: 440 }, // down-right
} as const;

export const AGENT_FABRIC_POS = { x: 0, y: -780 };
export const AGENT_NODES = [
  { x: -180, y: -1080 },
  { x: 0, y: -1150 },
  { x: 180, y: -1080 },
] as const;

// where the final gathered shot centers the whole ecosystem
export const FINAL_VIEW = { x: 0, y: -240, zoom: 0.56 };

export const WORLD_OFFSET = 2400; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4800;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) ------------------------
type CamKey = [number, number, number, number, number];

const CAM: CamKey[] = [
  [0, 0, -150, 1.1, 0], // intro — title floating just above SIREC's spot
  [70, 0, -150, 1.15, 0], // slow forward creep, long enough to read all 3 lines
  [100, 0, 0, 1.5, 0], // arrive SIREC core
  [175, 0, 0, 1.55, 0.5], // hold — read "SIREC" before the first connection

  // 1 — Gestión interna amistosa (upper-right)
  [190, 210, -210, 1.45, 2],
  [240, 30, -30, 1.4, -1],
  // hold until 290

  // 2 — Gestión interna litigiosa (right)
  [290, 320, -16, 1.35, 0],
  [340, 40, -14, 1.35, 1],
  // hold until 390

  // 3 — Agencias de cobranza (up)
  [390, 130, -320, 1.3, -2],
  [440, 30, -80, 1.3, 0],
  // hold until 490

  // 4 — Despachos de abogados (left)
  [490, -320, -16, 1.25, -1],
  [540, -30, -14, 1.25, 1],
  // hold until 590

  // 5 — Gestión presencial (down)
  [590, -16, 280, 1.2, 2],
  [640, 0, 60, 1.15, 0],
  // hold until 690

  // 6 — Gestión self-service (down-right)
  [690, 210, 220, 1.15, -1],
  [740, 0, 0, 1.1, 0], // the whole wheel, roughly framed
  // hold until 790

  // ascend to SIREC Agent Fabric
  [790, 0, -320, 1.25, 0],
  [870, 0, -780, 1.4, 0],
  [930, 0, -780, 1.4, 0], // hold — read "SIREC Agent Fabric"

  // Agentes IA blooming above the Fabric layer
  [1000, 0, -950, 1.3, 0],
  [1060, 0, -950, 1.3, 0], // hold — read "Agentes IA"

  // gather everything — the final, biggest legible view of the whole schema
  [1140, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0],
  [DURATION_IN_FRAMES, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0],
];

const frames = CAM.map((k) => k[0]);
const xs = CAM.map((k) => k[1]);
const ys = CAM.map((k) => k[2]);
const zooms = CAM.map((k) => k[3]);
const tilts = CAM.map((k) => k[4]);

const inOut = Easing.bezier(0.83, 0, 0.17, 1);

export type CameraState = { x: number; y: number; zoom: number; tilt: number };

export const cameraAt = (frame: number): CameraState => ({
  x: interpolate(frame, frames, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  y: interpolate(frame, frames, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  zoom: interpolate(frame, frames, zooms, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  tilt: interpolate(frame, frames, tilts, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
});

/** Same projection technique as the Agent Fabric piece: world point → screen,
 * with `factor` giving background/foreground layers their own parallax rate. */
export const worldTransform = (cam: CameraState, factor = 1): string => {
  const cx = cam.x * factor;
  const cy = cam.y * factor;
  const zoom = 1 + (cam.zoom - 1) * factor;
  return `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) rotate(${cam.tilt * factor}deg) scale(${zoom}) translate(${-cx}px, ${-cy}px)`;
};

// ---- Element entrance timing (frame each element starts building) ---------
export const T = {
  title: { line1: 6, line2: 24, line3: 46, exit: 100 },

  sirec: { core: 100, ring: 114, label: 132 },

  amistosa: { line: 195, lineDuration: 26, node: 214, label: 228 },
  litigiosa: { line: 295, lineDuration: 24, node: 316, label: 330 },
  cobranza: { line: 395, lineDuration: 26, node: 414, label: 428, satellites: [438, 446, 454] },
  despachos: { line: 495, lineDuration: 30, node: 522, label: 536 },
  presencial: { line: 595, lineDuration: 24, node: 616, label: 630 },
  selfService: { line: 695, lineDuration: 24, node: 716, label: 730 },

  agentFabric: { line: 760, lineDuration: 55, container: 818, title: 838, subtitle: 856 },
  agentNodes: [
    { from: 935, connFrom: 925 },
    { from: 946, connFrom: 936 },
    { from: 957, connFrom: 947 },
  ],
  agentsLabel: 985,

  finalTagline: 1155,
} as const;

// ---- Channel node visibility ------------------------------------------
// Each spoke recedes shortly before the camera pushes toward the next one
// (so it never lingers to get clipped at a hold framed for its neighbour),
// then every spoke returns together as the camera pulls back for the final
// gathered view — reinforcing that "gather" motion rather than just hiding
// a bug.
export const CHANNEL_AWAY = {
  amistosa: 270,
  litigiosa: 370,
  cobranza: 470,
  despachos: 570,
  presencial: 670,
  selfService: 770,
} as const;

const GATHER_FADE_IN: [number, number] = [1060, 1140];

export const channelFade = (frame: number, awayStart: number): number => {
  const fadeOut = interpolate(frame, [awayStart, awayStart + 25], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, GATHER_FADE_IN, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.max(fadeOut, fadeIn);
};
