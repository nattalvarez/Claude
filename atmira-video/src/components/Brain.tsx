import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { font } from "./Type";

/** Un epígrafe del Digital Brain: titular en magenta + descripción. Entra con 3 propiedades a la vez. */
export const BrainItem: React.FC<{
  h: string;
  d: string;
  start: number;
  dark?: boolean;
  hSize?: number;
  dSize?: number;
  hWeight?: number;
  hColor?: string;
  noDesc?: boolean;
  style?: React.CSSProperties;
}> = ({ h, d, start, dark = false, hSize = 22, dSize = 19, hWeight = 500, hColor, noDesc = false, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 24, EASE.out);
  return (
    <div style={{ opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 18}px)`, filter: `blur(${(1 - p) * 4}px)`, ...style }}>
      <div style={{ ...font(hSize, hWeight, { color: hColor ?? (dark ? "#FF4DA6" : C.magenta), letterSpacing: "-0.005em", lineHeight: 1.18 }) }}>{h}</div>
      {!noDesc && <div style={{ marginTop: 7, ...font(dSize, 400, { color: dark ? "rgba(255,255,255,0.86)" : C.ink2, letterSpacing: 0, lineHeight: 1.34 }) }}>{d}</div>}
    </div>
  );
};
