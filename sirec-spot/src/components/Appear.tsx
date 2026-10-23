import React from "react";
import { theme } from "../theme";
import { useExit, useGT } from "./Scene";
import { prog } from "../lib/anim";

/** Clean entrance: fade + rise, ease-out only (no blur, no scale pop, no overshoot), landing on a cue. */
export const Appear: React.FC<{
  at: number; x?: number; y?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode;
}> = ({ at, x = 0, y = 36, dur = 0.7, style, children }) => {
  const gt = useGT();
  const p = prog(gt, at - 0.06, dur, theme.ease.out);
  return (
    <div style={{ opacity: Math.min(1, p * 2.2), transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style }}>
      {children}
    </div>
  );
};

/** Scene-level exit (faster than entrances): fade + small lift in the last ~0.26 s before the cut. */
export const ExitWrap: React.FC<{ dur?: number; children: React.ReactNode }> = ({ dur = 0.26, children }) => {
  const ex = useExit(dur);
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - ex, transform: `translateY(${-20 * ex}px)` }}>{children}</div>;
};
