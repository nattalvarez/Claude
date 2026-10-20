import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
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
  const cCol = [cue(ID, "Llevamos"), cue(ID, "sumamos conocimiento"), cue(ID, "propios")];
  const cSec = [cue(ID, "Retail"), cue(ID, "Industria"), cue(ID, "Turismo")];

  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
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
        <MaskLine start={cTag - 10} dur={26} style={font(100, 400, { color: C.magenta, letterSpacing: "-0.045em" })}>
          {b.accent}
        </MaskLine>
        <MaskLine start={cTag - 4} dur={26} style={font(100, 400, { letterSpacing: "-0.045em" })}>
          {b.name}
        </MaskLine>
      </div>
      <Karaoke
        scene={ID}
        text={b.tagline}
        from="brains en construcción"
        appear={cTag + 6}
        style={{ position: "absolute", left: 124, top: 240, width: 1560, ...font(30, 400, { letterSpacing: "-0.015em", lineHeight: 1.3 }) }}
        on={C.ink}
        dim="#CCCBD1"
      />

      {b.cols.map((col, i) => {
        const st = cCol[i] - 8;
        const p = ramp(frame, st, 26, EASE.out);
        return (
          <div key={col.n} style={{ position: "absolute", left: colX(i), top: 376, width: COLW, opacity: clamp(p * 1.4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `translateY(${(1 - p) * 20}px)` }}>
              <Mark kind={i} start={st} />
              <div>
                <div style={{ ...font(22, 600, { color: C.magenta, letterSpacing: "0.14em" }) }}>{col.n}</div>
                <div style={{ marginTop: 4, ...font(32, 500, { letterSpacing: "-0.025em", lineHeight: 1.1 }) }}>{col.t}</div>
              </div>
            </div>
            <Rule start={st + 8} width={COLW} color={C.ink} thickness={2.5} style={{ marginTop: 16 }} />
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 20 }}>
              {col.items.map((it, k) => {
                const s0 = i === 0 ? cSec[k] - 10 : st + 14 + k * 9;
                return <BrainItem key={it.h} h={it.h} d={it.d} start={s0} hSize={22} dSize={19} />;
              })}
            </div>
          </div>
        );
      })}
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
