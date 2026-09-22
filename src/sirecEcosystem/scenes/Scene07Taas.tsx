import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Chip, GlyphMark, Glyph } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("taas").duration;

type CardDef = { x: number; rot: number; glyph: Glyph; color: string; delay: number };
const CARDS: CardDef[] = [
  { x: -300, rot: -9, glyph: "doc", color: COLORS.blue, delay: 0 },
  { x: -150, rot: -4, glyph: "play", color: COLORS.turquoise, delay: 10 },
  { x: 0, rot: 0, glyph: "book", color: COLORS.navy, delay: 20 },
  { x: 150, rot: 4, glyph: "bars", color: COLORS.blue, delay: 30 },
  { x: 300, rot: 9, glyph: "dots", color: COLORS.turquoise, delay: 40 },
];

export const Scene07Taas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
            <div style={{ position: "relative", width: 700, height: 220, marginBottom: 8 }}>
              {CARDS.map((c, i) => {
                const enter = spring({ frame: frame - c.delay, fps, config: SPRING.smooth });
                const y = interpolate(enter, [0, 1], [110, i === 2 ? -10 : 0]);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 350 + c.x,
                      top: 110 + y,
                      transform: `translate(-50%, -50%) rotate(${c.rot}deg) scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
                      opacity: enter,
                    }}
                  >
                    <Chip w={140} h={186} radius={18} color={COLORS.white} style={{ boxShadow: `0 20px 40px -18px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}` }} />
                    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                      <GlyphMark kind={c.glyph} color={c.color} size={38} />
                    </div>
                  </div>
                );
              })}
            </div>

            <Card from={30} style={{ padding: "32px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <KineticTitle text="TaaS" from={36} fontSize={70} per={4} />
              <TextBlock text="Training as a Service" from={48} fontSize={24} weight={700} color={COLORS.blue} align="center" />
              <TextBlock
                text="Formación planificada con sesiones presenciales y acceso a contenido formativo."
                from={70}
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
