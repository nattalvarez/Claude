import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC — orchestration hub. SIREC sits at the world origin with six
 * management channels close around it, and SIREC Agent Fabric rises just
 * above. The whole wheel is compact by design: every channel stays on
 * screen, at full size, for the rest of the piece once it appears — there
 * is no "visit one, hide the rest" tour. The camera settles into one
 * steady, gently breathing hub view for the build, so nothing is ever
 * pushed toward an edge to make room for a neighbour, then climbs to the
 * Agent Fabric layer and finally pulls back just enough to hold the whole
 * schema at its largest legible size.
 */

export const FPS = 30;

export const CENTER = { x: 0, y: 0 };
export const TITLE_POS = { x: 0, y: -150 };

// A true regular hexagon — six channels, 60° apart, all at the same
// radius from SIREC — so the structure reads as symmetric at a glance
// rather than an arrangement traced from a hand-drawn sketch.
const HEX_R = 300;
const hex = (deg: number) => ({
  x: Math.round(HEX_R * Math.cos((deg * Math.PI) / 180)),
  y: Math.round(HEX_R * Math.sin((deg * Math.PI) / 180)),
});

export const SPOKES = {
  litigiosa: hex(0), // right
  selfService: hex(60), // lower-right
  presencial: hex(120), // lower-left
  despachos: hex(180), // left
  cobranza: hex(240), // upper-left
  amistosa: hex(300), // upper-right
} as const;

export const AGENT_FABRIC_POS = { x: 0, y: -520 };

export const WORLD_OFFSET = 2400; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4800;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) ------------------------
type CamKey = [number, number, number, number, number];

// Same sweep as the hexagon itself, starting from amistosa (300°) and
// continuing forward around the circle — 300°, 0°, 60°, 120°, 180°, 240° —
// so the wheel visibly builds itself in order, not in jumps.
const CHANNEL_ORDER = ["amistosa", "litigiosa", "selfService", "presencial", "despachos", "cobranza"] as const;
export type ChannelKey = (typeof CHANNEL_ORDER)[number];

// One steady, held view for the entire wheel-building section — every
// channel arrives, forms and stays inside this same frame, at the same
// size, with the same importance. Nothing pushes in on one channel at the
// expense of another.
const HUB_VIEW = { x: 0, y: 0, zoom: 1.2, tilt: 0 };

const HUB_HOLD_START = 300;
const CHANNEL_GAP = 130; // spacing between one channel starting to form and the next
const HUB_HOLD_TAIL = 220; // extra settle time after the last channel before ascending

const HUB_HOLD_END = HUB_HOLD_START + CHANNEL_ORDER.length * CHANNEL_GAP + HUB_HOLD_TAIL;

const CHANNEL_LINE_DURATION: Record<ChannelKey, number> = {
  amistosa: 26,
  litigiosa: 24,
  cobranza: 26,
  despachos: 28,
  presencial: 24,
  selfService: 24,
};

const CAM: CamKey[] = [
  [0, 0, -150, 1.1, 0], // intro — title floating just above SIREC's spot
  [80, 0, -150, 1.15, 0], // slow forward creep, long enough to read all 3 lines
  [150, 0, 0, 1.5, 0], // arrive SIREC core
  [240, 0, 0, 1.5, 0], // hold — read "SIREC" before the wheel opens up
  [HUB_HOLD_START, HUB_VIEW.x, HUB_VIEW.y, HUB_VIEW.zoom, HUB_VIEW.tilt], // settle into the hub view
  [HUB_HOLD_END, HUB_VIEW.x, HUB_VIEW.y, HUB_VIEW.zoom, HUB_VIEW.tilt], // held flat while all six form, one at a time
];

// ---- Ascend to SIREC Agent Fabric, then gather everything ------------------
const FABRIC_TARGET = { x: 0, y: -320, zoom: 1.35, tilt: 0 };
const FABRIC_PUSH_DUR = 60;
const FABRIC_HOLD_DUR = 140;

const fabricPushStart = HUB_HOLD_END;
const fabricArrive = fabricPushStart + FABRIC_PUSH_DUR;
const fabricHoldEnd = fabricArrive + FABRIC_HOLD_DUR;

CAM.push([fabricArrive, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);
CAM.push([fabricHoldEnd, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);

// the final, biggest legible view of the whole schema — reachable at a much
// bigger zoom than before because the whole wheel is compact by design
export const FINAL_VIEW = { x: 0, y: -105, zoom: 0.96 };
const GATHER_DUR = 80;
const gatherArrive = fabricHoldEnd + GATHER_DUR;

CAM.push([gatherArrive, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]);

export const DURATION_IN_FRAMES = gatherArrive + 220;
CAM.push([DURATION_IN_FRAMES, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]);

const frames = CAM.map((k) => k[0]);
const xs = CAM.map((k) => k[1]);
const ys = CAM.map((k) => k[2]);
const zooms = CAM.map((k) => k[3]);
const tilts = CAM.map((k) => k[4]);

const inOut = Easing.bezier(0.83, 0, 0.17, 1);

export type CameraState = { x: number; y: number; zoom: number; tilt: number };

const baseCameraAt = (frame: number): CameraState => ({
  x: interpolate(frame, frames, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  y: interpolate(frame, frames, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  zoom: interpolate(frame, frames, zooms, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
  tilt: interpolate(frame, frames, tilts, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
});

/** A small perpetual drift layered on top of the keyframed camera — this is
 * what keeps the camera "always moving" per the brief without ever pushing
 * anything toward an edge, since the drift amplitude is tiny relative to
 * the margins built into HUB_VIEW and FINAL_VIEW. */
export const cameraAt = (frame: number): CameraState => {
  const base = baseCameraAt(frame);
  return {
    x: base.x + Math.sin(frame / 140) * 10,
    y: base.y + Math.cos(frame / 165) * 8,
    zoom: base.zoom + Math.sin(frame / 190) * 0.012,
    tilt: base.tilt,
  };
};

/** Same projection technique as the Agent Fabric piece: world point → screen,
 * with `factor` giving background/foreground layers their own parallax rate. */
export const worldTransform = (cam: CameraState, factor = 1): string => {
  const cx = cam.x * factor;
  const cy = cam.y * factor;
  const zoom = 1 + (cam.zoom - 1) * factor;
  return `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) rotate(${cam.tilt * factor}deg) scale(${zoom}) translate(${-cx}px, ${-cy}px)`;
};

// ---- Element entrance timing (frame each element starts building) ---------
const channelTiming = (key: ChannelKey, index: number) => {
  const start = HUB_HOLD_START + index * CHANNEL_GAP;
  return {
    line: start + 5,
    lineDuration: CHANNEL_LINE_DURATION[key],
    node: start + 35,
    label: start + 46,
  };
};

export const T = {
  title: { line1: 6, line2: 24, line3: 46, exit: 100 },

  sirec: { core: 150, ring: 164, label: 182 },

  amistosa: channelTiming("amistosa", 0),
  litigiosa: channelTiming("litigiosa", 1),
  selfService: channelTiming("selfService", 2),
  presencial: channelTiming("presencial", 3),
  despachos: channelTiming("despachos", 4),
  cobranza: channelTiming("cobranza", 5),

  agentFabric: {
    line: fabricPushStart + 5,
    lineDuration: 45,
    container: fabricPushStart + Math.round(FABRIC_PUSH_DUR * 0.4),
    title: fabricArrive + 10,
    subtitle: fabricArrive + 26,
  },
} as const;
