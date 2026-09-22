import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { CheckGlyph, satsCubeGrid } from "../components/Icons";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("sats").duration;
const CUBE = 62;

export const Scene04Sats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
            <div style={{ transform: `translateY(${-140 + lift}px)`, position: "relative" }}>
              <GroundShadow w={360} style={{ top: 190 }} opacity={0.12} />
              <Stage3D style={{ width: 420, height: 300 }} perspective={1500}>
                {satsCubeGrid.map((c, i) => {
                  const sp = spring({ frame: frame - c.delay, fps, config: { damping: 13, stiffness: 165, mass: 0.6 } });
                  const y = interpolate(sp, [0, 1], [c.y - 220, c.y]);
                  const rot = interpolate(sp, [0, 1], [70, 0]);
                  const checkP = interpolate(frame, [c.delay + 16, c.delay + 30], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const color = i % 2 === 0 ? COLORS.navy : COLORS.blue;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transformStyle: "preserve-3d",
                        transform: `translate3d(${c.x}px, ${y}px, 0px)`,
                        opacity: sp,
                      }}
                    >
                      <Solid3D w={CUBE} color={color} radius={10} rx={rot * 0.3} ry={rot} />
                      <div
                        style={{
                          position: "absolute",
                          left: CUBE / 2 - 13,
                          top: -CUBE / 2 - 6,
                          transform: "translateZ(48px)",
                        }}
                      >
                        <div
                          style={{
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
                      </div>
                    </div>
                  );
                })}
              </Stage3D>
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
