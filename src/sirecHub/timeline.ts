import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC — orchestration hub. SIREC sits at the world origin; six management
 * channels radiate from it like spokes, and SIREC Agent Fabric rises on a
 * separate vertical axis above it. The camera visits each spoke in turn —
 * push toward it, hold long enough for its name to form and be read, then
 * return to SIREC before pushing out again — before climbing to the Agent
 * Fabric layer and finally gathering everything into one large, held final
 * shot.
 */

export const FPS = 30;

export const CENTER = { x: 0, y: 0 };
export const TITLE_POS = { x: 0, y: -150 };
// a quiet gap on the vertical spine between SIREC's subtitle and the
// presencial spoke — the one place in the gathered schema with room for a
// closing line without colliding with anything else.
export const FINAL_TAGLINE_POS = { x: 0, y: 210 };

export const SPOKES = {
  amistosa: { x: 420, y: -420 }, // upper-right
  litigiosa: { x: 600, y: -30 }, // right
  cobranza: { x: 240, y: -580 }, // up, tilted off the vertical axis
  despachos: { x: -600, y: -30 }, // left
  presencial: { x: -30, y: 560 }, // down
  selfService: { x: 420, y: 440 }, // down-right
} as const;

export const AGENT_FABRIC_POS = { x: 0, y: -780 };

export const WORLD_OFFSET = 2400; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4800;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) ------------------------
type CamKey = [number, number, number, number, number];
type CamState = { x: number; y: number; zoom: number; tilt: number };

const CENTER_STATE: CamState = { x: 0, y: 0, zoom: 1.1, tilt: 0 };

const CHANNEL_ORDER = ["amistosa", "litigiosa", "cobranza", "despachos", "presencial", "selfService"] as const;
export type ChannelKey = (typeof CHANNEL_ORDER)[number];

// The camera target while each channel is the one being read — reused as-is
// from a version already verified frame-by-frame to frame that channel's own
// label without clipping.
const CHANNEL_TARGET: Record<ChannelKey, CamState> = {
  amistosa: { x: 30, y: -30, zoom: 1.4, tilt: -1 },
  litigiosa: { x: 40, y: -14, zoom: 1.35, tilt: 1 },
  cobranza: { x: 180, y: -500, zoom: 1.3, tilt: 0 },
  despachos: { x: -30, y: -14, zoom: 1.25, tilt: 1 },
  presencial: { x: 0, y: 300, zoom: 1.15, tilt: 0 },
  selfService: { x: 180, y: 190, zoom: 1.2, tilt: -1 },
};

const CHANNEL_LINE_DURATION: Record<ChannelKey, number> = {
  amistosa: 26,
  litigiosa: 24,
  cobranza: 26,
  despachos: 30,
  presencial: 24,
  selfService: 24,
};

// One push-out/hold/return-to-SIREC cycle per channel — this is the beat
// the camera repeats six times: arrive, let the name form and be read, then
// travel back to SIREC before pulling out toward the next one.
const PUSH_DUR = 55;
const HOLD_DUR = 65;
const RETURN_DUR = 45;
const PAUSE_DUR = 15;
const CHANNEL_CYCLE = PUSH_DUR + HOLD_DUR + RETURN_DUR + PAUSE_DUR;

type ChannelPhase = {
  index: number;
  pushStart: number;
  arrive: number;
  holdEnd: number;
  returnEnd: number;
  pauseEnd: number;
};

const CAM: CamKey[] = [
  [0, 0, -150, 1.1, 0], // intro — title floating just above SIREC's spot
  [70, 0, -150, 1.15, 0], // slow forward creep, long enough to read all 3 lines
  [130, 0, 0, 1.5, 0], // arrive SIREC core
  [250, 0, 0, 1.5, 0], // hold — read "SIREC" before the first connection
];

const CHANNEL_PHASE: Record<ChannelKey, ChannelPhase> = {} as Record<ChannelKey, ChannelPhase>;

let cursor = 250;
CHANNEL_ORDER.forEach((key, index) => {
  const target = CHANNEL_TARGET[key];
  const pushStart = cursor;
  const arrive = pushStart + PUSH_DUR;
  const holdEnd = arrive + HOLD_DUR;
  const returnEnd = holdEnd + RETURN_DUR;
  const pauseEnd = returnEnd + PAUSE_DUR;

  CAM.push([arrive, target.x, target.y, target.zoom, target.tilt]);
  CAM.push([holdEnd, target.x, target.y, target.zoom, target.tilt]);
  CAM.push([returnEnd, CENTER_STATE.x, CENTER_STATE.y, CENTER_STATE.zoom, CENTER_STATE.tilt]);
  CAM.push([pauseEnd, CENTER_STATE.x, CENTER_STATE.y, CENTER_STATE.zoom, CENTER_STATE.tilt]);

  CHANNEL_PHASE[key] = { index, pushStart, arrive, holdEnd, returnEnd, pauseEnd };
  cursor = pauseEnd;
});

// ---- Ascend to SIREC Agent Fabric, then gather everything ------------------
const FABRIC_TARGET: CamState = { x: 0, y: -530, zoom: 1.35, tilt: 0 };
const FABRIC_PUSH_DUR = 65;
const FABRIC_HOLD_DUR = 110;

const fabricPushStart = cursor;
const fabricArrive = fabricPushStart + FABRIC_PUSH_DUR;
const fabricHoldEnd = fabricArrive + FABRIC_HOLD_DUR;

CAM.push([fabricArrive, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);
CAM.push([fabricHoldEnd, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);

// the final, biggest legible view of the whole schema
export const FINAL_VIEW = { x: 0, y: -100, zoom: 0.65 };
const GATHER_DUR = 90;
const gatherArrive = fabricHoldEnd + GATHER_DUR;

CAM.push([gatherArrive, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]);

export const DURATION_IN_FRAMES = gatherArrive + 170;
CAM.push([DURATION_IN_FRAMES, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]);

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

/** A channel recedes only while the camera is tightly pushed onto a LATER
 * channel (where it would otherwise clip at the frame edge), fading out over
 * that push and back in over that channel's return to SIREC. Once every
 * channel has had its turn, nothing blocks anything else — which is exactly
 * the "gather" moment for the final view. */
export const channelVisibility = (frame: number, key: ChannelKey): number => {
  const mine = CHANNEL_PHASE[key];
  let visibility = 1;
  for (const otherKey of CHANNEL_ORDER) {
    const other = CHANNEL_PHASE[otherKey];
    if (other.index <= mine.index) continue;
    const dip = interpolate(frame, [other.pushStart, other.arrive, other.holdEnd, other.returnEnd], [1, 0, 0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    visibility = Math.min(visibility, dip);
  }
  return visibility;
};

// ---- Element entrance timing (frame each element starts building) ---------
const channelTiming = (key: ChannelKey) => {
  const phase = CHANNEL_PHASE[key];
  return {
    line: phase.pushStart + 5,
    lineDuration: CHANNEL_LINE_DURATION[key],
    node: phase.arrive - 10,
    label: phase.arrive,
    focusStart: phase.pushStart,
    focusEnd: phase.holdEnd,
  };
};

export const T = {
  title: { line1: 6, line2: 24, line3: 46, exit: 100 },

  sirec: { core: 130, ring: 144, label: 162 },

  amistosa: channelTiming("amistosa"),
  litigiosa: channelTiming("litigiosa"),
  cobranza: {
    ...channelTiming("cobranza"),
    satellites: [
      channelTiming("cobranza").node + 22,
      channelTiming("cobranza").node + 30,
      channelTiming("cobranza").node + 38,
    ] as readonly number[],
  },
  despachos: channelTiming("despachos"),
  presencial: channelTiming("presencial"),
  selfService: channelTiming("selfService"),

  agentFabric: {
    line: fabricPushStart + 5,
    lineDuration: 50,
    container: fabricPushStart + Math.round(FABRIC_PUSH_DUR * 0.4),
    title: fabricArrive + 10,
    subtitle: fabricArrive + 26,
  },

  finalTagline: gatherArrive + 40,
} as const;
