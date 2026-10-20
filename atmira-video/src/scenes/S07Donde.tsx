import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Eyebrow, Lines, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { DONDE } from "../data/content";

const ID = "donde";

export const S07Donde: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cLead = cue(ID, "Transformamos");
  const cRows = [cue(ID, "legacy"), cue(ID, "core financiero"), cue(ID, "SIREC"), cue(ID, "cloud"), cue(ID, "diseño por dominios"), cue(ID, "ingeniería")];
  const cSup = cue(ID, "Los agentes ejecutan");
  const end = voiceEnd(ID);

  // fila activa: la que se está explicando
  const active = (i: number) => {
    const a = cRows[i] - 8;
    const b = i < 5 ? cRows[i + 1] - 8 : cSup - 6;
    return ramp(frame, a, 12) * (1 - ramp(frame, b, 12));
  };
  const allOn = ramp(frame, cSup + 20, 30, EASE.inOut);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 7}
        order={0.9}
        lines={64}
        seed={17}
        fills={5}
        blurNear={0}
        spread={2.6}
        cam={{ pos: [-4, 3.4, -15], target: [-2, 3.6, 0], fov: 36, roll: 0.05 }}
        alpha={0.42}
        style={{ top: 520, WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 30%,transparent 46%)", maskImage: "linear-gradient(90deg,#000 0%,#000 30%,transparent 46%)" }}
      />
      <Chrome chapter="06 · Dónde aceleramos" start={2} />

      <div style={{ position: "absolute", left: 120, top: 150, width: 600, ...font(66, 400, { letterSpacing: "-0.04em", lineHeight: 1.03 }) }}>
        <SyncWords scene={ID} text="Dónde aceleramos, eficientamos e industrializamos" from="Dónde aceleramos" accent={[2, 3, 4]} lead={3} dur={16} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 430, width: 560, ...font(31, 400, { color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.3 }) }}>
        <SyncWords scene={ID} text="Transformamos los sistemas críticos en arquitecturas modernas, flexibles y escalables, sin interrumpir el negocio." from="Transformamos" accent={[11, 12, 13]} lead={3} dur={14} style={{ columnGap: "0.24em" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 760, width: 520 }}>
        <Lines
          start={cSup - 6}
          stagger={8}
          lines={[
            <span key="a" style={{ ...font(25, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.32 }) }}>Combinamos arquitecturas cloud, evolución del core e ingeniería avanzada.</span>,
            <span key="b" style={{ ...font(25, 600, { color: C.magenta, letterSpacing: 0 }) }}>Los agentes ejecutan; la arquitectura marca el camino.</span>,
          ]}
        />
      </div>

      {/* tabla "Esto incluye" */}
      <div style={{ position: "absolute", left: 790, top: 150 }}>
        <Eyebrow start={cLead - 2}>{DONDE.includes}</Eyebrow>
      </div>
      {DONDE.items.map((it, i) => {
        const p = ramp(frame, cRows[i] - 10, 24, EASE.out);
        const a = active(i);
        const lit = Math.max(a, allOn);
        const y = 214 + i * 128;
        return (
          <div key={it.n} style={{ position: "absolute", left: 790, top: y, width: 1010, height: 120, opacity: clamp(p * 1.5) }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(225,3,122,${0.1 * a}) 0%, rgba(225,3,122,0) 100%)`, borderLeft: `4px solid rgba(225,3,122,${a})`, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: C.line, transformOrigin: "left", transform: `scaleX(${ramp(frame, cRows[i] - 12, 26, EASE.inOut)})` }} />
            <div style={{ position: "absolute", left: 24, top: 26, transform: `translateY(${(1 - p) * 20}px)`, ...font(30, 500, { color: C.magenta, letterSpacing: "0.02em" }) }}>{it.n}</div>
            <div style={{ position: "absolute", left: 100, top: 20, width: 340, transform: `translateY(${(1 - p) * 20}px)`, opacity: 0.5 + 0.5 * lit, ...font(32, 500, { letterSpacing: "-0.025em", lineHeight: 1.1 }) }}>{it.t}</div>
            <div style={{ position: "absolute", left: 470, top: 20, width: 520, transform: `translateY(${(1 - p) * 20}px)`, opacity: 0.55 + 0.45 * lit, ...font(21, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.34 }) }}>{it.d}</div>
          </div>
        );
      })}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
