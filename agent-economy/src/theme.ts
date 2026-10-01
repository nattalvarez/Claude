import { Easing } from "remotion";

// One theme object. No hex / easing / font is inlined anywhere else.
export const C = {
  pink: "#E81F76", // corporate accent — EXACT
  blue: "#59ABDF", // secondary brand colour — used only in background gradients
  white: "#FFFFFF",
  bg: "#F7F7F5", // off-white stage
  g100: "#F0F0EE",
  g200: "#E4E4E1",
  g300: "#D0D0CD",
  g400: "#ADADAA",
  g500: "#7D7D7B",
  g600: "#55555A",
  ink: "#17181B",
  /** text-only greys: dark enough to stay crisp over the gradient (≥ 7:1 on the stage) */
  text2: "#34353A",
  text3: "#4B4C52",
} as const;

/** Same pink at a given opacity (never another pink). */
export const blueA = (a: number) => `rgba(89,171,223,${a})`;
/** the blue leaning towards violet (background light only) */
export const violetA = (a: number) => `rgba(112,118,224,${a})`;
export const pinkA = (a: number) => `rgba(232,31,118,${a})`;
export const inkA = (a: number) => `rgba(23,24,27,${a})`;
export const whiteA = (a: number) => `rgba(255,255,255,${a})`;

export const FONT = "Roboto, sans-serif";
export const WEIGHT = { light: 300, regular: 400, medium: 500, bold: 700 } as const;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // entrances (expo-out feel, no overshoot)
  soft: Easing.bezier(0.22, 1, 0.36, 1),
  text: Easing.bezier(0.2, 0.85, 0.3, 1), // type: decisive arrival, short tail
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  cam: Easing.bezier(0.5, 0, 0.18, 1), // virtual camera moves: gentle start, long settle
  drift: Easing.bezier(0.37, 0, 0.63, 1), // slow push-ins
  in: Easing.bezier(0.55, 0, 0.9, 0.6), // exits only
};

// Safe areas (px). Nothing important crosses these.
export const SAFE = { x: 160, top: 120, bottom: 120 } as const;
