import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";

/** A bright, corporate-technological atmosphere: a white base, soft
 * turquoise color pools, a faint drifting dot-grid, and two large slow
 * orbit rings — clean and airy, never busy, never sci-fi. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const driftA = Math.sin(frame / 500) * 100;
  const driftB = Math.cos(frame / 580) * 120;
  const gridDrift = (frame * 0.05) % 64;
  const ringRotate = frame * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.lightBlue} 0%, ${COLORS.white} 45%, ${COLORS.white} 60%, ${COLORS.lightBlue} 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          borderRadius: "50%",
          top: -650,
          left: -450 + driftA,
          filter: "blur(150px)",
          background: `radial-gradient(circle, ${COLORS.turquoise}26, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          bottom: -560,
          right: -380 - driftB,
          filter: "blur(160px)",
          background: `radial-gradient(circle, ${COLORS.blue}1A, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(170px)",
          background: `radial-gradient(circle, ${COLORS.turquoise}18, transparent 70%)`,
        }}
      />

      {/* faint drifting dot-grid — the only "technological lines" texture */}
      <div
        style={{
          position: "absolute",
          inset: -64,
          backgroundImage: `radial-gradient(${COLORS.navy} 1.2px, transparent 1.2px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${gridDrift}px ${gridDrift * 0.6}px`,
          opacity: 0.06,
          maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black 22%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black 22%, transparent 78%)",
        }}
      />

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, opacity: 0.16 }}>
        <g transform={`translate(${WIDTH * 0.84} ${HEIGHT * 0.18}) rotate(${ringRotate})`}>
          <ellipse rx={560} ry={250} stroke={COLORS.turquoise} strokeWidth={1.2} fill="none" />
          <ellipse rx={560} ry={250} stroke={COLORS.blue} strokeWidth={1.2} fill="none" transform="rotate(64)" />
          <circle cx={560} cy={0} r={4} fill={COLORS.turquoise} />
        </g>
        <g transform={`translate(${WIDTH * 0.12} ${HEIGHT * 0.88}) rotate(${-ringRotate * 0.7})`}>
          <ellipse rx={420} ry={190} stroke={COLORS.blue} strokeWidth={1} fill="none" />
          <circle cx={0} cy={-190} r={3.2} fill={COLORS.turquoise} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
