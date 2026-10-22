import { Easing } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 15 frames
export const BAR = BEAT * 4; // 60 frames

export const theme = {
  colors: {
    bg: "#0B0709",
    bgAlt: "#160B13",
    hero: "#E6007E", // Atmira magenta — the single hero colour
    heroDeep: "#7A0045",
    heroSoft: "#FF5CAE",
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.62)",
    textFaint: "rgba(255,255,255,0.28)",
    line: "rgba(255,255,255,0.16)",
    light: "#FFFFFF",
    lightAlt: "#F5F1F4",
    ink: "#111111",
    inkDim: "#5B5560",
    inkLine: "rgba(17,17,17,0.14)",
  },
  fonts: {
    display: "'Bricolage', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Instrument Serif', Georgia, serif",
    body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slam: { damping: 18, stiffness: 260, mass: 0.7 },
  },
} as const;

// Scene timeline lives in timeline.json (shared with the audio script), frames @30fps.
import timeline from "./timeline.json";

export const SCENES = timeline.scenes;
export const TOTAL = timeline.total;
