import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC — orchestration hub. SIREC sits at the world origin; six management
 * channels radiate from it like spokes, and SIREC Agent Fabric + Agentes IA
 * rise on a separate vertical axis above it. One continuous camera visits
 * each spoke in turn — a partial push toward it, then a pull back to an
 * ever-widening view of the growing wheel — before climbing to the Agent
 * Fabric layer and finally pulling back to reveal the whole ecosystem.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 900; // 30s @ 30fps

// ---- World-space layout ----------------------------------------------------
export const CENTER = { x: 0, y: 0 };
export const TITLE_POS = { x: 0, y: -150 };

// six lateral channels, each its own direction off SIREC
export const SPOKES = {
  amistosa: { x: 520, y: -520 }, // upper-right
  litigiosa: { x: 760, y: -40 }, // right
  cobranza: { x: 300, y: -740 }, // up, tilted off the vertical axis
  despachos: { x: -760, y: -40 }, // left
  presencial: { x: -40, y: 700 }, // down
  selfService: { x: 540, y: 560 }, // down-right
} as const;

// the vertical axis, reserved for the agentic layer
export const AGENT_FABRIC_POS = { x: 0, y: -1000 };
export const AGENT_NODES = [
  { x: -230, y: -1360 },
  { x: 0, y: -1440 },
  { x: 230, y: -1360 },
] as const;

export const WORLD_OFFSET = 2400; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4800;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) ------------------------
type CamKey = [number, number, number, number, number];

const CAM: CamKey[] = [
  [0, 0, -150, 1.05, 0], // intro — title floating just above SIREC's spot
  [60, 0, -150, 1.1, 0], // slow forward creep
  [100, 0, 0, 1.35, 0], // arrive SIREC core
  [160, 0, 0, 1.4, 0.5], // settle, tiny orbital drift begins

  // 1 — Gestión interna amistosa (upper-right)
  [190, 260, -260, 1.15, 2],
  [230, 40, -40, 1.25, -1],

  // 2 — Gestión interna litigiosa (right)
  [260, 380, -20, 1.1, 0],
  [300, 60, -20, 1.15, 1],

  // 3 — Agencias de cobranza (up)
  [330, 150, -370, 1.05, -2],
  [370, 40, -100, 1.05, 0],

  // 4 — Despachos de abogados (left)
  [400, -380, -20, 1.0, -1],
  [440, -40, -20, 1.0, 1],

  // 5 — Gestión presencial (down)
  [470, -20, 350, 0.95, 2],
  [510, 0, 80, 0.9, 0],

  // 6 — Gestión self-service (down-right)
  [540, 270, 280, 0.85, -1],
  [580, 0, 0, 0.8, 0], // the whole wheel, roughly framed

  // ascend to SIREC Agent Fabric
  [650, 0, -500, 0.85, 0],
  [720, 0, -1000, 0.9, 0],

  // Agentes IA blooming above the Fabric layer
  [750, 0, -1250, 0.85, 0],
  [790, 0, -1360, 0.8, 0],

  // pull back — the whole ecosystem, big and legible
  [840, 0, -480, 0.48, 0],
  [DURATION_IN_FRAMES, 0, -460, 0.44, 0],
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
  title: { line1: 6, line2: 20, line3: 38, exit: 88 },

  sirec: { core: 100, ring: 112, label: 128 },

  amistosa: { line: 155, lineDuration: 24, node: 175, label: 192 },
  litigiosa: { line: 235, lineDuration: 22, node: 258, label: 272 },
  cobranza: { line: 305, lineDuration: 24, node: 325, label: 340, satellites: [348, 355, 362] },
  despachos: { line: 375, lineDuration: 28, node: 400, label: 415 },
  presencial: { line: 445, lineDuration: 22, node: 465, label: 480 },
  selfService: { line: 515, lineDuration: 22, node: 535, label: 550 },

  agentFabric: { line: 610, lineDuration: 40, container: 655, title: 672, subtitle: 688 },
  agentNodes: [
    { from: 728, connFrom: 720 },
    { from: 738, connFrom: 730 },
    { from: 748, connFrom: 740 },
  ],
  agentsLabel: 760,

  finalTagline: 862,
} as const;
