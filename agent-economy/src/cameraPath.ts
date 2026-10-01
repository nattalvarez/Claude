import { CamKey, sampleCamera, unproject, Cam } from "./engine/camera";
import { Vec3 } from "./engine/math";
import { ease } from "./theme";
import { SC } from "./config";
import { X } from "./world/layout";

export const CAM_KEYS: CamKey[] = [
  // S1 — locked wide, then an almost imperceptible push-in
  { f: 0, x: -640, y: 540, z: -1520, pitch: 0.29, yaw: 0 },
  { f: 180, x: -590, y: 520, z: -1400, pitch: 0.28, ease: ease.drift },
  // S2 — travel right, reveal the insurer, settle wide
  { f: 330, x: 30, y: 650, z: -1580, pitch: 0.33 },
  { f: 372, x: 30, y: 650, z: -1580, pitch: 0.33 },
  // S3 — crane up & pull out: the system gains a dimension
  { f: 470, x: 470, y: 700, z: -1900, pitch: 0.31 },
  { f: 552, x: 470, y: 700, z: -1900, pitch: 0.31 },
  // S4 — travelling: A → B → C, each a stable stop
  { f: 590, x: X.A - 130, y: 600, z: -1500, pitch: 0.3 },
  { f: 632, x: X.A - 130, y: 600, z: -1500, pitch: 0.3 },
  { f: 660, x: X.B - 130, y: 600, z: -1500, pitch: 0.3 },
  { f: 700, x: X.B - 130, y: 600, z: -1500, pitch: 0.3 },
  { f: 724, x: X.C - 130, y: 600, z: -1500, pitch: 0.3 },
  { f: 805, x: X.C - 130, y: 600, z: -1500, pitch: 0.3 },
  // S5 — pull-out: the whole system, then a slow drift
  { f: 862, x: 1300, y: 950, z: -3500, pitch: 0.27 },
  { f: 940, x: 1380, y: 940, z: -3380, pitch: 0.27, ease: ease.drift },
  // S6 — the partial structure, then each question gets its own stop
  { f: 990, x: X.ghost + 100, y: 700, z: -2100, pitch: 0.36 },
  { f: 1012, x: X.q1 - 160, y: 560, z: -1500, pitch: 0.3 },
  { f: 1050, x: X.q1 - 160, y: 560, z: -1500, pitch: 0.3 },
  { f: 1066, x: X.q2 - 290, y: 560, z: -1500, pitch: 0.3 },
  { f: 1104, x: X.q2 - 290, y: 560, z: -1500, pitch: 0.3 },
  { f: 1118, x: X.q3 - 290, y: 560, z: -1500, pitch: 0.3 },
  { f: 1165, x: X.q3 - 290, y: 560, z: -1500, pitch: 0.3 },
  // S7 — low, side-on, tracking with the stream through the lens
  { f: 1214, x: X.gate - 950, y: 330, z: -1250, pitch: 0.09 },
  { f: 1300, x: X.gate + 380, y: 330, z: -1250, pitch: 0.09, ease: ease.drift },
  // S8 — calm lattice, then push-in on the one that matters
  { f: 1334, x: X.crit - 300, y: 520, z: -1450, pitch: 0.3 },
  { f: 1346, x: X.crit - 300, y: 520, z: -1450, pitch: 0.3 },
  { f: 1388, x: X.crit + 20, y: 300, z: -820, pitch: 0.2 },
  // S9 — analytic: slow approach
  { f: 1418, x: X.data - 250, y: 560, z: -1800, pitch: 0.27 },
  { f: 1498, x: X.data - 140, y: 540, z: -1480, pitch: 0.26, ease: ease.drift },
  // S10 — almost still
  { f: 1520, x: X.trust - 300, y: 400, z: -1800, pitch: 0.2 },
  { f: 1600, x: X.trust - 270, y: 395, z: -1740, pitch: 0.2, ease: ease.drift },
  // S11 — crane up & out: the line of four turns out to be a field
  { f: 1650, x: X.trust + 40, y: 800, z: -2250, pitch: 0.3 },
  { f: 1738, x: X.trust + 70, y: 820, z: -2150, pitch: 0.3, ease: ease.drift },
  // S12 — the big pull-out
  { f: 1818, x: X.trust - 540, y: 1250, z: -3100, pitch: 0.45 },
  { f: 1875, x: X.trust - 540, y: 1250, z: -3100, pitch: 0.45 },
  // S13 — slow retreat, stage almost empty
  { f: 2055, x: X.trust - 540, y: 1400, z: -3500, pitch: 0.45, ease: ease.drift },
];

/**
 * Pin a world-space text plane so that, while the camera rests at `frame`,
 * its top-left corner sits at screen (sx, sy) at view-depth `depth`.
 * (Text stays genuinely in the world: later camera moves give it parallax.)
 */
export const anchorAt = (frame: number, sx: number, sy: number, depth: number): Vec3 =>
  unproject(sx, sy, depth, sampleCamera(CAM_KEYS, frame) as Cam);
