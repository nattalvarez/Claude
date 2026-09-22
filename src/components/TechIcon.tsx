import React from "react";
import { COLORS } from "../styles/theme";

export type IconType = "check" | "play" | "doc" | "screen" | "node" | "shield" | "layers" | "cube" | "book";

/** Abstract line-art glyphs — never emoji, never a literal icon-font pack — in the
 * brand's navy/blue/turquoise. Matches the geometric mark language used throughout. */
export const TechIcon: React.FC<{ type: IconType; color?: string; size?: number }> = ({
  type,
  color = COLORS.navy,
  size = 28,
}) => {
  const s = size;
  const common = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case "check":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={s / 2} cy={s / 2} r={s * 0.42} {...common} />
          <path d={`M ${s * 0.32} ${s * 0.52} L ${s * 0.45} ${s * 0.65} L ${s * 0.7} ${s * 0.36}`} {...common} />
        </svg>
      );
    case "play":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={s / 2} cy={s / 2} r={s * 0.42} {...common} />
          <path d={`M ${s * 0.42} ${s * 0.33} L ${s * 0.68} ${s * 0.5} L ${s * 0.42} ${s * 0.67} Z`} fill={color} stroke="none" />
        </svg>
      );
    case "doc":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={s * 0.28} y={s * 0.14} width={s * 0.44} height={s * 0.72} rx={s * 0.05} {...common} />
          <line x1={s * 0.37} y1={s * 0.38} x2={s * 0.63} y2={s * 0.38} {...common} />
          <line x1={s * 0.37} y1={s * 0.52} x2={s * 0.63} y2={s * 0.52} {...common} />
          <line x1={s * 0.37} y1={s * 0.66} x2={s * 0.56} y2={s * 0.66} {...common} />
        </svg>
      );
    case "screen":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={s * 0.14} y={s * 0.22} width={s * 0.72} height={s * 0.5} rx={s * 0.06} {...common} />
          <line x1={s * 0.4} y1={s * 0.84} x2={s * 0.6} y2={s * 0.84} {...common} />
          <line x1={s * 0.5} y1={s * 0.72} x2={s * 0.5} y2={s * 0.84} {...common} />
        </svg>
      );
    case "node":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={s * 0.5} cy={s * 0.22} r={s * 0.07} fill={color} stroke="none" />
          <circle cx={s * 0.26} cy={s * 0.72} r={s * 0.07} fill={color} stroke="none" />
          <circle cx={s * 0.74} cy={s * 0.72} r={s * 0.07} fill={color} stroke="none" />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.26} y2={s * 0.72} {...common} />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.74} y2={s * 0.72} {...common} />
        </svg>
      );
    case "shield":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M ${s * 0.5} ${s * 0.12} L ${s * 0.78} ${s * 0.24} V ${s * 0.5} C ${s * 0.78} ${s * 0.7} ${s * 0.65} ${s * 0.82} ${s * 0.5} ${s * 0.88} C ${s * 0.35} ${s * 0.82} ${s * 0.22} ${s * 0.7} ${s * 0.22} ${s * 0.5} V ${s * 0.24} Z`}
            {...common}
          />
          <path d={`M ${s * 0.38} ${s * 0.5} L ${s * 0.47} ${s * 0.59} L ${s * 0.64} ${s * 0.38}`} {...common} />
        </svg>
      );
    case "layers":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path d={`M ${s * 0.5} ${s * 0.16} L ${s * 0.82} ${s * 0.33} L ${s * 0.5} ${s * 0.5} L ${s * 0.18} ${s * 0.33} Z`} {...common} />
          <path d={`M ${s * 0.18} ${s * 0.5} L ${s * 0.5} ${s * 0.67} L ${s * 0.82} ${s * 0.5}`} {...common} />
          <path d={`M ${s * 0.18} ${s * 0.67} L ${s * 0.5} ${s * 0.84} L ${s * 0.82} ${s * 0.67}`} {...common} />
        </svg>
      );
    case "cube":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path d={`M ${s * 0.5} ${s * 0.12} L ${s * 0.84} ${s * 0.3} V ${s * 0.68} L ${s * 0.5} ${s * 0.88} L ${s * 0.16} ${s * 0.68} V ${s * 0.3} Z`} {...common} />
          <line x1={s * 0.5} y1={s * 0.12} x2={s * 0.5} y2={s * 0.48} {...common} />
          <line x1={s * 0.16} y1={s * 0.3} x2={s * 0.5} y2={s * 0.48} {...common} />
          <line x1={s * 0.84} y1={s * 0.3} x2={s * 0.5} y2={s * 0.48} {...common} />
        </svg>
      );
    case "book":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path d={`M ${s * 0.5} ${s * 0.22} C ${s * 0.4} ${s * 0.14} ${s * 0.26} ${s * 0.14} ${s * 0.18} ${s * 0.18} V ${s * 0.74} C ${s * 0.26} ${s * 0.7} ${s * 0.4} ${s * 0.7} ${s * 0.5} ${s * 0.78}`} {...common} />
          <path d={`M ${s * 0.5} ${s * 0.22} C ${s * 0.6} ${s * 0.14} ${s * 0.74} ${s * 0.14} ${s * 0.82} ${s * 0.18} V ${s * 0.74} C ${s * 0.74} ${s * 0.7} ${s * 0.6} ${s * 0.7} ${s * 0.5} ${s * 0.78}`} {...common} />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.5} y2={s * 0.78} {...common} />
        </svg>
      );
  }
};
