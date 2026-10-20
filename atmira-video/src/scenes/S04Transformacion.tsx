import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { font } from "../components/Type";
import { C, EASE, H, W } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { BENEFICIOS } from "../data/content";

const ID = "transformacion";
const TOP = 350;

/** Media pantalla a sangre que entra desde su lado: el beneficio es el lienzo, no una tarjeta. */
const Half: React.FC<{ side: "l" | "r"; at: number; label: string; sub: string; seed: number; settle: number }> = ({ side, at, label, sub, seed, settle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ramp(frame, at, 30, EASE.inOut);
  const dark = side === "r";
  const w = W / 2;
  const inset = side === "l" ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)`;
  const word = ramp(frame, at + 12, 26, EASE.out);
  return (
    <div style={{ position: "absolute", left: side === "l" ? 0 : w, top: TOP, width: w, height: H - TOP, clipPath: inset }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? `linear-gradient(160deg, #38383c 0%, ${C.charcoal} 60%, #141416 100%)`
            : `linear-gradient(160deg, #F0278F 0%, ${C.magenta} 45%, ${C.magentaDeep} 130%)`,
        }}
      />
      <SilkField
        width={w}
        height={H - TOP}
        time={frame / fps + seed}
        order={0.35 + 0.65 * settle}
        lines={96}
        seed={seed}
        palette="dark"
        fills={6}
        blurNear={0}
        length={16}
        spread={3}
        cam={{ pos: [side === "l" ? 2 : -2, 0.8, -11], target: [0, -0.2, 0], fov: 40, roll: dark ? -0.2 : 0.18 }}
        alpha={0.8}
        lineWidth={1.1}
        style={{ position: "absolute", left: 0, top: 0 }}
      />
      <div style={{ position: "absolute", left: 80, bottom: 70, right: 40 }}>
        <div style={{ ...font(22, 600, { color: "rgba(255,255,255,0.75)", letterSpacing: "0.22em", textTransform: "uppercase" }), opacity: clamp(word * 1.6) }}>{sub}</div>
        <div style={{ overflow: "hidden", paddingBottom: "0.12em", marginTop: 10 }}>
          <div style={{ ...font(112, 700, { color: "#fff", letterSpacing: "-0.05em", lineHeight: 1.02 }), transform: `translateY(${(1 - word) * 105}%)` }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export const S04Transformacion: React.FC = () => {
  const frame = useCurrentFrame();
  const cA = cue(ID, "aceleración");
  const cB = cue(ID, "especialización");
  const end = voiceEnd(ID);
  const settle = ramp(frame, end - 4, 40, EASE.inOut);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <Chrome chapter="03 · Dos beneficios" start={2} />
      <div style={{ position: "absolute", left: 120, top: 128, width: 1680, ...font(76, 600, { letterSpacing: "-0.045em", lineHeight: 1.04 }) }}>
        <SyncWords scene={ID} text={BENEFICIOS.line} from="Un enfoque" lead={3} accent={[4, 5]} />
      </div>
      <Half side="l" at={cA - 16} label="Aceleración" sub="Agent Factory" seed={5} settle={settle} />
      <Half side="r" at={cB - 16} label="Especialización" sub="Digital Brain" seed={8} settle={settle} />
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
