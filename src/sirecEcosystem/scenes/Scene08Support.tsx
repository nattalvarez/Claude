import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING, EASE } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Chip } from "../components/FlatMark";
import { KineticTitle, TextBlock, Pill, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("support").duration;

export const Scene08Support: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const approach = spring({ frame: frame - 6, fps, config: SPRING.gentle });
  const partFrame = interpolate(frame, [188, DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const leftX = interpolate(approach, [0, 1], [-256, -46]) + partFrame * -136;
  const rightX = interpolate(approach, [0, 1], [256, 46]) + partFrame * 136;

  const meetGlow = interpolate(approach, [0.75, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - partFrame);
  const pulse = 0.6 + Math.sin(frame / 20) * 0.4;

  const cam = cameraAt(frame, [
    [0, 0, 0, 1.05, 0],
    [140, 0, 0, 1, 0],
    [DUR, 0, -12, 0.94, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${COLORS.white} 45%, ${COLORS.lightBlue} 100%)`,
            opacity: 0.55,
          }}
        />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ position: "relative", width: 320, height: 192, marginBottom: 8 }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 128,
                  height: 128,
                  transform: "translate(-50%,-50%)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${COLORS.turquoise}55, transparent 70%)`,
                  filter: "blur(18px)",
                  opacity: meetGlow * (0.5 + pulse * 0.3),
                }}
              />
              <div style={{ position: "absolute", left: 160 + leftX, top: 96, transform: "translate(-50%, -50%)", opacity: approach }}>
                <Chip w={100} h={130} radius={20} color={COLORS.navy} />
              </div>
              <div style={{ position: "absolute", left: 160 + rightX, top: 101, transform: "translate(-50%, -50%)", opacity: approach }}>
                <Chip w={115} h={100} radius={20} color={COLORS.turquoise} />
              </div>
            </div>

            <Card from={110} style={{ padding: "42px 54px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <KineticTitle text="DEDICATED SUPPORT" from={116} fontSize={84} align="center" />
              <TextBlock
                text="Asignación directa de especialistas de SIREC a un cliente."
                from={148}
                fontSize={28}
                weight={600}
                color={COLORS.navy}
                align="center"
                maxWidth={840}
              />
              <TextBlock text="De manera temporal o permanente." from={166} fontSize={24} weight={500} color={COLORS.navySoft} align="center" />
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <Pill text="Temporal" from={188} color={COLORS.navy} bg={COLORS.lightBlue} />
                <Pill text="Permanente" from={198} color={COLORS.white} bg={COLORS.blue} />
              </div>
            </Card>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
