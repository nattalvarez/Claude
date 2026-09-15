import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

export type Level = { n: string; label: string };

type Props = {
  levels: Level[];
  from: number;
  /** frames between each level activating */
  stagger?: number;
  width?: number;
  highlightLastLabel?: string;
};

/** Horizontal evolution stepper: a line fills left-to-right, each step "activates" in turn,
 * the final step blossoms into the highlighted climax pill. */
export const LevelLadder: React.FC<Props> = ({ levels, from, stagger = 16, width = 1500, highlightLastLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const lastIndex = levels.length - 1;
  const fillProgress = interpolate(local, [0, stagger * lastIndex + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const highlightAppear = spring({
    frame: local - stagger * lastIndex - 6,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 110 },
  });

  return (
    <div style={{ position: "relative", width, height: 220 }}>
      {/* track */}
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 22,
          right: 22,
          height: 2,
          background: COLORS.lightBlue,
        }}
      />
      {/* fill */}
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 22,
          width: `calc((100% - 44px) * ${fillProgress})`,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.turquoise})`,
        }}
      />

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between" }}>
        {levels.map((level, i) => {
          const activateAt = i * stagger;
          const appear = spring({ frame: local - activateAt, fps, config: { damping: 16, mass: 0.6, stiffness: 150 } });
          const isLast = i === lastIndex;
          const active = local >= activateAt;
          const pulseRing = interpolate(local - activateAt, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div key={level.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260 }}>
              <div style={{ position: "relative", width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: `1.5px solid ${COLORS.turquoise}`,
                      opacity: (1 - pulseRing) * 0.6,
                      transform: `scale(${1 + pulseRing * 0.8})`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: active ? (isLast ? COLORS.navy : COLORS.blue) : COLORS.lightBlue,
                    transform: `scale(${0.6 + appear * 0.4})`,
                    boxShadow: isLast && active ? `0 0 0 6px rgba(35,52,86,0.12)` : "none",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  opacity: appear,
                  transform: `translateY(${interpolate(appear, [0, 1], [10, 0])}px)`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 15, color: COLORS.turquoise, letterSpacing: 2 }}>
                  {level.n}
                </div>
                <div style={{ fontFamily: FONT_FAMILY, fontWeight: isLast ? 700 : 400, fontSize: 19, color: COLORS.navy, marginTop: 4 }}>
                  {level.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {highlightLastLabel && highlightAppear > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: -78,
            right: 0,
            opacity: highlightAppear,
            transform: `translateY(${interpolate(highlightAppear, [0, 1], [14, 0])}px) scale(${interpolate(
              highlightAppear,
              [0, 1],
              [0.9, 1]
            )})`,
            background: COLORS.navy,
            color: COLORS.white,
            borderRadius: 999,
            padding: "14px 28px",
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: 0.3,
            boxShadow: "0 20px 45px -18px rgba(35,52,86,0.55)",
          }}
        >
          {highlightLastLabel}
        </div>
      )}
    </div>
  );
};
