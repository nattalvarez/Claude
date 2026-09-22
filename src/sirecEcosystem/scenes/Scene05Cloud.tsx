import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { FlatAssembly, cloudPieces, Chip } from "../components/FlatMark";
import { KineticTitle, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("cloud").duration;
const CANVAS = 190;

const DOTS = [
  { x: 106, y: -68, size: 20, color: COLORS.turquoise, delay: 30, speed: 46 },
  { x: -108, y: 42, size: 17, color: COLORS.blue, delay: 40, speed: 54 },
];

export const Scene05Cloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pushIn = interpolate(frame, [210, DUR], [1, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pushX = interpolate(frame, [210, DUR], [0, -220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pushO = interpolate(frame, [230, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cam = cameraAt(frame, [
    [0, -160, 0, 1.02, 0],
    [110, 0, -10, 1, 0],
    [DUR, 40, 0, 1.02, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />
        <div
          style={{
            position: "absolute",
            left: -300,
            bottom: -260,
            width: 1300,
            height: 1300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.lightBlue} 0%, transparent 60%)`,
            opacity: 0.75,
          }}
        />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 130px" }}>
            <div style={{ width: "56%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: CANVAS, height: CANVAS, transform: `translateX(${pushX}px) scale(${pushIn})` }}>
                <FlatAssembly pieces={cloudPieces} size={CANVAS} localFrame={frame} />
                {DOTS.map((d, i) => {
                  const enter = spring({ frame: frame - d.delay, fps, config: SPRING.smooth });
                  const floatY = Math.sin((frame - d.delay) / d.speed) * 12 * Math.min(1, enter);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: CANVAS / 2 + d.x,
                        top: CANVAS / 2 + d.y + floatY,
                        transform: `translate(-50%, -50%) scale(${interpolate(enter, [0, 1], [0.4, 1])})`,
                        opacity: enter,
                      }}
                    >
                      <Chip w={d.size} radius={d.size / 2} color={d.color} />
                    </div>
                  );
                })}
              </div>
            </div>

            <Card from={12} fade={pushO} style={{ padding: "46px 50px", maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <KineticTitle text="SIREC CLOUD" from={18} fontSize={86} style={{ marginBottom: -18 }} />
                <KineticTitle text="SERVICES" from={24} fontSize={86} />
              </div>
              <TextBlock text="Cartera integral de servicios Cloud para operar SIREC." from={64} fontSize={30} weight={600} color={COLORS.navy} lineHeight={1.4} />
              <TextBlock text="Altos niveles de seguridad y escalabilidad." from={96} fontSize={24} weight={500} color={COLORS.navySoft} lineHeight={1.4} />
            </Card>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
