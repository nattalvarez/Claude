import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Counter, MaskLine, Rule, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { CIFRAS } from "../data/content";

const ID = "cifras";

export const S17Cifras: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cues = [cue(ID, "Veinte años"), cue(ID, "Ochocientos veinte"), cue(ID, "Setenta millones"), cue(ID, "cuarenta clientes"), cue(ID, "Dos sedes"), cue(ID, "siete hubs")];
  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
      <SilkField
        time={t + 4}
        order={0.95}
        lines={130}
        seed={101}
        fills={12}
        twist={1.0}
        amp={1.3}
        spread={4}
        cam={{ pos: [-2, 2.6, -14], target: [0.5, 2.2, 0], fov: 38, roll: 0.1 }}
        alpha={0.7}
        style={{ top: 420, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 62%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 62%)" }}
      />
      <Chrome chapter="16 · En cifras" start={2} />
      <div style={{ position: "absolute", left: 120, top: 120, ...font(84, 600, { letterSpacing: "-0.045em", lineHeight: 1.02 }) }}>
        <MaskLine start={cue(ID, "atmira") - 6} dur={28} style={{ color: C.magenta }}>
          {CIFRAS.title[0]} <span style={{ color: C.ink }}>{CIFRAS.title[1]}</span>
        </MaskLine>
      </div>
      {CIFRAS.items.map((it, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 120 + col * 590;
        const y = 330 + row * 300;
        const s = cues[i] - 10;
        const p = ramp(frame, s, 26, EASE.out);
        return (
          <div key={it.l} style={{ position: "absolute", left: x, top: y, width: 520, opacity: clamp(p * 1.5) }}>
            <Rule start={s} width={520} color={C.ink} thickness={2.5} dur={24} />
            <div style={{ marginTop: 14, transform: `translateY(${(1 - p) * 26}px)`, ...font(176, 300, { color: C.magenta, letterSpacing: "-0.05em", lineHeight: 1, whiteSpace: "nowrap" }) }}>
              <Counter to={it.v} start={s + 4} dur={38} prefix={it.pre} suffix={it.suf} />
            </div>
            <div style={{ marginTop: 14, transform: `translateY(${(1 - p) * 20}px)`, ...font(34, 400, { letterSpacing: "-0.02em" }) }}>{it.l}</div>
          </div>
        );
      })}
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
