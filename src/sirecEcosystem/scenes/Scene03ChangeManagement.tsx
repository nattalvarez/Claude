import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { PieceAssembly, changeManagementPieces } from "../components/Icons";
import { KineticTitle, TextBlock, Eyebrow, Card, SceneFade } from "../components/TextBlocks";
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

  const spinOut = interpolate(frame, [180, DUR], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px" }}>
            <div style={{ width: "52%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  transform: `translateY(${Math.sin(frame / 50) * 8}px) rotateY(${
                    interpolate(frame, [70, 180], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + spinOut
                  }deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <PieceAssembly pieces={changeManagementPieces} localFrame={frame} size={420} exitStart={198} />
              </div>
            </div>

            <div style={{ width: "48%", display: "flex", flexDirection: "column", gap: 22 }}>
              <Eyebrow text="Servicio 02" from={10} />
              <KineticTitle text="CHANGE" from={16} fontSize={80} style={{ marginBottom: -18 }} />
              <KineticTitle text="MANAGEMENT" from={22} fontSize={80} />
              <Card from={46} style={{ padding: "30px 34px", maxWidth: 580, marginTop: 6, display: "flex", flexDirection: "column", gap: 10 }}>
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
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
