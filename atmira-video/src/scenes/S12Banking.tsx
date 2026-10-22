import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { StockVideo } from "../components/Stock";
import { SilkField } from "../components/SilkField";
import { Logo } from "../components/Logo";
import { MaskLine, Rule, font } from "../components/Type";
import { Karaoke } from "../components/Sync";
import { BrainItem } from "../components/Brain";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { BANKING } from "../data/content";

const ID = "banking";
const COLW = 360;
const colX = (i: number) => 640 + i * 400;

export const S12Banking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = BANKING;

  const cCol = [cue(ID, "parte del sector"), cue(ID, "Sobre él"), cue(ID, "Y debajo")];
  const cTag = cue(ID, "Banking");
  const end = voiceEnd(ID);
  const panel = ramp(frame, 0, 34, EASE.out);
  const focusAll = ramp(frame, end - 40, 30, EASE.inOut);
  const active = (i: number) => {
    const s = cCol[i] - 6;
    const e = i < 2 ? cCol[i + 1] - 6 : 1e9;
    return ramp(frame, s, 16) * (1 - ramp(frame, e, 16));
  };

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />

      {/* panel de marca */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 1080, overflow: "hidden", transform: `translateX(${(1 - panel) * -560}px)`, background: `linear-gradient(170deg, #3a3a3a 0%, ${C.panel} 45%, #141416 100%)` }}>
        <StockVideo name="tile_banking" rate={0.8} brightness={0.8} veil={0.38} vignette={0.5} drift={1.12} driftFrames={700} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,9,18,0.2) 0%, rgba(10,9,18,0.72) 70%)" }} />
        <SilkField
          width={560}
          height={1080}
          time={t + 2}
          order={0.5 + 0.5 * ramp(frame, 0, 300, EASE.inOut)}
          lines={100}
          seed={51}
          palette="dark"
          fills={6}
          blurNear={0}
          length={24}
          spread={3}
          pinch={0.7}
          cam={{ pos: [2, -2, -12], target: [0, -3.4, 0], fov: 38, roll: -1.1 }}
          alpha={0.55}
          style={{ position: "absolute", left: 0, top: 0, opacity: 0.9 }}
        />
        <div style={{ position: "absolute", left: 86, top: 72 }}>
          <Logo width={216} tone="white" />
        </div>
        <div style={{ position: "absolute", left: 86, top: 250 }}>
          <MaskLine start={cTag - 10} dur={26} style={font(96, 700, { color: C.magenta, letterSpacing: "-0.045em", lineHeight: 1 })}>
            {b.accent}
          </MaskLine>
          {b.name.split(" ").map((w, k) => (
            <MaskLine key={w} start={cTag - 4 + k * 6} dur={26} style={font(96, 700, { color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.04, marginTop: 4 })}>
              {w}
            </MaskLine>
          ))}
        </div>
        <div style={{ position: "absolute", left: 86, top: 640, width: 400, ...font(30, 400, { color: "#fff", letterSpacing: "-0.012em", lineHeight: 1.3, opacity: ramp(frame, cTag + 6, 26) }) }}>
          {b.tagline}
        </div>
        <div style={{ position: "absolute", left: 86, bottom: 96, width: 400 }}>
          {b.legend.map((l, i) => {
            const a = Math.max(active(i), focusAll * 0.5);
            return (
              <div key={l} style={{ borderTop: `2px solid rgba(255,255,255,${0.25 + 0.7 * a})`, padding: "18px 0 20px", ...font(22, a > 0.5 ? 600 : 400, { color: `rgba(255,255,255,${0.45 + 0.55 * a})`, letterSpacing: 0 }), opacity: ramp(frame, cTag + 20 + i * 6, 20) }}>
                {l}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mientras suena la presentación del cerebro, el texto se lee a la vez que la voz */}
      <Karaoke
        scene={ID}
        text={b.intro ?? ""}
        from="Activamos"
        appear={cTag + 24}
        exitAt={cCol[0] - 22}
        style={{ position: "absolute", left: 680, top: 300, width: 1100, ...font(58, 500, { letterSpacing: "-0.03em", lineHeight: 1.2 }) }}
        accent={[]}
      />

      {/* las tres capas, de una en una */}
      {b.cols.map((col, i) => {
        const lv = ramp(frame, cCol[i] - 8, 22, EASE.out) * (1 - (i < 2 ? ramp(frame, cCol[i + 1] - 12, 14, EASE.in) : focusAll * 0));
        if (lv <= 0.002) return null;
        const st = cCol[i] - 6;
        return (
          <div key={col.n} style={{ position: "absolute", left: 680, top: 110, width: 1110, opacity: clamp(lv * 1.6), transform: `translateY(${(1 - lv) * 30}px)` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
              <span style={{ ...font(150, 700, { color: C.magenta, letterSpacing: "-0.06em", lineHeight: 0.9 }) }}>{col.n}</span>
              <span style={{ ...font(60, 700, { letterSpacing: "-0.045em", lineHeight: 1 }) }}>{col.t}</span>
            </div>
            <Rule start={st + 4} width={1110} color={C.ink} thickness={2.5} style={{ marginTop: 26 }} />
            <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 40 }}>
              {col.items.map((it, k) => (
                <BrainItem key={it.h} h={it.h} d={it.d} start={st + 12 + k * 10} hSize={54} hWeight={600} dSize={24} hColor={C.ink} />
              ))}
            </div>
          </div>
        );
      })}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
