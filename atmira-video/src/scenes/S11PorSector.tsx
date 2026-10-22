import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke, SyncWords } from "../components/Sync";
import { Rule, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { POR_SECTOR } from "../data/content";

const ID = "porsector";

const TILE = [
  { bg: `linear-gradient(160deg,#3a3a3f 0%, ${C.charcoal} 60%, #131315 100%)`, fg: "#fff", sub: "rgba(255,255,255,0.78)", seed: 3, ink: "dark" as const },
  { bg: `linear-gradient(160deg,#4b0b2b 0%, ${C.plum} 55%, ${C.plumDeep} 100%)`, fg: "#fff", sub: "rgba(255,255,255,0.78)", seed: 6, ink: "dark" as const },
  { bg: `linear-gradient(160deg,#ffffff 0%, ${C.magentaMist} 100%)`, fg: C.ink, sub: C.ink2, seed: 9, ink: "brand" as const },
];

export const S11PorSector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cThree = [cue(ID, "el sector"), cue(ID, "los ámbitos de negocio"), cue(ID, "la tecnología")];
  const cCrece = cue(ID, "Crece con cada proyecto");
  const cMarco = cue(ID, "Un marco");
  const cT = [cue(ID, "Banking"), cue(ID, "Insurance"), cue(ID, "Smart")];

  const phase2 = ramp(frame, cMarco - 6, 26, EASE.inOut);
  const cTile = [cMarco + 6, cMarco + 20, cMarco + 34];

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 15}
        order={0.8}
        lines={56}
        seed={11}
        fills={4}
        blurNear={0}
        cam={{ pos: [0, 4, -16], target: [0, 4.4, 0], fov: 36 }}
        alpha={0.34}
        style={{ top: 640, opacity: 1 - phase2 }}
      />
      <Chrome chapter="10 · Un Digital Brain por sector" start={2} />

      <div style={{ opacity: 1 - phase2, transform: `translateY(${-phase2 * 40}px)` }}>
        <div style={{ position: "absolute", left: 120, top: 128, ...font(104, 700, { letterSpacing: "-0.05em" }) }}>
          <SyncWords scene={ID} text="Un Digital Brain por sector" from="Un Digital Brain" accent={[3, 4]} lead={3} dur={16} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 262, ...font(32, 400, { color: C.ink2, letterSpacing: "-0.012em" }) }}>
          <MaskText start={cue(ID, "Cada uno") - 4}>{POR_SECTOR.lead}</MaskText>
        </div>
        {POR_SECTOR.threes.map((s, i) => {
          const st = cThree[i] - 8;
          const p = ramp(frame, st, 26, EASE.out);
          const x = 120 + i * 580;
          return (
            <div key={s.n} style={{ position: "absolute", left: x, top: 372, width: 500, opacity: clamp(p * 1.5) }}>
              <div style={{ transform: `translateY(${(1 - p) * 26}px)` }}>
                <div style={{ ...font(150, 300, { color: "transparent", letterSpacing: "-0.05em", lineHeight: 1 }), WebkitTextStroke: `2.5px ${C.magenta}` }}>{s.n}</div>
                <Rule start={st + 8} width={500} color={C.ink} thickness={2} style={{ marginTop: 10 }} />
                <div style={{ marginTop: 22, ...font(42, 500, { letterSpacing: "-0.03em", lineHeight: 1.1 }) }}>{s.t}</div>
                <div style={{ marginTop: 12, ...font(26, 400, { color: C.mute, letterSpacing: 0 }) }}>{s.d}</div>
              </div>
            </div>
          );
        })}
        <Karaoke
          scene={ID}
          text={POR_SECTOR.tail}
          from="Crece con cada proyecto"
          appear={cCrece - 10}
          style={{ position: "absolute", left: 120, top: 800, width: 1500, ...font(36, 400, { letterSpacing: "-0.02em", lineHeight: 1.3 }) }}
          on={C.ink}
          dim="#CDCCD2"
        />
      </div>

      {/* Un marco, diferentes cerebros */}
      <div style={{ position: "absolute", left: 120, top: 120, zIndex: 5, mixBlendMode: "difference" as const, color: "#fff", opacity: phase2, transform: `translateY(${(1 - phase2) * 30}px)`, ...font(26, 600, { color: "#fff", letterSpacing: "0.16em", textTransform: "uppercase" }) }}>
        {POR_SECTOR.frame}
      </div>
      {POR_SECTOR.brains.map((b, i) => {
        const tl = TILE[i];
        const p = ramp(frame, cTile[i], 30, EASE.out);
        const hot = ramp(frame, cT[i] - 4, 12) * (1 - (i < 2 ? ramp(frame, cT[i + 1] - 4, 12) : 0));
        const x = i * 640;
        return (
          <div
            key={b.a}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 640,
              height: 1080,
              overflow: "hidden",
              background: tl.bg,
              clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
              filter: `brightness(${0.9 + hot * 0.1})`,
            }}
          >
            <SilkField
              width={640}
              height={1080}
              time={t + i * 3}
              order={0.55 + i * 0.2}
              lines={70}
              seed={tl.seed}
              palette={tl.ink === "dark" ? "dark" : "brand"}
              fills={4}
              blurNear={0}
              length={18}
              spread={3}
              pinch={0.9}
              cam={{ pos: [i * 1.2 - 1.2, 1.5, -10], target: [0, 1.2, 0], fov: 40, roll: 0.3 - i * 0.25 }}
              alpha={tl.ink === "dark" ? 0.75 : 0.55}
              style={{ position: "absolute", left: 0, top: 0, WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 34%, transparent 60%)", maskImage: "linear-gradient(180deg, #000 0%, #000 34%, transparent 60%)" }}
            />
            <div style={{ position: "absolute", left: 112, right: 40, bottom: 84 }}>
              <div style={{ ...font(84, 700, { color: tl.ink === "dark" ? "#FF4DA6" : C.magenta, letterSpacing: "-0.05em", lineHeight: 1 }) }}>{b.a}</div>
              <div style={{ ...font(84, 700, { color: tl.fg, letterSpacing: "-0.05em", lineHeight: 1.02 }) }}>Digital Brain</div>
              <div style={{ marginTop: 18, ...font(25, 500, { color: tl.ink === "dark" ? "#FF4DA6" : C.magenta, letterSpacing: 0 }) }}>{b.t}</div>
              <div style={{ marginTop: 12, ...font(22, 400, { color: tl.sub, letterSpacing: 0, lineHeight: 1.36 }) }}>{b.d}</div>
            </div>
          </div>
        );
      })}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};

const MaskText: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 24, EASE.out);
  return <div style={{ opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>{children}</div>;
};
