import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./theme";

/**
 * Stage: a calm gradient with one soft pink light drifting in the lower corner, and a fine print
 * halftone that only lives in that corner (it reads as printed texture, not as a UI grid).
 * `pink` variant = the halftone in white, used above the pink surface.
 */
export const TechBackground: React.FC<{ variant?: "light" | "pink"; opacity?: number }> = ({ variant = "light", opacity = 1 }) => {
  const f = useCurrentFrame();
  const gx = 86 + Math.sin(f / 150) * 8, gy = 100 + Math.cos(f / 190) * 5;
  const dot = variant === "light" ? "rgba(232,31,118,0.34)" : "rgba(255,255,255,0.30)";
  const mask = "radial-gradient(circle at 100% 100%, #000 0%, rgba(0,0,0,0.55) 30%, transparent 62%)";
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {variant === "light" && (
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(232,31,118,0.09), rgba(232,31,118,0) 55%)`,
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
    </AbsoluteFill>
  );
};
