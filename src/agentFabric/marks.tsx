import React from "react";

type MarkProps = { size?: number; color?: string };

/** Abstract, geometric, brand-neutral glyphs — never emoji, never a literal logo. */

export const StackMark: React.FC<MarkProps> = ({ size = 28, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={5} y={6} width={22} height={6} rx={2} fill={color} opacity={0.9} />
    <rect x={5} y={14} width={22} height={6} rx={2} fill={color} opacity={0.6} />
    <rect x={5} y={22} width={22} height={4} rx={2} fill={color} opacity={0.35} />
  </svg>
);

export const OrbitMark: React.FC<MarkProps> = ({ size = 28, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx={16} cy={16} r={5} fill={color} />
    <ellipse cx={16} cy={16} rx={13} ry={6.4} stroke={color} strokeWidth={1.6} opacity={0.85} />
    <ellipse cx={16} cy={16} rx={13} ry={6.4} stroke={color} strokeWidth={1.6} opacity={0.55} transform="rotate(60 16 16)" />
    <ellipse cx={16} cy={16} rx={13} ry={6.4} stroke={color} strokeWidth={1.6} opacity={0.35} transform="rotate(120 16 16)" />
  </svg>
);

export const CpuMark: React.FC<MarkProps> = ({ size = 28, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={9} y={9} width={14} height={14} rx={3} stroke={color} strokeWidth={2} />
    <rect x={13} y={13} width={6} height={6} rx={1.4} fill={color} />
    {[7, 14, 21].map((p) => (
      <React.Fragment key={p}>
        <line x1={p} y1={2} x2={p} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <line x1={p} y1={25} x2={p} y2={30} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <line x1={2} y1={p} x2={7} y2={p} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <line x1={25} y1={p} x2={30} y2={p} stroke={color} strokeWidth={2} strokeLinecap="round" />
      </React.Fragment>
    ))}
  </svg>
);

export const McpMark: React.FC<MarkProps> = ({ size = 22, color = "#2ABBCE" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={3} y={11} width={14} height={10} rx={5} stroke={color} strokeWidth={2.2} />
    <rect x={15} y={11} width={14} height={10} rx={5} stroke={color} strokeWidth={2.2} opacity={0.55} />
    <circle cx={10} cy={16} r={2} fill={color} />
    <circle cx={22} cy={16} r={2} fill={color} opacity={0.55} />
  </svg>
);

export const OpenAIMark: React.FC<MarkProps> = ({ size = 22, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* six overlapping capsules woven into a knot — distinct from Anthropic's thin rays */}
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

export const AnthropicMark: React.FC<MarkProps> = ({ size = 22, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {Array.from({ length: 8 }).map((_, i) => (
      <rect
        key={i}
        x={15}
        y={3}
        width={2}
        height={12}
        rx={1}
        fill={color}
        transform={`rotate(${i * 45} 16 16)`}
        opacity={0.8}
      />
    ))}
  </svg>
);

export const GeminiMark: React.FC<MarkProps> = ({ size = 22, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 3 C17 12 20 15 29 16 C20 17 17 20 16 29 C15 20 12 17 3 16 C12 15 15 12 16 3 Z" fill={color} />
  </svg>
);

export const GoogleCloudMark: React.FC<MarkProps> = ({ size = 26, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M20.6 13.2A6.6 6.6 0 0 0 8 14.9 4.8 4.8 0 0 0 9 24.4h11.8a5.6 5.6 0 0 0 -0.2 -11.2Z"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
);

/** The three closing-statement glyphs — plain geometry (bars, links, a dial),
 * matching the box icons' visual language instead of AI-cliché iconography. */

export const PotenciaMark: React.FC<MarkProps> = ({ size = 28, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={6} y={17} width={5} height={10} rx={1.4} fill={color} opacity={0.5} />
    <rect x={13.5} y={11} width={5} height={16} rx={1.4} fill={color} opacity={0.75} />
    <rect x={21} y={5} width={5} height={22} rx={1.4} fill={color} />
  </svg>
);

export const IntegraMark: React.FC<MarkProps> = ({ size = 28, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x={4} y={11} width={15} height={10} rx={5} stroke={color} strokeWidth={2.2} />
    <rect x={13} y={11} width={15} height={10} rx={5} stroke={color} strokeWidth={2.2} opacity={0.55} />
  </svg>
);

export const OrquestaMark: React.FC<MarkProps> = ({ size = 28, color = "#233456" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx={16} cy={16} r={11} stroke={color} strokeWidth={2} opacity={0.85} />
    <circle cx={16} cy={16} r={2.6} fill={color} />
    <line x1={16} y1={16} x2={16} y2={6.5} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    <circle cx={16} cy={6.5} r={1.8} fill={color} />
  </svg>
);
