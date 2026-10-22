import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { FPS } from "../timing";
import { lerp, prog } from "../lib/anim";

const c = theme.colors;
export type WipeKind = "bars" | "iris" | "slats" | "flash";

/** Transition overlay centred on a cut (cut hidden at the midpoint, bass-hit lands there). */
export const Wipe: React.FC<{ at: number; kind: WipeKind; dur?: number; color?: string }> = ({ at, kind, dur = 0.5, color = c.blue }) => {
  const gt = useCurrentFrame() / FPS;
  const h = dur / 2;
  if (gt < at - h - 0.05 || gt > at + h + 0.1) return null;
  const E = theme.ease.inOut;

  if (kind === "bars") {
    const cols = [c.turq, c.ice, c.blue, c.navy];
    return (
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        {cols.map((col, k) => {
          const pin = prog(gt, at - h + k * 0.035, h * 0.95, E);
          const pout = prog(gt, at + k * 0.035, h * 0.95, E);
          const x = lerp(pin, -125, 0) + lerp(pout, 0, 125);
          return <div key={k} style={{ position: "absolute", top: 0, bottom: 0, left: "-12%", width: "124%", background: col, transform: `translateX(${x}%) skewX(-14deg)` }} />;
        })}
      </AbsoluteFill>
    );
  }
  if (kind === "iris") {
    const pin = prog(gt, at - h, h, E);
    const pout = prog(gt, at, h, E);
    const R = pout > 0 ? lerp(pout, 1800, 0) : lerp(pin, 0, 1800);
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <AbsoluteFill style={{ background: color, clipPath: `circle(${R}px at ${pout > 0 ? 50 : 50}% 54%)` }} />
        <AbsoluteFill style={{ border: `0 solid ${c.turq}`, clipPath: `circle(${Math.max(0, R - 26)}px at 50% 54%)`, background: c.navy, opacity: 0.9 }} />
      </AbsoluteFill>
    );
  }
  if (kind === "slats") {
    const n = 8;
    return (
      <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: n }).map((_, k) => {
          const pin = prog(gt, at - h + k * 0.022, h * 0.9, E);
          const pout = prog(gt, at + k * 0.022, h * 0.9, E);
          const sy = pout > 0 ? 1 - pout : pin;
          return (
            <div key={k} style={{ position: "absolute", top: 0, bottom: 0, left: `${(k * 100) / n - 0.1}%`, width: `${100 / n + 0.3}%`, background: k % 3 === 1 ? c.turq : k % 3 === 0 ? c.navy : c.blue, transform: `scaleY(${sy})`, transformOrigin: pout > 0 ? "50% 100%" : "50% 0%" }} />
          );
        })}
      </AbsoluteFill>
    );
  }
  // flash
  const a = prog(gt, at - h * 0.8, h * 0.8, theme.ease.in) * (1 - prog(gt, at + 0.02, h * 1.3, theme.ease.out));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #fff 0%, ${c.ice} 55%, ${c.turq} 130%)` }} />
    </AbsoluteFill>
  );
};
