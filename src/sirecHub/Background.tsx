import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";

/** A dark, corporate-technological atmosphere: a deep navy wash, a faint
 * drifting dot-grid, soft turquoise/magenta color pools, and two large slow
 * orbit rings — never black, never sci-fi, never busy. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const driftA = Math.sin(frame / 500) * 100;
  const driftB = Math.cos(frame / 580) * 120;
  const gridDrift = (frame * 0.05) % 64;
  const ringRotate = frame * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.navyDeep} 0%, ${COLORS.navy} 45%, ${COLORS.navy} 60%, ${COLORS.navyDeep} 100%)`,
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
          background: `radial-gradient(circle, ${COLORS.turquoise}1C, transparent 62%)`,
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
          background: `radial-gradient(circle, ${COLORS.magenta}16, transparent 65%)`,
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
          background: `radial-gradient(circle, ${COLORS.blue}14, transparent 70%)`,
        }}
      />

      {/* faint drifting dot-grid — the only "technological lines" texture */}
      <div
        style={{
          position: "absolute",
          inset: -64,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.5) 1.2px, transparent 1.2px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${gridDrift}px ${gridDrift * 0.6}px`,
          opacity: 0.05,
          maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black 22%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black 22%, transparent 78%)",
        }}
      />

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
        <g transform={`translate(${WIDTH * 0.84} ${HEIGHT * 0.18}) rotate(${ringRotate})`}>
          <ellipse rx={560} ry={250} stroke={COLORS.turquoise} strokeWidth={1.2} fill="none" />
          <ellipse rx={560} ry={250} stroke={COLORS.magenta} strokeWidth={1.2} fill="none" transform="rotate(64)" />
          <circle cx={560} cy={0} r={4} fill={COLORS.turquoise} />
        </g>
        <g transform={`translate(${WIDTH * 0.12} ${HEIGHT * 0.88}) rotate(${-ringRotate * 0.7})`}>
          <ellipse rx={420} ry={190} stroke={COLORS.blue} strokeWidth={1} fill="none" />
          <circle cx={0} cy={-190} r={3.2} fill={COLORS.magenta} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
