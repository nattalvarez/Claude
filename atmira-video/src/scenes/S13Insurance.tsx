import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Logo } from "../components/Logo";
import { MaskLine, font } from "../components/Type";
import { BrainItem } from "../components/Brain";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { INSURANCE } from "../data/content";

const ID = "insurance";

/** Insurance: misma voz tipográfica que Banking, distinta arquitectura: tres filas (procesos) sobre fondo ciruela. */
export const S13Insurance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = INSURANCE;
  const cTag = cue(ID, "Insurance");
  const cRow = [cue(ID, "Activamos los seguros") + 40, cue(ID, "suscripción") - 20, cue(ID, "Con capas")];
  const rows = [
    { top: 292, h: 175 },
    { top: 492, h: 240 },
    { top: 758, h: 210 },
  ];
  const rail = ramp(frame, cTag + 20, 260, EASE.inOut);

  return (
    <AbsoluteFill>
      <Backdrop tone="plum" />
      <SilkField
        time={t + 8}
        order={0.35 + 0.65 * ramp(frame, 0, 380, EASE.inOut)}
        lines={120}
        seed={61}
        palette="dark"
        fills={10}
        blurNear={2}
        length={24}
        spread={3.8}
        pinchAt={0.7}
        cam={{ pos: [4, 3.2, -14], target: [3.4, 3.6, 0], fov: 38, roll: 0.12 }}
        alpha={0.6}
        style={{ top: -330, WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 24%, transparent 34%)", maskImage: "linear-gradient(180deg, #000 0%, #000 24%, transparent 34%)" }}
      />

      <div style={{ position: "absolute", left: 120, top: 62 }}>
        <Logo width={168} tone="white" />
      </div>
      <div style={{ position: "absolute", left: 120, top: 128, display: "flex", gap: 30, alignItems: "baseline" }}>
        <MaskLine start={cTag - 10} dur={26} style={font(92, 400, { color: "#FF4DA6", letterSpacing: "-0.045em" })}>
          {b.accent}
        </MaskLine>
        <MaskLine start={cTag - 4} dur={26} style={font(92, 400, { color: "#fff", letterSpacing: "-0.045em" })}>
          {b.name}
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 124, top: 236, ...font(30, 400, { color: "rgba(255,255,255,0.85)", letterSpacing: "-0.012em", opacity: ramp(frame, cTag + 6, 26) }) }}>{b.tagline}</div>

      {/* raíl de proceso */}
      <div style={{ position: "absolute", left: 138, top: 330, width: 3, height: (968 - 330) * rail, background: `linear-gradient(180deg, ${C.magenta}, rgba(225,3,122,0.1))` }} />

      {b.cols.map((col, ri) => {
        const r = rows[ri];
        const st = cRow[ri] - 14;
        const p = ramp(frame, st, 26, EASE.out);
        const n = col.items.length;
        const gap = 28;
        const cw = (1370 - (n - 1) * gap) / n;
        return (
          <div key={col.n} style={{ position: "absolute", left: 120, top: r.top, width: 1680, height: r.h, opacity: clamp(p * 1.4) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: -14, height: 1.5, background: "rgba(255,255,255,0.22)", transformOrigin: "left", transform: `scaleX(${ramp(frame, st, 30, EASE.inOut)})` }} />
            <div style={{ position: "absolute", left: 40, top: 0, width: 250, transform: `translateX(${(1 - p) * -24}px)` }}>
              <div style={{ ...font(54, 300, { color: C.magenta, letterSpacing: "-0.04em", lineHeight: 1 }) }}>{col.n}</div>
              <div style={{ marginTop: 10, ...font(26, 500, { color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.12 }) }}>{col.t}</div>
            </div>
            {col.items.map((it, k) => (
              <BrainItem key={it.h} h={it.h} d={it.d} dark start={st + 10 + k * 8} style={{ position: "absolute", left: 310 + k * (cw + gap), top: 0, width: cw }} dSize={19} />
            ))}
          </div>
        );
      })}
      <Finish tone="plum" />
    </AbsoluteFill>
  );
};
