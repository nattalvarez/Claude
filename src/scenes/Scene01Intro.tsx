import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, FONT_FAMILY } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { PulseRings } from "../components/PulseRings";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const CORE = { x: WIDTH / 2, y: 420 };
const DURATION = SCENE_DURATIONS.intro;

const SATELLITES = Array.from({ length: 7 }).map((_, i) => {
  const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
  const radius = seededRange(`s01-r-${i}`, 175, 265);
  return {
    id: `sat-${i}`,
    x: CORE.x + Math.cos(angle) * radius,
    y: CORE.y + Math.sin(angle) * radius * 0.72,
    size: seededRange(`s01-sz-${i}`, 10, 16),
    delay: 46 + i * 7,
    depth: seededRange(`s01-d-${i}`, 0.6, 1),
  };
});

const DEPTH_RINGS = [
  { r: 520, blur: 60, delay: 96, opacity: 0.05, color: COLORS.blue },
  { r: 700, blur: 90, delay: 110, opacity: 0.04, color: COLORS.turquoise },
  { r: 380, blur: 40, delay: 84, opacity: 0.05, color: COLORS.navy },
];

/** Scene 01 — El núcleo. A single point becomes a lit tech node; satellites and
 * connections build around it in staggered layers; a horizontal line sweeps through and
 * uncovers the title. Ends zoomed toward the core so Scene02 can be born from inside it. */
export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();

  // whole-structure camera: a slow zoom toward the core for the full scene, with a
  // faster final push in the last 45 frames that hands off into Scene02's overlap.
  const zoomBase = interpolate(frame, [0, DURATION - 45], [1, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const zoomFinal = interpolate(frame, [DURATION - 45, DURATION], [1, 2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.6, 0, 0.9, 0.2),
  });
  const zoom = zoomBase * zoomFinal;

  // the point → node growth
  const pointToNode = interpolate(frame, [0, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  const coreSize = interpolate(pointToNode, [0, 1], [6, 64]);

  // sweep line that reveals the title
  const sweepFrom = 132;
  const sweepDur = 30;
  const sweepProgress = interpolate(frame, [sweepFrom, sweepFrom + sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const titleFrom = sweepFrom + 6;

  // title exits before the final zoom-push, so only the pure node structure remains
  const titleExit = interpolate(frame, [DURATION - 60, DURATION - 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });
  const titleExitY = interpolate(frame, [DURATION - 60, DURATION - 44], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgFieldOpacity = interpolate(frame, [DURATION - 40, DURATION - 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const depthDrift = Math.sin(frame / 140) * 14;

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={18}>
        {/* depth layer — soft rings suggesting planes behind the node cluster */}
        <AbsoluteFill style={{ opacity: bgFieldOpacity }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            {DEPTH_RINGS.map((ring, i) => {
              const o = interpolate(frame, [ring.delay, ring.delay + 40], [0, ring.opacity], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <circle
                  key={i}
                  cx={CORE.x + depthDrift * (i % 2 === 0 ? 1 : -1)}
                  cy={CORE.y}
                  r={ring.r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={1}
                  opacity={o}
                />
              );
            })}
          </svg>
        </AbsoluteFill>

        {/* main structure — zooms toward the core as the scene ends */}
        <AbsoluteFill
          style={{
            opacity: bgFieldOpacity + (1 - bgFieldOpacity),
            transform: `scale(${zoom})`,
            transformOrigin: `${CORE.x}px ${CORE.y}px`,
          }}
        >
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <PulseRings cx={CORE.x} cy={CORE.y} from={20} interval={46} count={3} startRadius={40} maxRadius={260} maxOpacity={0.14} color={COLORS.blue} />
            {SATELLITES.map((s) => (
              <ConnectionLine
                key={`line-${s.id}`}
                x1={CORE.x}
                y1={CORE.y}
                x2={s.x}
                y2={s.y}
                from={s.delay + 14}
                duration={22}
                color={COLORS.turquoise}
                strokeWidth={1.2}
                opacity={0.4 * s.depth}
              />
            ))}
          </svg>

          {SATELLITES.map((s) => (
            <Node3D key={s.id} x={s.x} y={s.y} size={s.size} color={COLORS.turquoise} from={s.delay} opacity={s.depth} />
          ))}

          <Node3D x={CORE.x} y={CORE.y} size={coreSize} color={COLORS.blue} from={0} core breathe opacity={interpolate(pointToNode, [0, 1], [0.4, 1])} />
        </AbsoluteFill>

        {/* sweep line + title reveal */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 118, opacity: titleExit }}>
          <div style={{ position: "relative", transform: `translateY(${titleExitY}px)` }}>
            <div
              style={{
                position: "absolute",
                left: -420,
                top: -6,
                width: 840,
                height: 2,
                transform: `scaleX(${sweepProgress})`,
                transformOrigin: "left center",
                background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.turquoise}, transparent)`,
              }}
            />
            <div
              style={{
                clipPath: `inset(0 ${(1 - sweepProgress) * 100}% 0 0)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 108,
                  letterSpacing: -2,
                  color: COLORS.navy,
                  lineHeight: 1,
                }}
              >
                SIREC
              </div>
            </div>

            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TitleBlock
                subtitle="Un ecosistema que evoluciona contigo"
                description="Servicios especializados para acompañar todo el ciclo de vida de la plataforma"
                from={titleFrom + 26}
                align="center"
                maxWidth={880}
              />
            </div>
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
