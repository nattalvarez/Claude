import { interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT } from "../styles/theme";

/**
 * SIREC — orchestration hub. SIREC sits at the world origin with nine
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

// A true regular 9-gon — nine channels, 40° apart, all at the same radius
// from SIREC — so the structure reads as symmetric at a glance rather than
// an arrangement traced from a hand-drawn sketch.
const HEX_R = 420;
const hex = (deg: number) => ({
  x: Math.round(HEX_R * Math.cos((deg * Math.PI) / 180)),
  y: Math.round(HEX_R * Math.sin((deg * Math.PI) / 180)),
});

export const SPOKES = {
  seguimiento: hex(300), // upper-right
  prevencion: hex(340), // right, slightly up
  anticipacion: hex(20), // right, slightly down
  selfService: hex(60), // lower-right
  presencial: hex(100), // bottom
  cobranza: hex(140), // lower-left
  amistosa: hex(180), // left
  litigiosa: hex(220), // upper-left
  despachos: hex(260), // top
} as const;

// Pushed further up than before — the wheel now has nine spokes instead of
// six, so the channels nearest the top (seguimiento, despachos) sit closer
// to center than they used to; the fabric layer needs the extra clearance
// so its card never overlaps them once everything is gathered together.
export const AGENT_FABRIC_POS = { x: 0, y: -620 };

export const WORLD_OFFSET = 2400; // keeps every SVG coordinate positive
export const WORLD_SVG_SIZE = 4800;

// ---- Camera keyframes: frame, x, y, zoom, tilt(deg) ------------------------
type CamKey = [number, number, number, number, number];

// Same sweep as the 9-gon itself, starting from seguimiento (300°) and
// continuing forward around the circle in 40° steps — so the wheel visibly
// builds itself in order, not in jumps.
const CHANNEL_ORDER = [
  "seguimiento",
  "prevencion",
  "anticipacion",
  "selfService",
  "presencial",
  "cobranza",
  "amistosa",
  "litigiosa",
  "despachos",
] as const;
export type ChannelKey = (typeof CHANNEL_ORDER)[number];

// One steady, held view for the entire wheel-building section — every
// channel arrives, forms and stays inside this same frame, at the same
// size, with the same importance. Nothing pushes in on one channel at the
// expense of another. Zoomed out further than before (nine channels now
// share the ring instead of six) so nothing clips near the top or bottom.
const HUB_VIEW = { x: 0, y: 0, zoom: 1.0, tilt: 0 };

const HUB_HOLD_START = 300;
const CHANNEL_GAP = 130; // spacing between one channel starting to form and the next
const HUB_HOLD_TAIL = 220; // extra settle time after the last channel before ascending

const HUB_HOLD_END = HUB_HOLD_START + CHANNEL_ORDER.length * CHANNEL_GAP + HUB_HOLD_TAIL;

const CHANNEL_LINE_DURATION: Record<ChannelKey, number> = {
  seguimiento: 26,
  prevencion: 24,
  anticipacion: 26,
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
  [HUB_HOLD_END, HUB_VIEW.x, HUB_VIEW.y, HUB_VIEW.zoom, HUB_VIEW.tilt], // held flat while all nine form, one at a time
];

// ---- Ascend to SIREC Agent Fabric, then gather everything ------------------
const FABRIC_TARGET = { x: 0, y: -420, zoom: 1.35, tilt: 0 };
const FABRIC_PUSH_DUR = 60;
const FABRIC_HOLD_DUR = 140;

const fabricPushStart = HUB_HOLD_END;
const fabricArrive = fabricPushStart + FABRIC_PUSH_DUR;
const fabricHoldEnd = fabricArrive + FABRIC_HOLD_DUR;

CAM.push([fabricArrive, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);
CAM.push([fabricHoldEnd, FABRIC_TARGET.x, FABRIC_TARGET.y, FABRIC_TARGET.zoom, FABRIC_TARGET.tilt]);

// the final, biggest legible view of the whole schema — zoomed out a bit
// further than a six-channel wheel would need, since the ring is wider now
// and the fabric layer sits further above it for clearance
export const FINAL_VIEW = { x: 0, y: -105, zoom: 0.75 };
const GATHER_DUR = 80;
const gatherArrive = fabricHoldEnd + GATHER_DUR;

CAM.push([gatherArrive, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]);

// ---- Outro: hold the full schema, then let it recede while the camera
// settles back onto the exact spot the opening title used — a deliberate
// bookend — for a closing phrase in the same style as the opening one. -----
const SCHEMA_HOLD = 140; // time to admire the full schema before it recedes
const SCHEMA_FADE_DUR = 46;
const OUTRO_START = gatherArrive + SCHEMA_HOLD;

export const OUTRO_VIEW = { x: TITLE_POS.x, y: TITLE_POS.y, zoom: 1.15, tilt: 0 };
const OUTRO_CAM_DUR = 70;
const outroCamArrive = OUTRO_START + OUTRO_CAM_DUR;

CAM.push([OUTRO_START, FINAL_VIEW.x, FINAL_VIEW.y, FINAL_VIEW.zoom, 0]); // hold steady until the schema starts receding
CAM.push([outroCamArrive, OUTRO_VIEW.x, OUTRO_VIEW.y, OUTRO_VIEW.zoom, OUTRO_VIEW.tilt]);

// the whole schema fades away starting here, clearing the stage for the
// closing phrase
export const SCHEMA_FADE = { start: OUTRO_START, duration: SCHEMA_FADE_DUR };

const OUTRO_TEXT_START = OUTRO_START + 24;
const OUTRO_LINE2_GAP = 20;
const OUTRO_LINE3_GAP = 42;
const OUTRO_SETTLE = 34; // time for the last line's spring to visually settle
const OUTRO_HOLD = 170;

export const DURATION_IN_FRAMES = OUTRO_TEXT_START + OUTRO_LINE3_GAP + OUTRO_SETTLE + OUTRO_HOLD;
CAM.push([DURATION_IN_FRAMES, OUTRO_VIEW.x, OUTRO_VIEW.y, OUTRO_VIEW.zoom, OUTRO_VIEW.tilt]);

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

  seguimiento: channelTiming("seguimiento", 0),
  prevencion: channelTiming("prevencion", 1),
  anticipacion: channelTiming("anticipacion", 2),
  selfService: channelTiming("selfService", 3),
  presencial: channelTiming("presencial", 4),
  cobranza: channelTiming("cobranza", 5),
  amistosa: channelTiming("amistosa", 6),
  litigiosa: channelTiming("litigiosa", 7),
  despachos: channelTiming("despachos", 8),

  agentFabric: {
    line: fabricPushStart + 5,
    lineDuration: 45,
    container: fabricPushStart + Math.round(FABRIC_PUSH_DUR * 0.4),
    title: fabricArrive + 10,
    subtitle: fabricArrive + 26,
  },

  outro: {
    line1: OUTRO_TEXT_START,
    line2: OUTRO_TEXT_START + OUTRO_LINE2_GAP,
    line3: OUTRO_TEXT_START + OUTRO_LINE3_GAP,
  },
} as const;
