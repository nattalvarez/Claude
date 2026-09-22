import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { FlatAssembly, satsPieces, CheckGlyph } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("sats").duration;
const CANVAS = 260;

export const Scene04Sats: React.FC = () => {
  const frame = useCurrentFrame();

  const lift = interpolate(frame, [220, DUR], [0, -46], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cam = cameraAt(frame, [
    [0, 0, 0, 1, 0],
    [200, 0, 0, 1, 0],
    [DUR, 0, -30, 1.14, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", transform: `translateY(${-140 + lift}px)` }}>
              <FlatAssembly pieces={satsPieces} size={CANVAS} localFrame={frame} />
              {satsPieces.map((c, i) => {
                const checkP = interpolate(frame, [(c.delay ?? 0) + 18, (c.delay ?? 0) + 32], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: CANVAS / 2 + c.x + c.w / 2 - 12,
                      top: CANVAS / 2 + c.y - c.w / 2 - 12,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: COLORS.turquoise,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${interpolate(checkP, [0, 1], [0.3, 1])})`,
                      opacity: checkP,
                      boxShadow: `0 6px 16px -4px ${COLORS.shadow}`,
                    }}
                  >
                    <CheckGlyph size={16} color={COLORS.white} p={checkP} />
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>

          <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
            <Card from={92} style={{ padding: "36px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <KineticTitle text="SATS" from={92} fontSize={88} align="center" />
              <TextBlock text="SIREC Automated Testing Suite" from={118} fontSize={24} weight={700} color={COLORS.blue} align="center" />
              <TextBlock
                text="Automatización de pruebas para SIREC que ayuda a reducir costes y mejorar el time to market."
                from={148}
                fontSize={22}
                weight={500}
                color={COLORS.navySoft}
                align="center"
                maxWidth={760}
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
