import React from "react";
import { AbsoluteFill } from "remotion";
import { C, blueA, pinkA } from "./theme";

/**
 * Stage: a calm gradient with one soft pink light drifting in the lower corner, and a fine print
 * halftone that only lives in that corner (it reads as printed texture, not as a UI grid).
 * `pink` variant = the halftone in white, used above the pink surface.
 */
export const TechBackground: React.FC<{ variant?: "light" | "pink"; opacity?: number }> = ({ variant = "light", opacity = 1 }) => {
  const gx = 86, gy = 100; // static on purpose: a drifting gradient makes the encoder flicker/band
  const bx = 96, by = -4;
  const dot = variant === "light" ? "rgba(232,31,118,0.34)" : "rgba(255,255,255,0.30)";
  const mask = "radial-gradient(circle at 100% 100%, #000 0%, rgba(0,0,0,0.55) 30%, transparent 62%)";
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {variant === "light" && (
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(circle at ${gx}% ${gy}%, ${pinkA(0.10)}, ${pinkA(0)} 55%)`,
              `radial-gradient(ellipse 90% 75% at ${bx}% ${by}%, rgba(34,96,158,0.55), ${blueA(0.42)} 38%, ${blueA(0)} 72%)`,
              `radial-gradient(circle at 0% 64%, ${blueA(0.30)}, ${blueA(0)} 52%)`,
              `linear-gradient(165deg, #FFFFFF 0%, ${C.bg} 60%, #F0F0EE 100%)`,
            ].join(","),
          }}
        />
      )}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at center, ${dot} 1.3px, transparent 1.9px)`,
          backgroundSize: "13px 13px",
          backgroundPosition: "0 0",
          WebkitMaskImage: mask,
          maskImage: mask,
          opacity: 0.55,
        }}
      />
      {variant === "light" && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle at center, ${blueA(0.55)} 1.3px, transparent 1.9px)`,
            backgroundSize: "13px 13px",
            WebkitMaskImage: "radial-gradient(circle at 100% 0%, #000 0%, rgba(0,0,0,0.5) 25%, transparent 50%)",
            maskImage: "radial-gradient(circle at 100% 0%, #000 0%, rgba(0,0,0,0.5) 25%, transparent 50%)",
            opacity: 0.5,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
