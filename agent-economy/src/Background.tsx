import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useCam } from "./engine/camera";
import { C } from "./theme";
import { W, H } from "./config";

const MINOR = 54, MAJOR = 216;
const cross = (c: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${MAJOR}' height='${MAJOR}'%3E%3Cpath d='M${MAJOR - 7} ${MAJOR}h14M${MAJOR} ${MAJOR - 7}v14' stroke='${encodeURIComponent(c)}' stroke-width='1.2' fill='none'/%3E%3C/svg%3E")`;

/**
 * Technical stage: soft off-white gradient, a pink glow that drifts across it, and a fine
 * measurement grid (minor/major lines + registration crosses) that slides with the camera.
 * `pink` variant = the same grid in white, used above the pink surface.
 */
export const TechBackground: React.FC<{ variant?: "light" | "pink"; opacity?: number }> = ({ variant = "light", opacity = 1 }) => {
  const f = useCurrentFrame();
  const cam = useCam();
  const px = (-cam.x * 0.06) % MAJOR, py = (cam.z * 0.02) % MAJOR;
  const line = variant === "light" ? "rgba(23,24,27,0.05)" : "rgba(255,255,255,0.16)";
  const lineMajor = variant === "light" ? "rgba(23,24,27,0.085)" : "rgba(255,255,255,0.26)";
  const crossC = variant === "light" ? "rgba(232,31,118,0.55)" : "rgba(255,255,255,0.8)";
  const mask = "radial-gradient(ellipse 75% 70% at 50% 52%, #000 25%, transparent 100%)";
  const gx = 78 + Math.sin(f / 150) * 10, gy = 96 + Math.cos(f / 190) * 6;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {variant === "light" && (
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(232,31,118,0.13), rgba(232,31,118,0) 52%)`,
              `radial-gradient(circle at 6% 4%, rgba(23,24,27,0.05), rgba(23,24,27,0) 45%)`,
              `linear-gradient(165deg, #FFFFFF 0%, ${C.bg} 55%, #ECECEA 100%)`,
            ].join(","),
          }}
        />
      )}
      <AbsoluteFill
        style={{
          backgroundImage: [
            `linear-gradient(to right, ${lineMajor} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${lineMajor} 1px, transparent 1px)`,
            `linear-gradient(to right, ${line} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
            cross(crossC),
          ].join(","),
          backgroundSize: `${MAJOR}px ${MAJOR}px, ${MAJOR}px ${MAJOR}px, ${MINOR}px ${MINOR}px, ${MINOR}px ${MINOR}px, ${MAJOR}px ${MAJOR}px`,
          backgroundPosition: `${px}px ${py}px`,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
    </AbsoluteFill>
  );
};
