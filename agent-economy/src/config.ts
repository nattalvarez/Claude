// Single source of truth for format, timeline and brand switches.
export const FPS = 30;
export const W = 1080;
export const H = 1080; // square master (1080×1080)

/** Seconds → frames (all timing derives from FPS). */
export const sec = (s: number) => Math.round(s * FPS);

// Narrative timeline (frames). Contiguous; every scene owns its range but the
// camera, floor and elements flow across the boundaries (no hard cuts).
export const SC = {
  s01: [0, 210],      // conversación
  s02: [210, 375],    // cliente · mediador · aseguradora
  s03: [375, 555],    // llegan los agentes
  s04: [555, 805],    // comparan · cotizan · contratan
  s05: [805, 925],    // Agent Economy
  s06: [925, 1165],   // reglas por escribir + 3 preguntas
  s07: [1165, 1300],  // el precio
  s08: [1300, 1400],  // el criterio
  s09: [1400, 1500],  // el dato
  s10: [1500, 1600],  // la confianza
  s11: [1600, 1740],  // el primer paso
  s12: [1740, 1875],  // clímax
  s13: [1875, 2055],  // cierre
} as const;

export const DURATION = SC.s13[1]; // 2055f ≈ 68.5 s

/**
 * Logo: drop the brand file in /public (e.g. public/logo.svg) and set it here.
 * `aspect` = width / height of the file so proportions are always preserved.
 * Left null → the closing keeps the clear-space reserved and no mark is drawn
 * (the repo ships without a logo file; nothing is invented).
 */
export const LOGO: { file: string; aspect: number } | null = { file: "logo.png", aspect: 1550 / 436 }; // file lives in /public

/** Sound design lives in src/audio/cues.ts; flip to render a silent master. */
export const SOUND_ENABLED = true;
