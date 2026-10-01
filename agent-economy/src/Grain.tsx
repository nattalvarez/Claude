import React from "react";
import { AbsoluteFill } from "remotion";

// A whisper of paper grain on the off-white stage only (it sits *under* the
// pink surface, so the brand colour is never altered).
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => (
  <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "260px", opacity: 0.04, mixBlendMode: "multiply", pointerEvents: "none" }} />
);
