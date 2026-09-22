import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { FlatAssembly, changeManagementPieces } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("changeManagement").duration;

export const Scene03ChangeManagement: React.FC = () => {
  const frame = useCurrentFrame();

  const cam = cameraAt(frame, [
    [0, -40, 0, 1.04, 0],
    [90, 0, 0, 1, 0],
    [DUR, 30, -8, 1.05, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px" }}>
            <div style={{ width: "52%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: `translateY(${Math.sin(frame / 50) * 8}px)` }}>
                <FlatAssembly pieces={changeManagementPieces} size={420} localFrame={frame} exitStart={198} />
              </div>
            </div>

            <Card from={10} style={{ padding: "44px 48px", maxWidth: 620, display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <KineticTitle text="CHANGE" from={16} fontSize={80} style={{ marginBottom: -18 }} />
                <KineticTitle text="MANAGEMENT" from={22} fontSize={80} />
              </div>
              <TextBlock text="Impulsa la adopción y el máximo aprovechamiento de SIREC." from={56} fontSize={25} weight={600} color={COLORS.navy} lineHeight={1.4} />
              <TextBlock
                text="Modelo de gestión especializado para las organizaciones."
                from={78}
                fontSize={19}
                weight={500}
                color={COLORS.navySoft}
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
