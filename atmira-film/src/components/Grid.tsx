import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useGT } from "./Scene";

/** Faint architectural grid that drifts slowly (idle motion for long holds). */
export const Grid: React.FC<{ opacity?: number; ink?: boolean }> = ({ opacity = 0.5, ink = false }) => {
  const gt = useGT();
  const col = ink ? theme.colors.navy : theme.colors.ice;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 180 + 90 - ((gt * 6) % 180)} y1={0} x2={i * 180 + 90 - ((gt * 6) % 180)} y2={1080} stroke={col} strokeOpacity={0.06} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 180} x2={1920} y2={i * 180} stroke={col} strokeOpacity={0.06} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
