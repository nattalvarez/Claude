import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { Eyebrow, KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("taas").duration;

type Glyph = "doc" | "play" | "book" | "bars" | "dots";

const GlyphMark: React.FC<{ kind: Glyph; color: string }> = ({ kind, color }) => {
  const s = 40;
  if (kind === "play") {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40">
        <polygon points="14,10 30,20 14,30" fill={color} />
      </svg>
    );
  }
  if (kind === "doc") {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40">
        {[12, 18, 24, 30].map((y) => (
          <line key={y} x1={9} y1={y} x2={31} y2={y} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
        ))}
      </svg>
    );
  }
  if (kind === "book") {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40">
        <rect x={7} y={9} width={12} height={22} rx={2} fill="none" stroke={color} strokeWidth={2.2} />
        <rect x={21} y={9} width={12} height={22} rx={2} fill="none" stroke={color} strokeWidth={2.2} />
      </svg>
    );
  }
  if (kind === "bars") {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40">
        <rect x={8} y={24} width={7} height={10} rx={1.5} fill={color} />
        <rect x={17} y={16} width={7} height={18} rx={1.5} fill={color} opacity={0.75} />
        <rect x={26} y={8} width={7} height={26} rx={1.5} fill={color} opacity={0.55} />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 40 40">
      {[10, 20, 30].map((x) => [10, 20, 30].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} fill={color} />))}
    </svg>
  );
};

type CardDef = { x: number; z: number; rz: number; glyph: Glyph; color: string; delay: number };
const CARDS: CardDef[] = [
  { x: -320, z: -50, rz: -9, glyph: "doc", color: COLORS.blue, delay: 0 },
  { x: -160, z: -10, rz: -4, glyph: "play", color: COLORS.turquoise, delay: 12 },
  { x: 0, z: 30, rz: 0, glyph: "book", color: COLORS.navy, delay: 24 },
  { x: 160, z: -10, rz: 4, glyph: "bars", color: COLORS.blue, delay: 36 },
  { x: 320, z: -50, rz: 9, glyph: "dots", color: COLORS.turquoise, delay: 48 },
];
const CENTER_INDEX = 2;

export const Scene07Taas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sway = Math.sin(frame / 110) * 7;
  const cam = cameraAt(frame, [
    [0, 0, 0, 1, 0],
    [DUR, 0, -10, 1.03, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ transform: `translateY(-70px)` }}>
              <GroundShadow w={640} style={{ top: 150 }} opacity={0.1} />
              <Stage3D style={{ width: 760, height: 260 }} perspective={1800}>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transformStyle: "preserve-3d",
                    transform: `translate3d(-50%,-50%,0) rotateY(${sway}deg)`,
                  }}
                >
                  {CARDS.map((c, i) => {
                    const enter = spring({ frame: frame - c.delay, fps, config: SPRING.smooth });
                    const y = interpolate(enter, [0, 1], [140, 0]);
                    const isCenter = i === CENTER_INDEX;
                    const vanish = isCenter
                      ? 0
                      : interpolate(frame, [186 + i * 6, 220 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    const flip = isCenter ? interpolate(frame, [200, 236], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          transformStyle: "preserve-3d",
                          transform: `translate3d(${c.x}px, ${y - vanish * 60}px, ${c.z}px) rotateZ(${c.rz}deg) rotateY(${flip}deg)`,
                          opacity: enter * (1 - vanish),
                          filter: "drop-shadow(0 18px 26px rgba(35,52,86,0.20))",
                        }}
                      >
                        <Solid3D w={140} h={190} d={16} color={COLORS.white} radius={18} />
                        <div style={{ position: "absolute", left: 50, top: 30, transform: "translateZ(9px)" }}>
                          <GlyphMark kind={c.glyph} color={c.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Stage3D>
            </div>

            <Card from={110} style={{ padding: "32px 44px", marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Eyebrow text="Servicio 06" from={110} align="center" />
              <KineticTitle text="TaaS" from={116} fontSize={70} per={4} />
              <TextBlock text="Training as a Service" from={128} fontSize={24} weight={700} color={COLORS.blue} align="center" />
              <TextBlock
                text="Formación planificada con sesiones presenciales y acceso a contenido formativo."
                from={150}
                fontSize={21}
                weight={500}
                color={COLORS.navySoft}
                align="center"
                maxWidth={740}
                lineHeight={1.4}
              />
            </Card>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
