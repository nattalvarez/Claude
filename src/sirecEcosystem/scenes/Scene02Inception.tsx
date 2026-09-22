import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { FlatAssembly, inceptionPieces } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("inception").duration;

export const Scene02Inception: React.FC = () => {
  const frame = useCurrentFrame();

  const cam = cameraAt(frame, [
    [0, 40, 0, 1.04, 0],
    [90, 0, -6, 1, 0],
    [DUR, -30, -10, 1.03, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />
        <div
          style={{
            position: "absolute",
            right: -260,
            top: -180,
            width: 1100,
            height: 1100,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.lightBlue} 0%, transparent 62%)`,
            opacity: 0.7,
          }}
        />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px" }}>
            <Card from={10} style={{ padding: "44px 48px", maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>
              <KineticTitle text="INCEPTION" from={16} fontSize={92} />
              <TextBlock
                text="Consultoría y acompañamiento experto durante la definición de un proyecto."
                from={54}
                fontSize={25}
                weight={500}
                color={COLORS.navySoft}
                lineHeight={1.42}
              />
            </Card>

            <div style={{ width: "52%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: `translateY(${Math.sin(frame / 55) * 8}px)` }}>
                <FlatAssembly pieces={inceptionPieces} size={380} localFrame={frame} exitStart={196} />
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
