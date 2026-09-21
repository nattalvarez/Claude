import React from "react";

type MarkProps = { size?: number; color?: string };

/** Abstract, geometric glyphs for each channel — no literal handshakes,
 * gavels, screens or robots, per the brief. */

export const AmistosaMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx={13} cy={16} r={8.5} stroke={color} strokeWidth={1.8} opacity={0.9} />
    <circle cx={20} cy={16} r={8.5} stroke={color} strokeWidth={1.8} opacity={0.6} />
  </svg>
);

export const LitigiosaMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <line x1={16} y1={5} x2={16} y2={24} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <line x1={6} y1={10} x2={26} y2={10} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <circle cx={6} cy={10} r={3.4} stroke={color} strokeWidth={1.6} fill="none" opacity={0.8} />
    <circle cx={26} cy={10} r={3.4} stroke={color} strokeWidth={1.6} fill="none" opacity={0.8} />
    <line x1={10} y1={26} x2={22} y2={26} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const CobranzaMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx={16} cy={9} r={3.2} fill={color} />
    <circle cx={7} cy={23} r={3.2} fill={color} opacity={0.75} />
    <circle cx={25} cy={23} r={3.2} fill={color} opacity={0.75} />
    <line x1={16} y1={12} x2={8} y2={20} stroke={color} strokeWidth={1.6} opacity={0.6} />
    <line x1={16} y1={12} x2={24} y2={20} stroke={color} strokeWidth={1.6} opacity={0.6} />
  </svg>
);

export const DespachosMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={7} y={9} width={18} height={16} rx={2} stroke={color} strokeWidth={1.8} />
    {[11, 16, 21].map((x) => (
      <line key={x} x1={x} y1={9} x2={x} y2={25} stroke={color} strokeWidth={1.4} opacity={0.6} />
    ))}
    <line x1={5} y1={9} x2={27} y2={9} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const PresencialMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 5c-5 0-8.5 3.7-8.5 8.3C7.5 19.5 16 27 16 27s8.5-7.5 8.5-13.7C24.5 8.7 21 5 16 5Z"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
    />
    <circle cx={16} cy={13.5} r={3.2} fill={color} opacity={0.85} />
  </svg>
);

export const SelfServiceMark: React.FC<MarkProps> = ({ size = 26, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={5} y={13} width={22} height={6} rx={3} stroke={color} strokeWidth={1.8} fill="none" />
    <circle cx={21} cy={16} r={4.6} fill={color} />
  </svg>
);

export const AgentFabricMark: React.FC<MarkProps> = ({ size = 30, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={13.5}
        y={5}
        width={5}
        height={11}
        rx={2.5}
        fill="none"
        stroke={color}
        strokeWidth={2}
        transform={`rotate(${i * 60} 16 16)`}
        opacity={0.9}
      />
    ))}
  </svg>
);
