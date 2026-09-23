import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, FONT_FAMILY } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";

const DURATION = SCENE_DURATIONS.endCard;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

const RING = Array.from({ length: 6 }).map((_, i) => {
  const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return { id: i, angle, color: i % 2 === 0 ? COLORS.blue : COLORS.turquoise };
});

/** Scene 10 — End card. What remains once the ecosystem settles: the SIREC wordmark with
 * a small ring of nodes shrinking gently around it, then a clean fade to white. No new
 * claims — purely a calm closing beat. */
export const Scene10EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const radius = interpolate(frame, [0, DURATION], [230, 96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const wordmarkAppear = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });

  const finalFade = interpolate(frame, [DURATION - 26, DURATION - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  const ringPositions = useMemo(
    () =>
      RING.map((n) => ({
        ...n,
      })),
    []
  );

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <AbsoluteFill style={{ opacity: finalFade }}>
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

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
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
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
