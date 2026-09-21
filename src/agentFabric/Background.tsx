import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";

/** A richer atmosphere behind the architecture: a soft color wash, a faint
 * drifting dot-grid for texture, and a couple of large, slow orbit rings
 * echoing the Agent Fabric mark — all screen-space, all far enough under
 * the content to read as depth rather than decoration. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const driftA = Math.sin(frame / 480) * 90;
  const driftB = Math.cos(frame / 560) * 110;
  const driftC = Math.sin(frame / 640 + 1.1) * 70;
  const gridDrift = (frame * 0.06) % 64;
  const ringRotate = frame * 0.018;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.offWhite }}>
      {/* base wash — a touch of directional light, not a flat fill */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(155deg, ${COLORS.lightBlue}55 0%, ${COLORS.offWhite} 38%, ${COLORS.offWhite} 62%, ${COLORS.lightBlue}40 100%)`,
        }}
      />

      {/* soft color blobs, three depths */}
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          top: -600,
          left: -420 + driftA,
          filter: "blur(130px)",
          background: `radial-gradient(circle, ${COLORS.blue}14, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          bottom: -520,
          right: -340 - driftB,
          filter: "blur(140px)",
          background: `radial-gradient(circle, ${COLORS.turquoise}10, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          top: "42%",
          left: "58%",
          transform: `translate(-50%, -50%) translateX(${driftC}px)`,
          filter: "blur(150px)",
          background: `radial-gradient(circle, ${COLORS.navy}09, transparent 70%)`,
        }}
      />

      {/* faint drifting dot-grid — the piece's one "technological lines" cue */}
      <div
        style={{
          position: "absolute",
          inset: -64,
          backgroundImage: `radial-gradient(${COLORS.blue}30 1.4px, transparent 1.4px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${gridDrift}px ${gridDrift * 0.6}px`,
          opacity: 0.5,
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 25%, transparent 78%)",
        }}
      />

      {/* two large, slow orbit rings — an echo of the Agent Fabric mark, tucked
          into a back corner so it reads as atmosphere, not a diagram */}
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0, opacity: 0.16 }}
      >
        <g transform={`translate(${WIDTH * 0.86} ${HEIGHT * 0.16}) rotate(${ringRotate})`}>
          <ellipse rx={520} ry={230} stroke={COLORS.blue} strokeWidth={1.2} fill="none" />
          <ellipse rx={520} ry={230} stroke={COLORS.turquoise} strokeWidth={1.2} fill="none" transform="rotate(64)" />
          <circle cx={520} cy={0} r={4} fill={COLORS.turquoise} />
        </g>
        <g transform={`translate(${WIDTH * 0.1} ${HEIGHT * 0.9}) rotate(${-ringRotate * 0.7})`}>
          <ellipse rx={380} ry={170} stroke={COLORS.navy} strokeWidth={1} fill="none" />
          <circle cx={0} cy={-170} r={3.2} fill={COLORS.blue} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
