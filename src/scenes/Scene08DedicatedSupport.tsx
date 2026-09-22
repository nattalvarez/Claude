import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, EASE, FONT_FAMILY, SCENE_DURATIONS } from "../styles/theme";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.support;
const CENTER = { x: 960, y: 440 };
const MEET_FROM = 20;
const MEET_TO = 96;
const SEPARATE_FROM = DURATION - 50;

const Tag: React.FC<{ x: number; y: number; label: string; from: number }> = ({ x, y, label, from }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [from, from + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${interpolate(appear, [0, 1], [10, 0])}px) scale(${interpolate(appear, [0, 1], [0.85, 1])})`,
        opacity: appear,
        background: COLORS.white,
        border: `1px solid ${COLORS.turquoise}55`,
        borderRadius: 999,
        padding: "10px 24px",
        boxShadow: `0 16px 30px -18px ${COLORS.navy}44`,
        fontFamily: FONT_FAMILY,
        fontWeight: 500,
        fontSize: 17,
        letterSpacing: 2,
        color: COLORS.navy,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

const Block: React.FC<{ x: number; color: string; label: string; z: number }> = ({ x, color, label, z }) => (
  <div
    style={{
      position: "absolute",
      left: x - 155,
      top: CENTER.y - 155,
      width: 310,
      height: 310,
      zIndex: z,
      borderRadius: 46,
      background: `linear-gradient(150deg, ${COLORS.white}, ${color}2e)`,
      border: `1px solid ${color}55`,
      boxShadow: `0 44px 90px -40px ${COLORS.navy}55`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: -46,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        fontFamily: FONT_FAMILY,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: 2,
        color: COLORS.navy,
      }}
    >
      {label}
    </div>
  </div>
);

/** Scene 08 — Dedicated Support. Two large geometric blocks — CLIENTE and ESPECIALISTA
 * SIREC — slide together and overlap softly at the seam; no connecting line, just direct
 * assignment. They separate again as the camera pulls back into the full catalog. */
export const Scene08DedicatedSupport: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const meet = interpolate(frame, [MEET_FROM, MEET_TO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  const separate = interpolate(frame, [SEPARATE_FROM, DURATION - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const appear = spring({ frame: frame - MEET_FROM, fps, config: { damping: 18, mass: 0.9, stiffness: 100 } });

  const gapMeet = interpolate(meet, [0, 1], [560, 230]);
  const gapSeparate = interpolate(separate, [0, 1], [0, 420]);
  const gap = gapMeet + gapSeparate;

  const cameraZoom = 1 - separate * 0.1;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${COLORS.white} 40%, ${COLORS.lightBlue}66 100%)` }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ opacity: interpolate(appear, [0, 1], [0, 1]), transform: `scale(${cameraZoom})`, transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}>
          <Block x={CENTER.x - gap / 2} color={COLORS.blue} label="CLIENTE" z={1} />
          <Block x={CENTER.x + gap / 2} color={COLORS.turquoise} label="ESPECIALISTA SIREC" z={2} />

          <Tag x={CENTER.x - 90} y={CENTER.y - 210} label="TEMPORAL" from={MEET_TO + 6} />
          <Tag x={CENTER.x + 90} y={CENTER.y - 210} label="PERMANENTE" from={MEET_TO + 18} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 96 }}>
          <TitleBlock
            title="DEDICATED SUPPORT"
            subtitle="Asignación directa de especialistas de SIREC a un cliente."
            description="De manera temporal o permanente."
            from={MEET_TO + 30}
            align="center"
            maxWidth={900}
            titleSize={50}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
