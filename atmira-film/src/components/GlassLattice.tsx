import React, { useMemo } from "react";
import { theme } from "../theme";
import { useGT, useExit } from "./Scene";
import { lerp, prog, rng, spr } from "../lib/anim";

const c = theme.colors;

/** Abstract glass tower (diamond lattice inside an ogive silhouette) — evokes the glass-architecture shots of the reference. */
export const GlassLattice: React.FC<{ x: number; y: number; w: number; h: number; at: number; seed?: number; dim?: number }> = ({ x, y, w, h, at, seed = 1, dim = 1 }) => {
  const gt = useGT();
  const ex = useExit(0.28);
  const cw = w / 6.5;
  const ch = cw * 1.55;
  const cells = useMemo(() => {
    const r = rng(seed * 13);
    const out: { x: number; y: number; a: number; ph: number; hot: boolean }[] = [];
    const rows = Math.ceil(h / (ch / 2)) + 2;
    const cols = Math.ceil(w / cw) + 2;
    for (let rr = 0; rr < rows; rr++)
      for (let cc = 0; cc < cols; cc++)
        out.push({ x: cc * cw + (rr % 2 ? cw / 2 : 0) - cw / 2, y: rr * (ch / 2), a: 0.05 + r() * 0.2, ph: r() * 6.28, hot: r() < 0.07 });
    return out;
  }, [seed, w, h, cw, ch]);
  const shape = `M ${w * 0.04} ${h} C ${-w * 0.06} ${h * 0.56} ${w * 0.22} ${h * 0.1} ${w / 2} 0 C ${w * 0.78} ${h * 0.1} ${w * 1.06} ${h * 0.56} ${w * 0.96} ${h} Z`;
  const grow = prog(gt, at, 1.15, theme.ease.out);
  const fade = spr(gt, at, theme.spring.smooth, 0);
  const sweep = ((gt * 0.28 + seed * 0.3) % 1.6) - 0.3;
  const id = `gl${seed}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: fade * (1 - ex) * dim, transform: `translateY(${lerp(fade, 70, 0) + ex * 30}px)` }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={`${id}c`}>
            <path d={shape} />
          </clipPath>
          <clipPath id={`${id}g`}>
            <rect x={-10} y={h * (1 - grow)} width={w + 20} height={h * grow + 10} />
          </clipPath>
          <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.blueLift} stopOpacity={0.55} />
            <stop offset="55%" stopColor={c.blue} stopOpacity={0.4} />
            <stop offset="100%" stopColor={c.navy} stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${id}g)`}>
          <path d={shape} fill={`url(#${id}f)`} />
          <g clipPath={`url(#${id}c)`}>
            {cells.map((k, i) => {
              const pulse = 0.5 + 0.5 * Math.sin(gt * 1.3 + k.ph);
              const a = k.hot ? 0.1 + 0.5 * pulse ** 2 : k.a * (0.65 + 0.7 * pulse);
              return (
                <polygon
                  key={i}
                  points={`${k.x},${k.y - ch / 2} ${k.x + cw / 2},${k.y} ${k.x},${k.y + ch / 2} ${k.x - cw / 2},${k.y}`}
                  fill={k.hot ? c.turq : c.ice}
                  fillOpacity={a}
                  stroke={c.ice}
                  strokeOpacity={0.3}
                  strokeWidth={1.2}
                />
              );
            })}
            <rect x={w * sweep} y={-20} width={w * 0.5} height={h + 40} fill={`url(#${id}s)`} opacity={0.28} style={{ mixBlendMode: "screen", transform: "skewX(-16deg)" }} />
          </g>
          <path d={shape} fill="none" stroke={c.ice} strokeOpacity={0.6} strokeWidth={2.4} />
        </g>
      </svg>
    </div>
  );
};
