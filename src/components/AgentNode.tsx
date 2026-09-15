import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

export type AgentGlyph = "strategy" | "negotiate" | "analyze" | "document" | "judicial" | "supervise";

const Glyph: React.FC<{ type: AgentGlyph; color: string; size: number }> = ({ type, color, size }) => {
  const s = size;
  const common = { stroke: color, strokeWidth: 1.6, fill: "none", strokeLinecap: "round" as const };
  switch (type) {
    case "strategy":
      // three connected nodes — a plan taking shape
      return (
        <g {...common}>
          <circle cx={s * 0.5} cy={s * 0.22} r={s * 0.06} fill={color} stroke="none" />
          <circle cx={s * 0.24} cy={s * 0.72} r={s * 0.06} fill={color} stroke="none" />
          <circle cx={s * 0.76} cy={s * 0.72} r={s * 0.06} fill={color} stroke="none" />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.24} y2={s * 0.72} />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.76} y2={s * 0.72} />
          <line x1={s * 0.24} y1={s * 0.72} x2={s * 0.76} y2={s * 0.72} />
        </g>
      );
    case "negotiate":
      // two overlapping circles — dialogue / agreement
      return (
        <g {...common}>
          <circle cx={s * 0.38} cy={s * 0.5} r={s * 0.24} />
          <circle cx={s * 0.62} cy={s * 0.5} r={s * 0.24} />
        </g>
      );
    case "analyze":
      // concentric rings — evaluation / focus
      return (
        <g {...common}>
          <circle cx={s * 0.5} cy={s * 0.5} r={s * 0.32} />
          <circle cx={s * 0.5} cy={s * 0.5} r={s * 0.16} />
          <circle cx={s * 0.5} cy={s * 0.5} r={s * 0.03} fill={color} stroke="none" />
        </g>
      );
    case "document":
      // module with two lines — structured record
      return (
        <g {...common}>
          <rect x={s * 0.28} y={s * 0.16} width={s * 0.44} height={s * 0.68} rx={s * 0.05} />
          <line x1={s * 0.37} y1={s * 0.4} x2={s * 0.63} y2={s * 0.4} />
          <line x1={s * 0.37} y1={s * 0.56} x2={s * 0.63} y2={s * 0.56} />
        </g>
      );
    case "judicial":
      // balanced line — process / procedure
      return (
        <g {...common}>
          <line x1={s * 0.5} y1={s * 0.18} x2={s * 0.5} y2={s * 0.8} />
          <line x1={s * 0.22} y1={s * 0.32} x2={s * 0.78} y2={s * 0.32} />
          <circle cx={s * 0.22} cy={s * 0.32} r={s * 0.09} />
          <circle cx={s * 0.78} cy={s * 0.32} r={s * 0.09} />
        </g>
      );
    case "supervise":
      // small grid — oversight / control
      return (
        <g {...common} fill={color} stroke="none">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle key={`${row}-${col}`} cx={s * (0.3 + col * 0.2)} cy={s * (0.3 + row * 0.2)} r={s * 0.035} />
            ))
          )}
        </g>
      );
  }
};

type Props = {
  cx: number;
  cy: number;
  r?: number;
  glyph: AgentGlyph;
  label: string;
  from: number;
  color?: string;
  labelBelow?: boolean;
};

export const AgentNode: React.FC<Props> = ({
  cx,
  cy,
  r = 58,
  glyph,
  label,
  from,
  color = COLORS.navy,
  labelBelow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.7, stiffness: 120 } });
  const breathe = 1 + Math.sin((frame - from) / 26) * 0.02 * Math.min(1, appear);
  const scale = appear * breathe;
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`} opacity={opacity}>
      <circle r={r} fill={COLORS.white} stroke={color} strokeWidth={1.4} opacity={0.9} />
      <circle r={r} fill={color} opacity={0.05} />
      <g transform={`translate(${-r * 0.5} ${-r * 0.5})`}>
        <Glyph type={glyph} color={color} size={r} />
      </g>
      {labelBelow && (
        <text
          y={r + 34}
          textAnchor="middle"
          fill={color}
          fontFamily={FONT_FAMILY}
          fontSize={20}
          fontWeight={500}
          letterSpacing={1.2}
        >
          {label.toUpperCase()}
        </text>
      )}
    </g>
  );
};
