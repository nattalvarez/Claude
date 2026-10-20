import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke } from "../components/Sync";
import { CharSettle, MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { ESPECIALIZACION } from "../data/content";

const ID = "especializacion";
const PW = 640;
const PH = 800;

export const S10Especializacion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cSub = cue(ID, "habilitada");
  const cBody = cue(ID, "El conocimiento");
  const cBrain = cue(ID, "reúne");
  const open = ramp(frame, 6, 46, EASE.out);
  const fly = ramp(frame, 0, 640, EASE.soft);
  const gather = ramp(frame, cBrain - 10, 140, EASE.inOut);

  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
      <Chrome chapter="09 · Especialización" start={2} hideLogo />

      {/* portal oscuro: el Digital Brain como profundidad y estructura */}
      <div
        style={{
          position: "absolute",
          left: 1920 - 120 - PW,
          top: 140,
          width: PW,
          height: PH,
          borderRadius: 30,
          overflow: "hidden",
          background: `linear-gradient(165deg, #2c2c31 0%, ${C.charcoal} 55%, ${C.plumDeep} 130%)`,
          boxShadow: "0 60px 120px rgba(40,10,30,0.35)",
          clipPath: `inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0 round 30px)`,
          opacity: clamp(open * 2),
        }}
      >
        <SilkField
          width={PW}
          height={PH}
          time={t + 5}
          order={0.2 + 0.8 * gather}
          lines={110}
          seed={41}
          palette="dark"
          fills={8}
          blurNear={1.6}
          length={22}
          spread={3.6}
          pinch={0.95}
          twist={1.1}
          cam={{ pos: [interpolate(fly, [0, 1], [3.5, 0]), 0.6, interpolate(fly, [0, 1], [-14, -8.5])], target: [0, 0, 0], fov: 40, roll: interpolate(fly, [0, 1], [0.4, 0.05]) }}
          alpha={0.9}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
        <div style={{ position: "absolute", left: 44, bottom: 40, ...font(24, 600, { color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>Digital Brain</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 190, ...font(142, 700, { letterSpacing: "-0.05em", lineHeight: 1 }) }}>
        <CharSettle text="Especialización" start={cue(ID, "Especialización") - 2} seed={9} mess={0.6} />
      </div>
      <div style={{ position: "absolute", left: 124, top: 372, ...font(54, 400, { color: C.magenta, letterSpacing: "-0.03em" }) }}>
        <MaskLine start={cSub - 6} dur={26}>
          {ESPECIALIZACION.sub}
        </MaskLine>
      </div>
      <Karaoke
        scene={ID}
        text={ESPECIALIZACION.body}
        from="El conocimiento"
        appear={cBody - 8}
        style={{ position: "absolute", left: 124, top: 540, width: 940, ...font(35, 400, { letterSpacing: "-0.018em", lineHeight: 1.34 }) }}
        on={C.ink}
        dim="#CCCBD1"
        accent={[]}
      />
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
