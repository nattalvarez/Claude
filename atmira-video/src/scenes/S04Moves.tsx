import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Body, Pop, SceneShell, Words, ramp, rand } from "../components/kit";

const N = 40;
const BX = 620; // viz box
const BY = 330;
const BW = 1180;
const BH = 380;

type P = { x: number; y: number };

const chaos: P[] = Array.from({ length: N }).map((_, i) => ({
  x: BX + 30 + rand(i + 11) * (BW - 60),
  y: BY + 30 + rand(i + 71) * (BH - 60),
}));
const grid: P[] = Array.from({ length: N }).map((_, i) => ({
  x: BX + 70 + (i % 10) * ((BW - 140) / 9),
  y: BY + 52 + Math.floor(i / 10) * ((BH - 104) / 3),
}));
const rings = [0, 8, 14, 17]; // 1 hub + 8 + 14 + 17
const agentic: P[] = (() => {
  const cx = BX + BW / 2;
  const cy = BY + BH / 2;
  const out: P[] = [{ x: cx, y: cy }];
  const cfg = [
    { n: 8, r: 95 },
    { n: 14, r: 170 },
    { n: 17, r: 235 },
  ];
  cfg.forEach(({ n, r }, k) => {
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2 + k * 0.4;
      out.push({ x: cx + Math.cos(a) * r * 1.75, y: cy + Math.sin(a) * r * 0.8 });
    }
  });
  return out;
})();

const edgesChaos: [number, number][] = Array.from({ length: 70 }).map((_, k) => [
  Math.floor(rand(k + 5) * N),
  Math.floor(rand(k + 55) * N),
]);
const edgesGrid: [number, number][] = [];
for (let i = 0; i < N; i++) {
  if (i % 10 < 9) edgesGrid.push([i, i + 1]);
  if (i + 10 < N) edgesGrid.push([i, i + 10]);
}
const edgesAgentic: [number, number][] = [];
for (let i = 1; i <= 8; i++) edgesAgentic.push([0, i]);
for (let i = 9; i <= 22; i++) edgesAgentic.push([1 + ((i - 9) % 8), i]);
for (let i = 23; i < N; i++) edgesAgentic.push([9 + ((i - 23) % 14), i]);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const STAGES = [
  { n: "01", title: "Simplifica el presente", text: "Reduce la complejidad de los sistemas legacy y facilita su integración." },
  { n: "02", title: "Habilita el futuro", text: "Evoluciona hacia arquitecturas modulares y agénticas que aceleren la innovación." },
  { n: "03", title: "Genera valor medible", text: "Mejora la eficiencia, agilidad y rendimiento, con gobierno y control regulatorio." },
];
const SWITCH = [BEAT * 6, BEAT * 10]; // stage 1 -> 2 at f90, 2 -> 3 at f150

const Field: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: frame - SWITCH[0], fps, config: { damping: 18, stiffness: 70, mass: 1.1 } });
  const s2 = spring({ frame: frame - SWITCH[1], fps, config: { damping: 18, stiffness: 70, mass: 1.1 } });
  const appear = spring({ frame: frame - 20, fps, config: theme.spring.smooth });
  const pos = (i: number): P => {
    const jitter = interpolate(s1, [0, 1], [1, 0]);
    const a = {
      x: chaos[i].x + Math.sin(frame / 14 + i) * 9 * jitter,
      y: chaos[i].y + Math.cos(frame / 17 + i * 2) * 9 * jitter,
    };
    const b = grid[i];
    const c = agentic[i];
    const x1 = lerp(a.x, b.x, s1);
    const y1 = lerp(a.y, b.y, s1);
    return { x: lerp(x1, c.x, s2), y: lerp(y1, c.y, s2) };
  };
  const w0 = 1 - s1;
  const w1 = s1 * (1 - s2);
  const w2 = s2;
  const P = Array.from({ length: N }).map((_, i) => pos(i));
  const sets: [[number, number][], number, string][] = [
    [edgesChaos, w0, "rgba(255,255,255,0.28)"],
    [edgesGrid, w1, "rgba(255,255,255,0.5)"],
    [edgesAgentic, w2, "rgba(255,255,255,0.55)"],
  ];
  // travelling pulses on agentic edges
  const pulses = edgesAgentic.filter((_, k) => k % 3 === 0);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: appear }}>
      {sets.map(([edges, w, col], si) =>
        w > 0.01
          ? edges.map(([a, b], k) => (
              <line key={`${si}-${k}`} x1={P[a].x} y1={P[a].y} x2={P[b].x} y2={P[b].y} stroke={col} strokeOpacity={w} strokeWidth={si === 0 ? 1.5 : 2} />
            ))
          : null,
      )}
      {w2 > 0.4 &&
        pulses.map(([a, b], k) => {
          const t = ((frame * 0.035 + k * 0.23) % 1);
          return <circle key={k} cx={lerp(P[a].x, P[b].x, t)} cy={lerp(P[a].y, P[b].y, t)} r={5} fill={theme.colors.hero} opacity={w2} style={{ filter: `drop-shadow(0 0 8px ${theme.colors.hero})` }} />;
        })}
      {P.map((p, i) => {
        const hub = i === 0;
        const sq = w1 > 0.5;
        const r = hub ? lerp(7, 26, w2) : 8;
        const col = hub && w2 > 0.2 ? theme.colors.hero : w0 > 0.5 ? "rgba(255,255,255,0.7)" : "#fff";
        return sq && w2 < 0.5 ? (
          <rect key={i} x={p.x - 9} y={p.y - 9} width={18} height={18} rx={3} fill={col} />
        ) : (
          <circle key={i} cx={p.x} cy={p.y} r={r} fill={col} style={hub && w2 > 0.2 ? { filter: `drop-shadow(0 0 20px ${theme.colors.hero})` } : undefined} />
        );
      })}
    </svg>
  );
};

const Tag: React.FC<{ text: string; w: number }> = ({ text, w }) => (
  <div
    style={{
      position: "absolute",
      left: BX,
      top: BY - 54,
      fontFamily: theme.fonts.body,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "0.24em",
      color: "#fff",
      opacity: w,
      transform: `translateY(${(1 - w) * 12}px)`,
    }}
  >
    {text}
  </div>
);

export const Moves: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = frame < SWITCH[0] ? 0 : frame < SWITCH[1] ? 1 : 2;
  const colW = 540;
  const lineFill = ramp(frame, 30, 30 + 60, 0, 1, theme.ease.inOut) * 0 + (stage === 0 ? ramp(frame, 40, SWITCH[0], 0.05, 0.33) : stage === 1 ? ramp(frame, SWITCH[0], SWITCH[1], 0.33, 0.66) : ramp(frame, SWITCH[1], 235, 0.66, 1));
  const tagFor = (s: number) => ramp(frame, s === 0 ? 20 : SWITCH[s - 1] + 4, s === 0 ? 34 : SWITCH[s - 1] + 14, 0, 1) * (stage === s ? 1 : 0);
  return (
    <SceneShell mode="dark" seed={9}>
      <Field />
      <Tag text="LEGACY · MONOLITOS · INTEGRACIÓN PUNTO A PUNTO" w={tagFor(0)} />
      <Tag text="ARQUITECTURA MODULAR · DOMINIOS · APIs" w={tagFor(1)} />
      <Tag text="ARQUITECTURA AGÉNTICA · AGENTES + GOBIERNO" w={tagFor(2)} />
      <div style={{ position: "absolute", left: 130, top: 84, width: 1500 }}>
        <Words text="Modernizar permite evolucionar hacia una *arquitectura agéntica*" size={74} per={2.5} maxWidth={1300} lineHeight={1.05} />
      </div>
      <div style={{ position: "absolute", left: 130, top: 330, width: 430 }}>
        <Body delay={30} size={30} maxWidth={430}>
          Es el paso que conecta los sistemas actuales con la arquitectura objetivo, en tres movimientos.
        </Body>
      </div>
      {/* timeline */}
      <div style={{ position: "absolute", left: 130, top: 790, width: 1660 }}>
        <div style={{ position: "relative", height: 4, background: theme.colors.line, borderRadius: 4 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: `${lineFill * 100}%`, background: theme.colors.hero, borderRadius: 4, boxShadow: `0 0 18px ${theme.colors.hero}` }} />
          {STAGES.map((_, i) => {
            const active = stage >= i;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * colW + 2,
                  top: -9,
                  width: 22,
                  height: 22,
                  borderRadius: 22,
                  background: active ? theme.colors.hero : theme.colors.bg,
                  border: `3px solid ${active ? theme.colors.hero : "rgba(255,255,255,0.4)"}`,
                  boxShadow: active && stage === i ? `0 0 24px ${theme.colors.hero}` : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", marginTop: 34 }}>
          {STAGES.map((s, i) => {
            const active = stage === i;
            return (
              <Pop key={i} delay={34 + i * 5} from="bottom" style={{ width: colW, paddingRight: 44, opacity: undefined }}>
                <div style={{ opacity: active ? 1 : 0.38, transform: `translateY(${active ? 0 : 6}px)`, transition: "none" }}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, letterSpacing: "-0.04em", color: active ? theme.colors.hero : "#fff", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: "#fff", margin: "10px 0 8px" }}>{s.title}</div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: 24, lineHeight: 1.35, color: theme.colors.textDim }}>{s.text}</div>
                </div>
              </Pop>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
