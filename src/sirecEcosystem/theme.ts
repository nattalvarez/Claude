import { Easing } from "remotion";
import { loadRobotoLocally } from "../shared/loadRobotoLocally";

loadRobotoLocally(["latin"]);

export const FONT = "Roboto";

export const COLORS = {
  white: "#FFFFFF",
  navy: "#233456",
  blue: "#3365A2",
  turquoise: "#2ABBCE",
  lightBlue: "#DDE7F4",
  navySoft: "rgba(35, 52, 86, 0.68)",
  navyFaint: "rgba(35, 52, 86, 0.14)",
  navyHair: "rgba(35, 52, 86, 0.08)",
  shadow: "rgba(35, 52, 86, 0.20)",
  shadowSoft: "rgba(35, 52, 86, 0.10)",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Cubic-bezier curves — every interpolate in this composition uses one of
// these, never linear.
export const EASE = {
  standard: Easing.bezier(0.22, 1, 0.36, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const SPRING = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  smooth: { damping: 20, stiffness: 90, mass: 1 },
  gentle: { damping: 24, stiffness: 68, mass: 1.15 },
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
} as const;

// Lighten (amt > 0, toward white) or darken (amt < 0, toward black) a hex
// color — used to fake per-face lighting on the 3D primitives.
export const shade = (hex: string, amt: number): string => {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mix = (v: number) => (amt >= 0 ? Math.round(v + (255 - v) * amt) : Math.round(v * (1 + amt)));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

export const alpha = (hex: string, a: number): string => {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
