import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, FONT_FAMILY } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { TitleBlock } from "../components/TitleBlock";

const DURATION = SCENE_DURATIONS.closing;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const RING_COUNT = 9;

const RING = Array.from({ length: RING_COUNT }).map((_, i) => {
  const angle = (i / RING_COUNT) * Math.PI * 2 - Math.PI / 2;
  return { id: i, angle, color: i % 2 === 0 ? COLORS.blue : COLORS.turquoise };
});

const RING_FADE_FROM = 54;
const RING_FADE_TO = 90;
const TEXT_FROM = 98;

/** Scene 03 — Cierre. The nine-node schema withdraws — its small ring shrinks and fades
 * away completely — before a closing line in the intro's own register appears cleanly on
 * white, then fades out. Sequential, not simultaneous: the ring is gone before the text
 * arrives, so nothing collides. No new claims — a calm closing beat that leaves the
 * structure, not the details, as the last impression. */
export const Scene03Closing: React.FC = () => {
  const frame = useCurrentFrame();

  const radius = interpolate(frame, [0, RING_FADE_TO], [340, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const ringOpacity = interpolate(frame, [RING_FADE_FROM, RING_FADE_TO], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  const wordmarkAppear = interpolate(frame, [TEXT_FROM, TEXT_FROM + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });

  const finalFade = interpolate(frame, [DURATION - 40, DURATION - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  const ringPositions = useMemo(() => RING.map((n) => ({ ...n })), []);

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <AbsoluteFill style={{ opacity: finalFade }}>
        <AbsoluteFill style={{ opacity: ringOpacity }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            {ringPositions.map((n) => {
              const x = CENTER.x + Math.cos(n.angle) * radius;
              const y = CENTER.y + Math.sin(n.angle) * radius * 0.7;
              return <ConnectionLine key={n.id} x1={CENTER.x} y1={CENTER.y} x2={x} y2={y} from={6} duration={18} color={n.color} strokeWidth={1} opacity={0.25} />;
            })}
          </svg>

          {ringPositions.map((n) => {
            const x = CENTER.x + Math.cos(n.angle) * radius;
            const y = CENTER.y + Math.sin(n.angle) * radius * 0.7;
            return <Node3D key={n.id} x={x} y={y} size={14} color={n.color} from={n.id * 4} opacity={0.7} />;
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 100,
                letterSpacing: -2,
                color: COLORS.navy,
                opacity: wordmarkAppear,
                transform: `translateY(${interpolate(wordmarkAppear, [0, 1], [14, 0])}px) scale(${interpolate(wordmarkAppear, [0, 1], [0.94, 1])})`,
              }}
            >
              SIREC
            </div>
            <div style={{ marginTop: 22 }}>
              <TitleBlock
                subtitle="Un modelo que evoluciona contigo"
                description="De la prevención a la resolución, en cada etapa del riesgo"
                from={TEXT_FROM + 12}
                align="center"
                maxWidth={860}
              />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
