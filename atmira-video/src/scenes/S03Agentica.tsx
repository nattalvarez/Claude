import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Rule, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, hash, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { AGENTICA } from "../data/content";

const ID = "agentica";
const COL_W = 520;
const X0 = 120;
const GAP = 60;

/** 01 — simplifica: una madeja que se peina hasta quedar en paralelo. */
const IlloSimplify: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = ramp(frame, start, 70, EASE.inOut);
  return (
    <SilkField
      width={COL_W}
      height={220}
      time={frame / fps}
      order={o}
      lines={70}
      seed={21}
      fills={0}
      blurNear={0}
      length={14}
      spread={2.1}
      amp={0.8}
      twist={0.2}
      pinch={0}
      cam={{ pos: [0, 0, -9.5], target: [0, 0, 0], fov: 36 }}
      lineWidth={1.3}
      style={{ position: "relative" }}
    />
  );
};

/** 02 — habilita el futuro: módulos que encajan en una arquitectura. */
const IlloModules: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const cells = [
    { x: 0, y: 0, w: 2, h: 1 },
    { x: 2, y: 0, w: 1, h: 2 },
    { x: 0, y: 1, w: 1, h: 1 },
    { x: 1, y: 1, w: 1, h: 1 },
    { x: 3, y: 0, w: 1, h: 1 },
    { x: 3, y: 1, w: 1, h: 1 },
  ];
  const U = 118;
  const G = 10;
  return (
    <div style={{ position: "relative", width: COL_W, height: 220 }}>
      {cells.map((c, i) => {
        const p = ramp(frame, start + i * 5, 24, EASE.out);
        const ox = (hash(i * 3.3) - 0.5) * 260;
        const oy = (hash(i * 7.1) - 0.5) * 160;
        const hot = i === 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 20 + c.x * (U + G) + (1 - p) * ox,
              top: 4 + c.y * (U + G) * 0.88 + (1 - p) * oy,
              width: c.w * U + (c.w - 1) * G,
              height: c.h * U * 0.88 + (c.h - 1) * G,
              borderRadius: 10,
              background: hot ? C.magenta : i % 2 ? C.magentaSoft : C.line,
              border: "none",
              opacity: clamp(p * 1.6),
              transform: `rotate(${(1 - p) * (hash(i) - 0.5) * 30}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

/** 03 — valor medible: una regla de medición con una marca que avanza. */
const IlloMeasure: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 60, EASE.inOut);
  const ticks = 31;
  return (
    <div style={{ position: "relative", width: COL_W, height: 220 }}>
      <svg width={COL_W} height={220} viewBox={`0 0 ${COL_W} 220`}>
        {Array.from({ length: ticks }).map((_, i) => {
          const x = 20 + (i / (ticks - 1)) * (COL_W - 40);
          const major = i % 5 === 0;
          const q = ramp(frame, start + i * 1.2, 16, EASE.out);
          return <line key={i} x1={x} x2={x} y1={150} y2={150 - (major ? 56 : 28) * q} stroke={major ? C.ink : C.mute} strokeWidth={major ? 2.5 : 1.5} />;
        })}
        <line x1={20} x2={20 + (COL_W - 40) * p} y1={150} y2={150} stroke={C.magenta} strokeWidth={5} strokeLinecap="round" />
        <circle cx={20 + (COL_W - 40) * p} cy={150} r={11} fill={C.magenta} />
        <rect x={20 + (COL_W - 40) * p - 1.5} y={70 - 20 * p} width={3} height={80 + 20 * p} fill={C.magenta} opacity={0.35} />
      </svg>
    </div>
  );
};

export const S03Agentica: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cLead = cue(ID, "el paso que conecta");
  const cStep = [cue(ID, "Simplifica el presente"), cue(ID, "Habilita el futuro"), cue(ID, "genera valor medible")];
  const illos = [IlloSimplify, IlloModules, IlloMeasure];

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      {/* hilo conductor: una banda de seda muy sutil recorre la parte alta */}
      <SilkField
        time={t + 3}
        order={0.95}
        lines={60}
        seed={9}
        fills={4}
        blurNear={0}
        cam={{ pos: [0, 5.2, -18], target: [-2, 5.4, 0], fov: 36, roll: 0.02 }}
        alpha={0.4}
        style={{ opacity: 0.8 }}
      />
      <Chrome chapter="02 · Arquitectura agéntica" start={2} />

      <div style={{ position: "absolute", left: X0, top: 150, width: 1500, ...font(92, 600, { letterSpacing: "-0.045em", lineHeight: 1.03 }) }}>
        <SyncWords
          scene={ID}
          text="Modernizar permite evolucionar hacia una arquitectura agéntica"
          from="Modernizar"
          accent={[2, 3, 4, 5, 6]}
          lead={3}
        />
      </div>

      {AGENTICA.steps.map((s, i) => {
        const x = X0 + i * (COL_W + GAP);
        const st = cStep[i] - 10;
        const p = ramp(frame, st, 26, EASE.out);
        const Illo = illos[i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 540, width: COL_W, opacity: clamp(p * 1.4) }}>
            <div style={{ position: "relative", transform: `translateY(${(1 - p) * 30}px)` }}>
              <Illo start={st + 10} />
            </div>
            <Rule start={st + 8} width={COL_W} color={C.magenta} thickness={3} dur={24} style={{ marginTop: 26 }} />
            <div style={{ transform: `translateY(${(1 - p) * 22}px)` }}>
              <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ ...font(22, 600, { color: C.magenta, letterSpacing: "0.14em" }) }}>{s.n}</span>
                <span style={{ ...font(58, 600, { letterSpacing: "-0.04em", lineHeight: 1.05 }) }}>{s.t}</span>
              </div>
            </div>
          </div>
        );
      })}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
