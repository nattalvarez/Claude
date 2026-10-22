import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { StockVideo } from "../components/Stock";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke } from "../components/Sync";
import { MaskLine, Rule, font } from "../components/Type";
import { BrainItem } from "../components/Brain";
import { C, EASE } from "../theme";
import { clamp, hash, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { SMART } from "../data/content";

const ID = "smart";
const COLW = 520;
const colX = (i: number) => 120 + i * 580;

/** Marcas geométricas propias de cada columna: círculo (sector), retícula (ámbitos), capas (tecnología). */
const Mark: React.FC<{ kind: number; start: number }> = ({ kind, start }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 34, EASE.out);
  const S = 86;
  return (
    <svg width={S} height={S} viewBox="0 0 86 86" style={{ opacity: clamp(p * 1.6) }}>
      {kind === 0 && (
        <>
          <circle cx={43} cy={43} r={34 * p} fill="none" stroke={C.magenta} strokeWidth={3} />
          <circle cx={43} cy={43} r={16 * p} fill={C.magenta} />
          <circle cx={43} cy={43} r={42 * p} fill="none" stroke={C.line} strokeWidth={2} />
        </>
      )}
      {kind === 1 &&
        [0, 1, 2, 3].map((i) => (
          <rect key={i} x={6 + (i % 2) * 40} y={6 + Math.floor(i / 2) * 40} width={34 * p} height={34 * p} rx={6} fill={i === 1 ? C.magenta : "none"} stroke={i === 1 ? "none" : C.ink} strokeWidth={2.5} />
        ))}
      {kind === 2 &&
        [0, 1, 2].map((i) => (
          <path key={i} d={`M6 ${58 - i * 18} L43 ${40 - i * 18 + (1 - p) * 20} L80 ${58 - i * 18} L43 ${76 - i * 18} Z`} fill={i === 2 ? C.magenta : "rgba(255,255,255,0.9)"} stroke={i === 2 ? "none" : C.ink} strokeWidth={2.5} />
        ))}
    </svg>
  );
};

export const S14Smart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = SMART;
  const cTag = cue(ID, "Smart");
  // orden de la voz: presentación → «Primero, el sector…» → «Después, los ámbitos de solución…» → «Y por último, tecnología y arquitectura…»
  const cSecStart = cue(ID, "Parte del sector");
  const cSec = [cue(ID, "Retail"), cue(ID, "Industria"), cue(ID, "Turismo")];
  const cStart = [0, cSecStart, cue(ID, "Sobre él"), cue(ID, "Y debajo")];
  const cItems: number[][] = [
    [],
    cSec,
    [cue(ID, "experiencia"), cue(ID, "operaciones"), cue(ID, "producto"), cue(ID, "plataforma")],
    [cue(ID, "sistemas legacy"), cue(ID, "arquitectura de referencia"), cue(ID, "APIs"), cue(ID, "datos con contexto")],
  ];

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <StockVideo name="tile_smart" rate={0.7} brightness={1} saturate={0.7} wash={0.91} drift={1.08} driftFrames={900} />
      <SilkField
        time={t + 2}
        order={0.7}
        lines={70}
        seed={71}
        fills={5}
        blurNear={0}
        cam={{ pos: [-5, 3, -15], target: [-3.6, 3.4, 0], fov: 38, roll: -0.1 }}
        alpha={0.4}
        style={{ top: -420, WebkitMaskImage: "linear-gradient(90deg, #000 0%, transparent 60%)", maskImage: "linear-gradient(90deg, #000 0%, transparent 60%)" }}
      />
      <Chrome chapter="13 · Smart Digital Brains" start={2} />
      <div style={{ position: "absolute", left: 120, top: 112, display: "flex", gap: 28, alignItems: "baseline" }}>
        <MaskLine start={cTag - 10} dur={26} style={font(100, 700, { color: C.magenta, letterSpacing: "-0.045em" })}>
          {b.accent}
        </MaskLine>
        <MaskLine start={cTag - 4} dur={26} style={font(100, 700, { letterSpacing: "-0.045em" })}>
          {b.name}
        </MaskLine>
      </div>
      <Karaoke
        scene={ID}
        text={b.tagline}
        from="brains en construcción"
        appear={cTag + 6}
        style={{ position: "absolute", left: 124, top: 236, width: 1640, ...font(38, 500, { letterSpacing: "-0.028em", lineHeight: 1.22 }) }}
        on={C.ink}
        dim="#CCCBD1"
      />

      {/* capa 01: el sector, lo primero que dice la voz */}
      {(() => {
        const col = b.cols[0];
        const st = cSecStart - 14;
        const p = ramp(frame, st, 24, EASE.out);
        return (
          <div style={{ position: "absolute", left: 124, top: 372, width: 1680, opacity: clamp(p * 1.5) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateY(${(1 - p) * 20}px)` }}>
              <Mark kind={0} start={st} />
              <span style={{ ...font(22, 700, { color: C.magenta, letterSpacing: "0.16em" }) }}>{col.n}</span>
              <span style={{ ...font(56, 700, { letterSpacing: "-0.045em" }) }}>{col.t}</span>
            </div>
            <Rule start={st + 8} width={1680} color={C.ink} thickness={2.5} style={{ marginTop: 14 }} />
            <div style={{ marginTop: 22, display: "flex", gap: 60 }}>
              {col.items.map((it, k) => (
                <BrainItem key={it.h} h={it.h} d={it.d} start={cSec[k] - 10} hSize={46} hWeight={600} dSize={21} hColor={C.ink} style={{ width: 520 }} />
              ))}
            </div>
          </div>
        );
      })()}

      {/* capas 02 y 03: una línea de epígrafes cada una, después del sector y en el orden de la voz */}
      {[1, 2].map((ci, r) => {
        const col = b.cols[ci];
        const st = cStart[ci + 1] - 12;
        const p = ramp(frame, st, 26, EASE.out);
        return (
          <div key={col.n} style={{ position: "absolute", left: 124, top: 726 + r * 112, width: 1650, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ ...font(24, 700, { color: C.magenta, letterSpacing: "0.16em" }) }}>{col.n}</span>
              <span style={{ ...font(24, 700, { color: C.ink, letterSpacing: "0.16em", textTransform: "uppercase" }) }}>{col.t}</span>
              <span style={{ height: 2, width: 520 * p, background: C.line }} />
            </div>
            <div style={{ marginTop: 10, ...font(38, 500, { letterSpacing: "-0.02em", lineHeight: 1.25, color: C.ink }) }}>
              {col.items.map((it, k) => (
                <span key={it.h}>
                  {k > 0 && <span style={{ color: C.magenta, padding: "0 0.5em" }}>·</span>}
                  <span style={{ opacity: clamp(ramp(frame, cItems[ci + 1][k] - 8, 18) * 1.5) }}>{it.h}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
