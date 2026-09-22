import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, FONT, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { FlatAssembly, uaasPieces } from "../components/FlatMark";
import { TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("uaas").duration;
const CANVAS = 210;

export const Scene06Uaas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.max(0, Math.sin(frame / 55)) ** 3;

  const cam = cameraAt(frame, [
    [0, 0, 0, 1.02, 0],
    [DUR, 0, -14, 1.06, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ position: "relative", width: CANVAS, height: CANVAS, marginBottom: 20 }}>
              <FlatAssembly pieces={uaasPieces} size={CANVAS} localFrame={frame} />
              <div
                style={{
                  position: "absolute",
                  left: CANVAS / 2 + 36,
                  top: CANVAS / 2 + 36,
                  width: 100,
                  height: 100,
                  borderRadius: 24,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 0 ${2 + pulse * 10}px ${COLORS.turquoise}${Math.round((0.35 - pulse * 0.3) * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              />
            </div>

            <Card from={30} style={{ padding: "34px 46px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 76,
                    letterSpacing: -2,
                    color: COLORS.navy,
                    opacity: spring({ frame: frame - 36, fps, config: SPRING.snappy }),
                    transform: `translateY(${interpolate(spring({ frame: frame - 36, fps, config: SPRING.snappy }), [0, 1], [24, 0])}px)`,
                  }}
                >
                  UaaS
                </span>
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 500,
                    fontSize: 26,
                    color: COLORS.blue,
                    opacity: spring({ frame: frame - 48, fps, config: SPRING.snappy }),
                  }}
                >
                  Upgrade as a Service
                </span>
              </div>
              <TextBlock
                text="Actualizaciones de software para aprovechar las ventajas de las versiones más recientes del producto."
                from={66}
                fontSize={22}
                weight={500}
                color={COLORS.navySoft}
                align="center"
                maxWidth={820}
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
