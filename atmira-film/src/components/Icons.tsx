import React from "react";

const P: Record<string, string[]> = {
  bank: ["M3 10 12 4l9 6H3z", "M5.5 10v8M10 10v8M14 10v8M18.5 10v8", "M3 20.5h18"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", "M8.5 12l2.5 2.5 4.5-5"],
  compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M15.8 8.2l-2 5.6-5.6 2 2-5.6z"],
  swap: ["M6 8h12l-3-3.2M18 8l-3 3.2", "M18 16H6l3 3.2M6 16l3-3.2"],
  flask: ["M9.5 3h5M10.5 3v6L5 18.5A2 2 0 0 0 6.8 21.5h10.4a2 2 0 0 0 1.8-3L13.5 9V3", "M8 15h8"],
  cloud: ["M7.5 18.5a4 4 0 0 1-.6-7.95A6 6 0 0 1 18.4 10a4.3 4.3 0 0 1-.4 8.5z"],
  refresh: ["M20 12a8 8 0 1 1-2.4-5.7", "M20 4.2V9h-4.8"],
  cap: ["M2.5 9.5 12 5l9.5 4.5L12 14z", "M6 11.7V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.3"],
  headset: ["M4.5 14v-2a7.5 7.5 0 0 1 15 0v2", "M4.5 14h3v5h-1.5a1.5 1.5 0 0 1-1.5-1.5z", "M19.5 14h-3v5H18a1.5 1.5 0 0 0 1.5-1.5z", "M17.5 19c0 1.7-2 2.3-5 2.3"],
  spark: ["M12 3v3M12 18v3M3 12h3M18 12h3", "M12 7.2l1.7 3.1L17 12l-3.3 1.7L12 16.8l-1.7-3.1L7 12l3.3-1.7z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  chart: ["M4 19.5V5", "M4 19.5h16", "M7.5 15l3.5-4 3 2.5L19.5 7"],
  layers: ["M12 3.5l9 4.8-9 4.8-9-4.8z", "M3 12.2l9 4.8 9-4.8", "M3 16.2l9 4.8 9-4.8"],
  users: ["M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M2.5 20a6.5 6.5 0 0 1 13 0", "M16 4.4a3.5 3.5 0 0 1 0 6.2", "M18 14.2a6.5 6.5 0 0 1 3.5 5.8"],
  loop: ["M17 3.5l3 3-3 3", "M20 6.5H8a4.5 4.5 0 0 0-4.5 4.5", "M7 20.5l-3-3 3-3", "M4 17.5h12a4.5 4.5 0 0 0 4.5-4.5"],
  pin: ["M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z", "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
};

export const Icon: React.FC<{ name: keyof typeof P; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size = 32, color = "currentColor", stroke = 1.7, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {P[name].map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);
