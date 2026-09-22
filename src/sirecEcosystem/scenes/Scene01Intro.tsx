import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, SPRING, EASE } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Chip } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("intro").duration;

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame: frame - 4, fps, config: SPRING.gentle });
  const markScale = interpolate(markIn, [0, 1], [0.4, 1]);
  const breathe = 1 + Math.sin(frame / 45) * 0.015;

  const growScale = interpolate(frame, [30, 150], [1, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const shiftX = interpolate(frame, [168, 210], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const shiftScale = interpolate(frame, [168, 210], [1, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const textShift = interpolate(frame, [168, 210], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });
  const textFade = interpolate(frame, [168, 205], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });

  const cam = cameraAt(frame, [
    [0, 0, 20, 1, 0],
    [150, 0, -10, 1.05, 0],
    [220, 240, -10, 1.02, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: 170,
                height: 170,
                transform: `translateX(${shiftX}px) translateY(-190px) scale(${markScale * growScale * shiftScale * breathe})`,
              }}
            >
              <Chip w={170} radius={32} color={COLORS.navy} />
              <div style={{ position: "absolute", left: 46, top: 46 }}>
                <Chip w={90} radius={20} color={COLORS.turquoise} />
              </div>
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 470,
              opacity: textFade,
              transform: `translateY(${textShift}px)`,
            }}
          >
            <Card from={50} style={{ padding: "40px 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <KineticTitle text="SIREC" from={58} fontSize={116} weight={900} align="center" letterSpacing={-2} />
              <TextBlock
                text="Un ecosistema de servicios alrededor de la plataforma"
                from={98}
                fontSize={34}
                weight={700}
                color={COLORS.navy}
                align="center"
                maxWidth={1000}
              />
              <TextBlock
                text="Soluciones especializadas para acompañar todo el ciclo de vida de SIREC"
                from={126}
                fontSize={22}
                weight={500}
                color={COLORS.navySoft}
                align="center"
                maxWidth={780}
              />
            </Card>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
