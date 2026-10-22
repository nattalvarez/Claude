import React from "react";
import { theme } from "../theme";
import { useExit, useGT } from "./Scene";
import { lerp, spr } from "../lib/anim";

/** Premium entrance: opacity + translate + scale + blur-in, landing on a cue. */
export const Appear: React.FC<{
  at: number; x?: number; y?: number; from?: number; blur?: number; config?: Record<string, number>;
  style?: React.CSSProperties; children: React.ReactNode;
}> = ({ at, x = 0, y = 40, from = 0.95, blur = 10, config = theme.spring.smooth, style, children }) => {
  const gt = useGT();
  const p = spr(gt, at, config, 2);
  return (
    <div style={{ opacity: Math.min(1, p * 1.6), transform: `translate(${lerp(p, x, 0)}px, ${lerp(p, y, 0)}px) scale(${lerp(p, from, 1)})`, filter: blur ? `blur(${lerp(Math.min(1, p), blur, 0)}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

/** Scene-level exit (faster than entrances): fade + lift in the last ~0.28 s before the cut. */
export const ExitWrap: React.FC<{ dur?: number; children: React.ReactNode }> = ({ dur = 0.28, children }) => {
  const ex = useExit(dur);
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - ex, transform: `translateY(${-24 * ex}px) scale(${1 + ex * 0.015})`, filter: `blur(${ex * 6}px)` }}>{children}</div>;
};
