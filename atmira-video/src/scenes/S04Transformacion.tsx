import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Words, font } from "../components/Type";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, cueEnd, voiceEnd } from "../lib/tl";
import { BENEFICIOS } from "../data/content";

const ID = "transformacion";
const PW = 780;
const PH = 600;

/** Un plano en perspectiva con hilos en su interior. */
const Plane: React.FC<{
  side: "l" | "r";
  enter: number;
  hot: number;
  settle: number;
  label: string;
  sub: string;
  seed: number;
}> = ({ side, enter, hot, settle, label, sub, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = side === "l" ? 1 : -1;
  const rotY = interpolate(enter, [0, 1], [62 * dir, 16 * dir]) * (1 - settle) + 0 * settle;
  const rotX = interpolate(enter, [0, 1], [14, 5]) * (1 - settle);
  const tz = interpolate(enter, [0, 1], [-700, 0]) + hot * 60;
  const tx = interpolate(enter, [0, 1], [dir * -260, 0]);
  const dark = side === "r";
  return (
    <div
      style={{
        position: "absolute",
        left: side === "l" ? 120 : 1920 - 120 - PW,
        top: 310,
        width: PW,
        height: PH,
        transform: `perspective(2400px) translate3d(${tx}px,0,${tz}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${1 + hot * 0.02})`,
        opacity: clamp(enter * 2),
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 26,
          overflow: "hidden",
          background: dark
            ? `linear-gradient(160deg, #38383c 0%, ${C.charcoal} 60%, #141416 100%)`
            : C.magenta,
          boxShadow: `0 ${50 + hot * 30}px ${90 + hot * 40}px rgba(${dark ? "20,10,20" : "225,3,122"},${0.28 + hot * 0.12})`,
        }}
      >
        <SilkField
          width={PW}
          height={PH}
          time={frame / fps + seed}
          order={0.4 + 0.6 * settle}
          lines={90}
          seed={seed}
          palette="dark"
          fills={6}
          blurNear={0}
          length={16}
          spread={3}
          cam={{ pos: [side === "l" ? 2 : -2, 0.8, -11], target: [0, -0.6, 0], fov: 40, roll: dark ? -0.2 : 0.18 }}
          alpha={0.8}
          lineWidth={1.1}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        <div style={{ position: "absolute", left: 56, bottom: 54, right: 40 }}>
          <div style={{ ...font(22, 600, { color: "rgba(255,255,255,0.72)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>{sub}</div>
          <div style={{ marginTop: 12, ...font(98, 400, { color: "#fff", letterSpacing: "-0.04em" }) }}>{label}</div>
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
  const enterL = ramp(frame, 4, 40, EASE.out);
  const enterR = ramp(frame, 14, 40, EASE.out);
  const hotA = ramp(frame, cA - 6, 14) * (1 - ramp(frame, cB - 4, 12));
  const hotB = ramp(frame, cB - 6, 14);
  const settle = ramp(frame, end - 4, 40, EASE.inOut);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <Chrome chapter="03 · Dos beneficios" start={2} />
      <div style={{ position: "absolute", left: 120, top: 150, width: 1500 }}>
        <Words
          text={BENEFICIOS.line}
          start={10}
          stagger={3}
          style={font(64, 400, { letterSpacing: "-0.035em" })}
        />
      </div>
      <Plane side="l" enter={enterL} hot={hotA} settle={settle} label="Aceleración" sub="Agent Factory" seed={5} />
      <Plane side="r" enter={enterR} hot={hotB} settle={settle} label="Especialización" sub="Digital Brain" seed={8} />
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
