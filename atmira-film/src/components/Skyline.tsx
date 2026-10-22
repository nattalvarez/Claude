import React, { useMemo } from "react";
import { theme } from "../theme";
import { useGT } from "./Scene";
import { lerp, prog, rng } from "../lib/anim";

const c = theme.colors;
type Win = { x: number; y: number; col: string; a: number; tw: number };
type Bld = { x: number; w: number; h: number; delay: number; wins: Win[]; ant: boolean; tw: Win[] };

const WCOL = [c.ice, c.ice, c.ice, c.turq, c.blueLift];

function makeLayer(seed: number, o: { hMin: number; hMax: number; lit: number; wMin: number; wMax: number; span: number; hs: number }): Bld[] {
  const r = rng(seed);
  const out: Bld[] = [];
  let x = -220;
  while (x < o.span) {
    const w = o.wMin + r() * (o.wMax - o.wMin);
    const tower = r() < 0.16;
    const h = (o.hMin + r() * (o.hMax - o.hMin) * (tower ? 1 : 0.62)) * o.hs;
    const cols = Math.max(0, Math.floor((w - 18) / 15));
    const rows = Math.max(0, Math.floor((h - 26) / 19));
    const wins: Win[] = [];
    const tw: Win[] = [];
    for (let rr = 0; rr < rows; rr++)
      for (let cc = 0; cc < cols; cc++) {
        if (r() < o.lit) {
          const win = { x: 9 + cc * 15, y: 16 + rr * 19, col: WCOL[Math.floor(r() * WCOL.length)], a: 0.3 + r() * 0.65, tw: r() * 6.28 };
          (r() < 0.07 ? tw : wins).push(win);
        }
      }
    out.push({ x, w, h, delay: r() * 0.85, wins, tw, ant: tower && r() < 0.7 });
    x += w + 2 + r() * 8;
  }
  return out;
}

const Static = React.memo(({ b, fill }: { b: Bld; fill: string }) => (
  <>
    <rect x={0} y={0} width={b.w} height={b.h + 80} fill={fill} />
    <rect x={0} y={0} width={b.w} height={2} fill={c.ice} opacity={0.22} />
    {b.wins.map((w, i) => (
      <rect key={i} x={w.x} y={w.y} width={7} height={10} rx={1} fill={w.col} opacity={w.a} />
    ))}
  </>
));

const LAYERS = [
  { seed: 11, fill: "#1E3157", op: 0.85, par: 0.25, blur: 1.6, lit: 0.16, hMin: 160, hMax: 470, wMin: 70, wMax: 130, k: 0.7 },
  { seed: 29, fill: "#15244A", op: 0.95, par: 0.55, blur: 0.6, lit: 0.22, hMin: 210, hMax: 640, wMin: 80, wMax: 150, k: 0.85 },
  { seed: 47, fill: "#0D172E", op: 1, par: 1, blur: 0, lit: 0.26, hMin: 260, hMax: 800, wMin: 90, wMax: 170, k: 1 },
];

/** Procedural night city in brand colours (no stock footage available) — 3 parallax layers, rising on a cue. */
export const Skyline: React.FC<{
  seed?: number; riseAt?: number | null; riseDur?: number; intensity?: number; dusk?: boolean;
  drift?: number; zoom?: number; ground?: number; blur?: number; start?: number; hs?: number;
}> = ({ seed = 0, riseAt = null, riseDur = 0.9, intensity = 1, dusk = false, drift = 22, zoom = 0.05, ground = 1040, blur = 0, start = 0, hs = 1 }) => {
  const gt = useGT();
  const layers = useMemo(() => LAYERS.map((L) => makeLayer(L.seed + seed * 7, { ...L, span: 2380, hs })), [seed, hs]);
  const stars = useMemo(() => {
    const r = rng(90 + seed);
    return Array.from({ length: 70 }, () => ({ x: r() * 1920, y: r() * 430, s: 0.6 + r() * 1.5, ph: r() * 6.28 }));
  }, [seed]);
  const streaks = useMemo(() => {
    const r = rng(300 + seed);
    return Array.from({ length: 16 }, () => ({ y: ground + 12 + r() * 30, len: 140 + r() * 260, sp: 280 + r() * 700, off: r() * 2600, col: r() < 0.35 ? c.turq : c.ice, a: 0.35 + r() * 0.5 }));
  }, [seed, ground]);
  const t = gt - start;
  const camZoom = 1 + zoom * prog(t, 0, 8, theme.ease.soft);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, filter: blur ? `blur(${blur}px)` : undefined }}>
      <defs>
        <radialGradient id={`hz${seed}`} cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor={dusk ? c.turq : c.blue} stopOpacity={dusk ? 0.55 : 0.5} />
          <stop offset="45%" stopColor={c.blue} stopOpacity={dusk ? 0.32 : 0.2} />
          <stop offset="100%" stopColor={c.blue} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`street${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1226" stopOpacity={0} />
          <stop offset="35%" stopColor="#0A1226" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#070C1A" stopOpacity={1} />
        </linearGradient>
        <linearGradient id={`streak${seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity={0} />
          <stop offset="85%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#hz${seed})`} style={{ transform: `translateY(${ground - 1080 + 120}px)` }} opacity={intensity} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill={c.ice} opacity={(0.25 + 0.35 * Math.sin(gt * 1.6 + s.ph) ** 2) * intensity} />
      ))}
      <g transform={`translate(960 ${ground}) scale(${camZoom}) translate(-960 ${-ground})`}>
        {layers.map((bl, li) => {
          const L = LAYERS[li];
          const dx = -t * drift * L.par;
          return (
            <g key={li} style={{ filter: L.blur ? `blur(${L.blur}px)` : undefined }} opacity={L.op * lerp(intensity, 0.55, 1)}>
              <g transform={`translate(${dx} 0)`}>
                {bl.map((b, i) => {
                  const p = riseAt === null ? 1 : prog(gt, riseAt + b.delay * (li === 0 ? 0.6 : 1) + li * 0.08, riseDur, theme.ease.out);
                  const y = ground - b.h + (1 - p) * (b.h + 90);
                  return (
                    <g key={i} transform={`translate(${b.x} ${y})`}>
                      <Static b={b} fill={L.fill} />
                      {b.tw.map((w, k) => (
                        <rect key={k} x={w.x} y={w.y} width={7} height={10} rx={1} fill={w.col} opacity={w.a * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(gt * 2.4 + w.tw)))} />
                      ))}
                      {b.ant && li > 0 ? (
                        <>
                          <rect x={b.w / 2 - 1} y={-34} width={2} height={34} fill={c.ice} opacity={0.35} />
                          <circle cx={b.w / 2} cy={-36} r={3.2} fill={c.turq} opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(gt * 3 + b.x))} />
                        </>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
      </g>
      <rect x={0} y={ground - 40} width={1920} height={1080 - ground + 40} fill={`url(#street${seed})`} />
      {streaks.map((s, i) => {
        const x = ((gt * s.sp + s.off) % (1920 + s.len * 2)) - s.len;
        return <rect key={i} x={x} y={s.y} width={s.len} height={2.4} fill={s.col} opacity={s.a * intensity} style={{ mixBlendMode: "screen" }} />;
      })}
    </svg>
  );
};
