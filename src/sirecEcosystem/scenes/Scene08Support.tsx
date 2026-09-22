import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING, EASE } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { Eyebrow, KineticTitle, TextBlock, Pill, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("support").duration;

export const Scene08Support: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const approach = spring({ frame: frame - 6, fps, config: SPRING.gentle });
  const partFrame = interpolate(frame, [188, DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const leftX = interpolate(approach, [0, 1], [-520, -44]) + partFrame * -190;
  const rightX = interpolate(approach, [0, 1], [520, 44]) + partFrame * 190;
  const leftRot = interpolate(approach, [0, 1], [-14, 0]);
  const rightRot = interpolate(approach, [0, 1], [14, 0]);

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
            <div style={{ position: "relative", transform: "translateY(-60px)" }}>
              <GroundShadow w={420} style={{ top: 150 }} opacity={0.14} />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 160,
                  height: 160,
                  transform: "translate(-50%,-50%)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${COLORS.turquoise}55, transparent 70%)`,
                  filter: "blur(20px)",
                  opacity: meetGlow * (0.5 + pulse * 0.3),
                }}
              />
              <Stage3D style={{ width: 560, height: 320 }} perspective={1600}>
                <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: "translate3d(-50%,-50%,0) rotateX(10deg)" }}>
                  <div style={{ position: "absolute", transform: `translate3d(${leftX}px, 0px, 20px) rotateZ(${leftRot}deg)`, opacity: approach }}>
                    <Solid3D w={190} h={230} d={38} color={COLORS.navy} radius={28} glow={0.25} />
                  </div>
                  <div style={{ position: "absolute", transform: `translate3d(${rightX}px, 6px, -14px) rotateZ(${rightRot}deg)`, opacity: approach }}>
                    <Solid3D w={230} h={190} d={38} color={COLORS.turquoise} radius={28} glow={0.25} />
                  </div>
                </div>
              </Stage3D>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 30 }}>
              <Eyebrow text="Servicio 07" from={110} align="center" />
              <KineticTitle text="DEDICATED SUPPORT" from={116} fontSize={62} align="center" />
              <TextBlock
                text="Asignación directa de especialistas de SIREC a un cliente."
                from={148}
                fontSize={23}
                weight={600}
                color={COLORS.navy}
                align="center"
                maxWidth={760}
              />
              <TextBlock text="De manera temporal o permanente." from={166} fontSize={19} weight={500} color={COLORS.navySoft} align="center" />
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <Pill text="Temporal" from={188} color={COLORS.navy} bg={COLORS.lightBlue} />
                <Pill text="Permanente" from={198} color={COLORS.white} bg={COLORS.blue} />
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
