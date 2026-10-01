import React from "react";
import { AbsoluteFill } from "remotion";
import { C, violetA, pinkA } from "./theme";

/**
 * Stage: a calm gradient with one soft pink light drifting in the lower corner, and a fine print
 * halftone that only lives in that corner (it reads as printed texture, not as a UI grid).
 * `pink` variant = the halftone in white, used above the pink surface.
 */
export const TechBackground: React.FC<{ variant?: "light" | "pink"; opacity?: number }> = ({ variant = "light", opacity = 1 }) => {
  const gx = 80, gy = 98; // static on purpose: a drifting gradient makes the encoder flicker/band
  const bx = 96, by = -4;
  const dot = variant === "light" ? "rgba(232,31,118,0.42)" : "rgba(255,255,255,0.30)";
  const mask = "radial-gradient(circle at 100% 100%, #000 0%, rgba(0,0,0,0.6) 36%, transparent 70%)";
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {variant === "light" && (
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(ellipse 80% 62% at ${gx}% ${gy}%, ${pinkA(0.30)}, ${pinkA(0.14)} 42%, ${pinkA(0)} 74%)`,
              `radial-gradient(circle at 4% 100%, ${pinkA(0.14)}, ${pinkA(0)} 46%)`,
              `radial-gradient(ellipse 70% 52% at ${bx}% ${by}%, ${violetA(0.30)}, ${violetA(0.12)} 45%, ${violetA(0)} 76%)`,
              `linear-gradient(165deg, #FFFFFF 0%, ${C.bg} 60%, #F6F0F3 100%)`,
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
            backgroundImage: `radial-gradient(circle at center, ${violetA(0.55)} 1.3px, transparent 1.9px)`,
            backgroundSize: "13px 13px",
            WebkitMaskImage: "radial-gradient(circle at 100% 0%, #000 0%, rgba(0,0,0,0.5) 20%, transparent 40%)",
            maskImage: "radial-gradient(circle at 100% 0%, #000 0%, rgba(0,0,0,0.5) 20%, transparent 40%)",
            opacity: 0.5,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
