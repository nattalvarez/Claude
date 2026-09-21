import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC Agent Fabric — single continuous camera move through a vertical 3D
 * architecture. Everything below is one source of truth: camera keyframes,
 * world-space positions for every block, and the frame each element starts
 * building at. Change a number here, the whole piece re-times itself.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 1140; // 38s @ 30fps — final wide shot holds 10s longer

// ---- World-space vertical column (y decreases as we go "up" the stack) ----
// Kept tight on purpose — less air between layers means a bigger camera
// zoom fits the same frame, which is what makes everything read larger.
export const Y_TITLE = 1350;
export const Y_SIREC = 480;
export const Y_FABRIC = -20;
export const Y_MCP = -280;
export const Y_AGENTS = -560;

export const X_CENTER = 0;
export const X_LEFT = -560; // concept panels
export const X_RIGHT = 560; // external provider / cloud badges

export const WORLD_OFFSET = 2200; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4400;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) -----------------------
type CamKey = [number, number, number, number, number];

const CAM: CamKey[] = [
  [0, 0, Y_TITLE, 0.95, 0], // intro — floating title
  [55, 0, Y_TITLE - 20, 1.0, 0], // slow forward creep
  [100, -25, Y_SIREC + 20, 1.15, 0.6], // arrive SIREC
  [170, -35, Y_SIREC, 1.18, 0.6], // SIREC hold end
  [220, 15, Y_FABRIC + 20, 1.22, -0.5], // arrive Fabric
  [280, 20, Y_FABRIC, 1.25, -0.5], // Fabric hold end
  [315, 35, Y_MCP, 1.26, 0.4], // arrive MCP
  [343, 35, Y_MCP, 1.27, 0.4], // MCP beat end
  [388, -5, Y_AGENTS + 20, 1.3, 0], // arrive Agents
  [463, -5, Y_AGENTS, 1.32, 0], // Agents hold end
  [501, 0, Y_MCP, 0.85, 0], // pull back — ecosystem reveal
  [536, 0, Y_MCP, 0.85, 0], // ecosystem hold end
  [558, 0, Y_AGENTS, 0.85, 0], // settle wide — POTENCIA zone
  [613, 0, Y_AGENTS, 0.85, 0], // POTENCIA hold end
  [641, 0, Y_FABRIC, 0.85, 0], // pan — INTEGRA zone
  [696, 0, Y_FABRIC, 0.85, 0], // INTEGRA hold end
  [724, 0, Y_SIREC, 0.85, 0], // pan — ORQUESTA zone
  [764, 0, Y_SIREC, 0.85, 0], // ORQUESTA hold — read the last line
  [804, 0, -40, 0.75, 0], // pull back — the whole architecture, big, in one frame
  [DURATION_IN_FRAMES, 0, -40, 0.75, 0], // final hold — the closing shot
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

/** CSS transform string projecting world-space content through the camera.
 * `factor` < 1 for background (moves less → reads as farther away), > 1 for
 * foreground (moves more → reads as closer to the lens). */
export const worldTransform = (cam: CameraState, factor = 1): string => {
  const cx = cam.x * factor;
  const cy = cam.y * factor;
  const zoom = 1 + (cam.zoom - 1) * factor;
  return `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) rotate(${cam.tilt * factor}deg) scale(${zoom}) translate(${-cx}px, ${-cy}px)`;
};

// ---- Element entrance timing (frame each element starts building) --------
export const T = {
  titleFrom: 6,
  titleExit: 58,

  connSirecFabric: { from: 195, duration: 32 },
  sirec: { container: 118, icon: 128, title: 138, subtitle: 152, tag: 166 },

  connFabricMcp: { from: 292, duration: 24 },
  fabric: { container: 226, icon: 238, title: 250, subtitle: 266, tag: 282 },

  connMcpAgents: { from: 363, duration: 30 }, // finishes exactly as the Agents card starts — never a bare line
  mcp: { badge: 300, label: 312 },

  agents: { container: 393, icon: 405, title: 417, subtitle: 432 },
  pills: [
    { from: 452, dx: -220, dy: -60 },
    { from: 462, dx: 0, dy: -110 },
    { from: 472, dx: 220, dy: -60 },
  ],
  // starts a beat after each pill so the connector catches up to an already-settling chip
  pillConnectors: [460, 470, 480],

  ecosystem: {
    aiConnFrom: 496,
    aiNodeFrom: 512,
    gc1ConnFrom: 512,
    gc1NodeFrom: 528,
    gc2ConnFrom: 528,
    gc2NodeFrom: 544,
  },

  concepts: {
    potencia: 546,
    integra: 645,
    orquesta: 728,
  },
} as const;
