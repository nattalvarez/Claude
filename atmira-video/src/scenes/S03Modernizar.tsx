import { Footage } from "../components/Footage";
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { SCENES, theme } from "../theme";

// each gain lands on its spoken word: 6s, 7s, 9s, 11s into the scene
const GAIN_AT = [180, 210, 270, 330];
import { Body, Eyebrow, Mode, Pop, SceneShell, Words, colorsFor, ramp, rand, useSpring } from "../components/kit";

/* ---------------------------------------------------------------- intro */

const OrbitRings: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const p = useSpring(20, theme.spring.smooth);
  const rings = [150, 235, 320];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: p }}>
      {rings.map((r, i) => {
        const rot = (frame * (0.6 + i * 0.35) * (i % 2 ? -1 : 1)) % 360;
        const n = 3 + i * 2;
        return (
          <g key={r} transform={`rotate(${rot} ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r={r * p} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray={i === 1 ? "6 14" : undefined} />
            {Array.from({ length: n }).map((_, k) => {
              const a = (k / n) * Math.PI * 2;
              return (
                <circle
                  key={k}
                  cx={cx + Math.cos(a) * r * p}
                  cy={cy + Math.sin(a) * r * p}
                  r={i === 0 && k === 0 ? 13 : 7}
                  fill={i === 0 && k === 0 ? theme.colors.hero : "#fff"}
                  style={i === 0 && k === 0 ? { filter: `drop-shadow(0 0 14px ${theme.colors.hero})` } : undefined}
                />
              );
            })}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={46 * p} fill={theme.colors.hero} style={{ filter: `drop-shadow(0 0 40px ${theme.colors.hero})` }} />
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize={24} fontWeight={700} fill="#fff" fontFamily={theme.fonts.body} letterSpacing={2}>
        ∞
      </text>
    </svg>
  );
};

const Intro: React.FC = () => (
  <SceneShell mode="dark" seed={4} footage={<Footage id="4010" tone="dark" scrim="left" zoom={1.12} />}>
    <OrbitRings cx={1560} cy={560} />
    <AbsoluteFill style={{ paddingLeft: 130, justifyContent: "center" }}>
      <Eyebrow delay={2} style={{ marginBottom: 36 }}>
        Qué es modernizar
      </Eyebrow>
      <Words
        text="Modernizar es renovar lo que sostiene el negocio, *dominio a dominio* y de forma continua."
        size={96}
        per={9}
        delay={8}
        maxWidth={1180}
        lineHeight={1.06}
      />
      <Body delay={140} size={34} maxWidth={1000} style={{ marginTop: 44 }}>
        Una transformación controlada, liderada por la arquitectura: preserva el conocimiento crítico del negocio y reduce la deuda técnica.
      </Body>
    </AbsoluteFill>
  </SceneShell>
);

/* ----------------------------------------------------------------- gains */

const Streaks: React.FC<{ c: ReturnType<typeof colorsFor> }> = ({ c }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={620} height={520} viewBox="0 0 620 520">
      {Array.from({ length: 13 }).map((_, i) => {
        const y = 24 + i * 39;
        const len = 120 + rand(i + 3) * 340;
        const speed = 16 + rand(i + 9) * 22;
        const x = ((frame * speed + rand(i) * 900) % 1100) - 300;
        const hero = i === 6;
        return (
          <g key={i}>
            <line x1={0} x2={620} y1={y} y2={y} stroke={c.line} strokeWidth={1} />
            <line
              x1={x}
              x2={x + len}
              y1={y}
              y2={y}
              stroke={hero ? "#fff" : c.accent === "#FFFFFF" ? "rgba(255,255,255,0.8)" : theme.colors.hero}
              strokeWidth={hero ? 8 : 4}
              strokeLinecap="round"
              opacity={hero ? 1 : 0.85}
            />
          </g>
        );
      })}
    </svg>
  );
};

const BrainGrow: React.FC<{ c: ReturnType<typeof colorsFor> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const N = 34;
  const pts = Array.from({ length: N }).map((_, i) => {
    const a = rand(i + 1) * Math.PI * 2;
    const r = Math.sqrt(rand(i + 40)) * 235;
    return { x: 310 + Math.cos(a) * r * 1.2, y: 260 + Math.sin(a) * r * 0.95, t: 3 + i * 1.2 };
  });
  const edges: [number, number][] = [];
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.hypot(p.x - q.x, p.y - q.y) < 150) edges.push([i, j]);
    }),
  );
  return (
    <svg width={620} height={520} viewBox="0 0 620 520">
      {edges.map(([i, j], k) => {
        const o = ramp(frame, Math.max(pts[i].t, pts[j].t) + 4, Math.max(pts[i].t, pts[j].t) + 12, 0, 0.55);
        return <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={c.text} strokeOpacity={o} strokeWidth={1.5} />;
      })}
      {pts.map((p, i) => {
        const s = ramp(frame, p.t, p.t + 8, 0, 1);
        return <circle key={i} cx={p.x} cy={p.y} r={(i % 7 === 0 ? 11 : 6) * s} fill={i % 7 === 0 ? "#fff" : c.text} fillOpacity={i % 7 === 0 ? 1 : 0.8} />;
      })}
    </svg>
  );
};

const Shield: React.FC<{ c: ReturnType<typeof colorsFor> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const p = useSpring(2, theme.spring.bouncy);
  const check = ramp(frame, 14, 30, 0, 1, theme.ease.inOut);
  return (
    <div style={{ position: "relative", width: 620, height: 520 }}>
      <svg width={620} height={520} viewBox="0 0 620 520" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(310 230) scale(${p}) translate(-310 -230)`}>
          <path
            d="M310 40 L500 110 V250 C500 355 420 425 310 465 C200 425 120 355 120 250 V110 Z"
            fill="rgba(255,255,255,0.1)"
            stroke="#fff"
            strokeWidth={7}
            strokeLinejoin="round"
          />
          <path d="M225 245 L289 310 L400 190" fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={320} strokeDashoffset={320 * (1 - check)} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: 14, justifyContent: "center" }}>
        {["DORA", "AI ACT", "SUPERVISOR"].map((t, i) => (
          <Pop key={t} delay={20 + i * 4}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", padding: "12px 22px", border: "2px solid #fff", borderRadius: 100, color: "#fff" }}>{t}</div>
          </Pop>
        ))}
      </div>
    </div>
  );
};

const DataSpark: React.FC<{ c: ReturnType<typeof colorsFor> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const conv = ramp(frame, 6, 36, 0, 1, theme.ease.inOut);
  const pulse = 1 + Math.sin(frame / 5) * 0.06;
  return (
    <svg width={620} height={520} viewBox="0 0 620 520">
      {Array.from({ length: 8 * 6 }).map((_, i) => {
        const gx = i % 8;
        const gy = Math.floor(i / 8);
        const x0 = 60 + gx * 70;
        const y0 = 70 + gy * 72;
        const x = interpolate(conv, [0, 1], [x0, 310]);
        const y = interpolate(conv, [0, 1], [y0, 260]);
        return <circle key={i} cx={x} cy={y} r={interpolate(conv, [0, 1], [7, 3])} fill={c.text} fillOpacity={interpolate(conv, [0, 1], [0.85, 0.5])} />;
      })}
      <g transform={`translate(310 260) scale(${conv * pulse})`}>
        <circle r={110} fill={theme.colors.hero} style={{ filter: `drop-shadow(0 0 50px ${theme.colors.hero})` }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-5} y={-168} width={10} height={44} rx={5} fill="#fff" transform={`rotate(${i * 30})`} />
        ))}
        <text y={18} textAnchor="middle" fontSize={60} fontWeight={800} fill="#fff" fontFamily={theme.fonts.display}>IA</text>
      </g>
    </svg>
  );
};

type Gain = { n: string; title: string; text: string; mode: Mode; clip: "4240" | "8813" | "13218" | "26776"; Viz?: React.FC<{ c: ReturnType<typeof colorsFor> }> };
const GAINS: Gain[] = [
  { n: "01", title: "*Velocidad*", text: "Cada producto nuevo y cada cambio llegan antes a los clientes.", mode: "dark", clip: "4240" },
  { n: "02", title: "Conocimiento que *se queda*", text: "Queda ordenado en un Digital Brain, accesible a toda la organización.", mode: "magenta", clip: "8813" },
  { n: "03", title: "Cumplimiento como *ventaja*", text: "Trazabilidad de serie para DORA, AI Act y supervisor.", mode: "dark", clip: "13218", Viz: Shield },
  { n: "04", title: "Datos listos para la *IA*", text: "La base para que analítica y agentes aporten valor.", mode: "dark", clip: "26776" },
];

const GainScene: React.FC<{ g: Gain; i: number }> = ({ g, i }) => {
  const c = colorsFor(g.mode);
  const frame = useCurrentFrame();
  const vizP = useSpring(4, theme.spring.smooth);
  const num = ramp(frame, 0, 14, 0, 1);
  return (
    <SceneShell mode={g.mode} seed={5 + i} footage={<Footage id={g.clip} tone={g.mode === "magenta" ? "magenta" : "dark"} scrim={g.mode === "magenta" ? "left" : "left"} zoom={1.1} />}>
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 70,
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 190,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: `3px ${g.mode === "magenta" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)"}`,
          opacity: num,
          transform: `translateX(${(1 - num) * -60}px)`,
        }}
      >
        {g.n}
      </div>
      {g.Viz && (
        <div style={{ position: "absolute", right: 130, top: 190, width: 620, height: 520, opacity: vizP, transform: `scale(${interpolate(vizP, [0, 1], [0.9, 1])})` }}>
          <g.Viz c={c} />
        </div>
      )}
      <AbsoluteFill style={{ paddingLeft: 130, paddingTop: 140, justifyContent: "center" }}>
        <Eyebrow delay={0} mode={g.mode} style={{ marginBottom: 34, color: g.mode === "magenta" ? "#fff" : undefined }}>
          Qué gana el negocio
        </Eyebrow>
        <Words text={g.title} size={124} per={3} delay={0} maxWidth={1080} lineHeight={1.0} mode={g.mode} emColor={g.mode === "magenta" ? "#fff" : theme.colors.hero} />
        <Body delay={14} size={36} maxWidth={820} mode={g.mode} style={{ marginTop: 42, color: g.mode === "magenta" ? "rgba(255,255,255,0.92)" : theme.colors.textDim }}>
          {g.text}
        </Body>
        <div style={{ display: "flex", gap: 14, marginTop: 56 }}>
          {GAINS.map((_, k) => (
            <div key={k} style={{ width: k === i ? 70 : 22, height: 8, borderRadius: 8, background: k === i ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Modernizar: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={GAIN_AT[0]}>
      <Intro />
    </Sequence>
    {GAINS.map((g, i) => (
      <Sequence key={i} from={GAIN_AT[i]} durationInFrames={(GAIN_AT[i + 1] ?? SCENES.modernizar.dur) - GAIN_AT[i]}>
        <GainScene g={g} i={i} />
      </Sequence>
    ))}
  </>
);
