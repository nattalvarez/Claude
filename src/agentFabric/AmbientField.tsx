import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";
import { seededRange } from "../lib/random";
import { Y_TITLE, Y_AGENTS } from "./timeline";

/** A handful of soft particles and thin lines drifting through the full
 * vertical span of the world — kept deliberately sparse (the brief is
 * explicit: "no debe haber demasiados elementos"). Lives in the background
 * depth layer, so it moves less than the architecture as the camera travels. */
export const AmbientField: React.FC = () => {
  const frame = useCurrentFrame();

  const dots = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        x: seededRange(`af-x-${i}`, -700, 700),
        y: seededRange(`af-y-${i}`, Y_AGENTS - 200, Y_TITLE + 200),
        size: seededRange(`af-sz-${i}`, 3, 7),
        speed: seededRange(`af-sp-${i}`, 0.15, 0.4),
        phase: seededRange(`af-ph-${i}`, 0, Math.PI * 2),
        color: i % 3 === 0 ? COLORS.turquoise : i % 3 === 1 ? COLORS.magenta : COLORS.blue,
      })),
    []
  );

  return (
    <>
      {dots.map((d) => {
        const drift = Math.sin(frame / 90 + d.phase) * 26 * d.speed * 6;
        return (
          <div
            key={d.id}
            style={{
              position: "absolute",
              left: d.x + drift,
              top: d.y,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: d.color,
              opacity: 0.22,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
      {/* two very soft depth blobs, purely atmospheric */}
      <div
        style={{
          position: "absolute",
          left: -420,
          top: Y_AGENTS - 260,
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.magenta}14, transparent 65%)`,
          filter: "blur(60px)",
          opacity: interpolate(frame, [380, 480], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 380,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.turquoise}12, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />
    </>
  );
};
