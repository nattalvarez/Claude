import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke } from "../components/Sync";
import { CharSettle, Lines, MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { AGENT_FACTORY } from "../data/content";

const ID = "agentfactory";

export const S06AgentFactory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cNo = cue(ID, "No convertimos");
  const cLa = cue(ID, "La Agent Factory");
  const cUna = cue(ID, "Una capacidad");
  const dolly = ramp(frame, 0, 700, EASE.soft);

  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
      {/* a la derecha, la seda se abre como una fábrica de hilos; la cámara avanza lentamente */}
      <SilkField
        time={t + 20}
        order={0.35 + 0.65 * ramp(frame, cLa, 160, EASE.inOut)}
        lines={150}
        seed={31}
        fills={14}
        twist={1.3}
        amp={1.5}
        spread={4.4}
        pinchAt={0.34}
        cam={{ pos: [interpolate(dolly, [0, 1], [6, 2]), 1.4, interpolate(dolly, [0, 1], [-17, -12])], target: [4.6, -0.4, 0], fov: 40, roll: -0.35 }}
        alpha={0.95}
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 46%, #000 76%)",
          maskImage: "linear-gradient(90deg, transparent 46%, #000 76%)",
        }}
      />
      <Chrome chapter="05 · Aceleración" start={2} hideLogo={false} />

      <div style={{ position: "absolute", left: 120, top: 262, ...font(190, 400, { letterSpacing: "-0.05em", lineHeight: 1 }) }}>
        <CharSettle text="Aceleración" start={cue(ID, "Aceleración") - 4} seed={4} mess={0.7} />
      </div>
      <div style={{ position: "absolute", left: 124, top: 478, ...font(58, 400, { color: C.magenta, letterSpacing: "-0.03em" }) }}>
        <MaskLine start={cue(ID, "habilitada") - 6} dur={26}>
          habilitada por la Agent Factory
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 124, top: 560, ...font(34, 400, { color: C.ink2, letterSpacing: "-0.012em" }) }}>
        <MaskLine start={cue(ID, "habilitada") + 10} dur={26}>
          {AGENT_FACTORY.lead}
        </MaskLine>
      </div>

      <Karaoke
        scene={ID}
        text={AGENT_FACTORY.l1}
        from="No convertimos"
        appear={cNo - 8}
        style={{ position: "absolute", left: 124, top: 700, width: 1400, ...font(36, 500, { letterSpacing: "-0.025em", lineHeight: 1.2 }) }}
        on={C.ink}
        dim="#C4C3C9"
      />
      <Karaoke
        scene={ID}
        text={AGENT_FACTORY.l2}
        from="La Agent Factory"
        appear={cLa - 8}
        style={{ position: "absolute", left: 124, top: 776, width: 1000, ...font(28, 400, { letterSpacing: "-0.005em", lineHeight: 1.36 }) }}
        on={C.ink2}
        dim="#CFCED3"
      />
      <Karaoke
        scene={ID}
        text={AGENT_FACTORY.l3}
        from="Una capacidad"
        appear={cUna - 8}
        style={{ position: "absolute", left: 124, top: 934, width: 1000, ...font(28, 500, { letterSpacing: "-0.005em" }) }}
        on={C.magenta}
        dim="#F2C3DA"
      />
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
