import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { Y_TITLE, T } from "./timeline";

/** The opening beat: SIREC Agent Fabric, floating alone in the depth before the
 * camera finds the architecture. A glow disc breathes in first, then the
 * wordmark builds letter-group by letter-group with a blur+rise+scale settle
 * — never a flat fade. */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = spring({ frame: frame - T.titleFrom, fps, config: { damping: 22, mass: 1.2, stiffness: 70 } });

  const exit = interpolate(frame, [T.titleExit, T.titleExit + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const words = ["SIREC", "Agent", "Fabric"];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: Y_TITLE,
        width: "100%",
        transform: `translateY(-50%) translateY(${exit * -30}px) scale(${1 - exit * 0.04})`,
        opacity: 1 - exit,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(glow, [0, 1], [0.6, 1])})`,
          opacity: interpolate(glow, [0, 1], [0, 0.55]),
          background: `radial-gradient(circle, ${COLORS.magenta}22, ${COLORS.turquoise}0D 55%, transparent 72%)`,
          filter: "blur(10px)",
        }}
      />
      <div style={{ display: "flex", gap: 28, position: "relative" }}>
        {words.map((w, i) => {
          const p = spring({
            frame: frame - T.titleFrom - 10 - i * 7,
            fps,
            config: { damping: 18, mass: 0.9, stiffness: 95 },
          });
          const blur = interpolate(p, [0, 1], [18, 0]);
          return (
            <span
              key={w}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 96,
                letterSpacing: -1.5,
                color: i === 2 ? COLORS.turquoise : COLORS.navy,
                opacity: interpolate(p, [0, 1], [0, 1]),
                filter: `blur(${Math.max(0, blur)}px)`,
                transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [1.15, 1])})`,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
