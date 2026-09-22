import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, EASE, SCENE_DURATIONS } from "../styles/theme";
import { TechIcon, IconType } from "../components/TechIcon";
import { Surface } from "../components/Surface";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.taas;
const CENTER = { x: 960, y: 470 };
const SETTLE_FROM = 148;
const SETTLE_TO = 190;
const VANISH_FROM = DURATION - 56;

type Card = { id: string; icon: IconType; depth: number; sx: number; sy: number; fx: number; from: number; color: string; vanishOrder: number };

const CARDS: Card[] = [
  { id: "book", icon: "book", depth: 1, sx: 0, sy: -10, fx: 0, from: 8, color: COLORS.blue, vanishOrder: 4 },
  { id: "doc", icon: "doc", depth: 0.6, sx: -320, sy: 60, fx: -380, from: 30, color: COLORS.turquoise, vanishOrder: 1 },
  { id: "play", icon: "play", depth: 0.6, sx: 320, sy: 40, fx: 380, from: 50, color: COLORS.navy, vanishOrder: 0 },
  { id: "layers", icon: "layers", depth: 0.4, sx: -150, sy: -190, fx: -190, from: 70, color: COLORS.blue, vanishOrder: 2 },
  { id: "screen", icon: "screen", depth: 0.4, sx: 160, sy: -170, fx: 190, from: 90, color: COLORS.turquoise, vanishOrder: 3 },
];

const CardFace: React.FC<{ card: Card; frame: number; fps: number }> = ({ card, frame, fps }) => {
  const appear = spring({ frame: frame - card.from, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const settle = interpolate(frame, [SETTLE_FROM + card.depth * 6, SETTLE_TO + card.depth * 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.standard),
  });

  const scatterX = CENTER.x + card.sx;
  const scatterY = CENTER.y + card.sy;
  const finalX = CENTER.x + card.fx;
  const finalY = CENTER.y + 60;
  const x = scatterX + (finalX - scatterX) * settle;
  const y = scatterY + (finalY - scatterY) * settle;

  const depthScale = card.depth + (1 - card.depth) * settle;
  const blur = (1 - card.depth) * (1 - settle) * 3;
  const idleFloat = Math.sin(frame / 55 + card.from) * 6 * (1 - settle);

  const vanishStart = VANISH_FROM + card.vanishOrder * 10;
  const vanish = interpolate(frame, [vanishStart, vanishStart + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  const isHero = card.id === "book";
  const flip = isHero ? interpolate(frame, [DURATION - 26, DURATION - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.inOut) }) : 0;
  const flipScaleX = isHero ? Math.cos(flip * Math.PI) : 1;
  const showBack = flip > 0.5;

  const opacity = interpolate(appear, [0, 1], [0, 1]) * (1 - vanish);
  const width = 210 * depthScale;
  const height = 150 * depthScale;
  const tilt = 8 + Math.sin(card.from) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2 + idleFloat,
        width,
        height,
        opacity: isHero ? interpolate(appear, [0, 1], [0, 1]) : opacity,
        filter: `blur(${blur}px)`,
        perspective: 900,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
          transform: `scale(${interpolate(appear, [0, 1], [0.8, 1])}) rotateX(${tilt}deg) rotateY(${-14 + settle * 14}deg) scaleX(${flipScaleX})`,
          background: showBack ? `linear-gradient(155deg, ${COLORS.navy}, ${COLORS.blue})` : `linear-gradient(155deg, ${COLORS.white}, ${COLORS.lightBlue})`,
          border: `1px solid ${card.color}3d`,
          boxShadow: `0 30px 60px -28px ${COLORS.navy}44, inset 0 1px 0 rgba(255,255,255,0.6)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!showBack && <TechIcon type={card.icon} color={card.color} size={38 * depthScale} />}
      </div>
    </div>
  );
};

/** Scene 07 — TaaS. A wholly different visual language: floating 3D content cards across
 * several depth planes, revealed one by one and drawn together with a slow camera drift,
 * then settling into an elegant row. The lead card ends the scene with a soft flip. */
export const Scene07Taas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const driftX = interpolate(frame, [0, SETTLE_FROM], [-18, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateX(${driftX}px)` }}>
          {[...CARDS].sort((a, b) => a.depth - b.depth).map((c) => (
            <CardFace key={c.id} card={c} frame={frame} fps={fps} />
          ))}
        </AbsoluteFill>

        <AbsoluteFill>
          <Surface x={960} y={700} width={720} from={SETTLE_TO + 10} align="center">
            <TitleBlock
              title="TaaS"
              subtitle="Training as a Service"
              description="Formación planificada con sesiones presenciales y acceso a contenido formativo."
              from={SETTLE_TO + 16}
              align="center"
              maxWidth={620}
              titleSize={52}
            />
          </Surface>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
