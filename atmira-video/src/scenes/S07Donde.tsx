import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { StockVideo } from "../components/Stock";
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
  // cada fila se enciende cuando la voz empieza a nombrar ese frente
  const cRows = [cue(ID, "el legacy", 0), cue(ID, "financiero"), cue(ID, "ciclo de riesgo"), cue(ID, "arquitecturas cloud"), cue(ID, "diseño por dominios"), cue(ID, "ingeniería")];
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
      <StockVideo name="donde" rate={0.7} brightness={0.85} veil={0.4} vignette={0.55} drift={1.1} driftFrames={800} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,7,16,0.7) 0%, rgba(8,7,16,0.55) 45%, rgba(8,7,16,0.35) 100%)" }} />
      <SilkField
        time={t + 7}
        order={0.9}
        lines={64}
        palette="dark"
        seed={17}
        fills={5}
        blurNear={0}
        spread={2.6}
        cam={{ pos: [-4, 3.4, -15], target: [-2, 3.6, 0], fov: 36, roll: 0.05 }}
        alpha={0.42}
        style={{ top: 520, WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 30%,transparent 46%)", maskImage: "linear-gradient(90deg,#000 0%,#000 30%,transparent 46%)" }}
      />
      <Chrome chapter="06 · Dónde aceleramos" start={2} tone="dark" />

      <div style={{ position: "absolute", left: 120, top: 150, width: 600, ...font(66, 600, { color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.03 }) }}>
        <SyncWords scene={ID} text="Dónde aceleramos, eficientamos e industrializamos" from="Dónde aceleramos" accent={[2, 3, 4]} lead={3} dur={16} />
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
            <div style={{ position: "absolute", inset: 0, borderLeft: `4px solid rgba(225,3,122,${a})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.28)", transformOrigin: "left", transform: `scaleX(${ramp(frame, cRows[i] - 12, 26, EASE.inOut)})` }} />
            <div style={{ position: "absolute", left: 24, top: 26, transform: `translateY(${(1 - p) * 20}px)`, ...font(30, 500, { color: C.magenta, letterSpacing: "0.02em" }) }}>{it.n}</div>
            <div style={{ position: "absolute", left: 96, top: 28, width: 880, transform: `translateY(${(1 - p) * 20}px)`, opacity: 0.5 + 0.5 * lit, ...font(40, 500, { color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.1 }) }}>{it.t}</div>
          </div>
        );
      })}
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
