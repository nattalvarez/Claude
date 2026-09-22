import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { KineticTitle, TextBlock, Eyebrow, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("cloud").duration;

type CloudPiece = {
  w: number;
  h: number;
  d: number;
  color: string;
  radius: number;
  restX: number;
  restY: number;
  restZ: number;
  delay: number;
  floatAmp?: number;
  floatSpeed?: number;
};

const PIECES: CloudPiece[] = [
  { w: 320, h: 180, d: 34, color: COLORS.navy, radius: 26, restX: 0, restY: 50, restZ: -20, delay: 0 },
  { w: 240, h: 148, d: 28, color: COLORS.blue, radius: 22, restX: 14, restY: -26, restZ: 14, delay: 10 },
  { w: 150, h: 100, d: 22, color: COLORS.turquoise, radius: 18, restX: -30, restY: -92, restZ: 50, delay: 20 },
  { w: 62, h: 62, d: 62, color: COLORS.turquoise, radius: 12, restX: 168, restY: -110, restZ: 80, delay: 34, floatAmp: 14, floatSpeed: 46 },
  { w: 52, h: 52, d: 52, color: COLORS.blue, radius: 10, restX: -180, restY: 60, restZ: 70, delay: 44, floatAmp: 11, floatSpeed: 54 },
];

export const Scene05Cloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbit = Math.sin(frame / 130) * 16;
  const pushIn = interpolate(frame, [210, DUR], [1, 1.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pushX = interpolate(frame, [210, DUR], [0, -260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
              <div style={{ position: "relative", transform: `translateX(${pushX}px) scale(${pushIn})` }}>
                <GroundShadow w={420} style={{ top: 230 }} opacity={0.14} />
                <Stage3D style={{ width: 520, height: 480 }} perspective={1700}>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transformStyle: "preserve-3d",
                      transform: `translate3d(-50%,-50%,0) rotateX(14deg) rotateY(${orbit}deg)`,
                    }}
                  >
                    {PIECES.map((p, i) => {
                      const enter = spring({ frame: frame - p.delay, fps, config: SPRING.smooth });
                      const floatY = p.floatAmp ? Math.sin((frame - p.delay) / (p.floatSpeed ?? 40)) * p.floatAmp * Math.min(1, enter) : 0;
                      const x = interpolate(enter, [0, 1], [p.restX, p.restX]);
                      const y = interpolate(enter, [0, 1], [p.restY - 220, p.restY]) + floatY;
                      const z = interpolate(enter, [0, 1], [p.restZ - 60, p.restZ]);
                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            transformStyle: "preserve-3d",
                            transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                            opacity: enter,
                          }}
                        >
                          <Solid3D w={p.w} h={p.h} d={p.d} color={p.color} radius={p.radius} glow={i >= 3 ? 0.35 : 0} />
                        </div>
                      );
                    })}
                  </div>
                </Stage3D>
              </div>
            </div>

            <Card from={12} fade={pushO} style={{ padding: "40px 44px", maxWidth: 620, display: "flex", flexDirection: "column", gap: 18 }}>
              <Eyebrow text="Servicio 04" from={12} />
              <div>
                <KineticTitle text="SIREC CLOUD" from={18} fontSize={64} style={{ marginBottom: -14 }} />
                <KineticTitle text="SERVICES" from={24} fontSize={64} />
              </div>
              <TextBlock text="Cartera integral de servicios Cloud para operar SIREC." from={64} fontSize={24} weight={600} color={COLORS.navy} lineHeight={1.4} />
              <TextBlock text="Altos niveles de seguridad y escalabilidad." from={96} fontSize={19} weight={500} color={COLORS.navySoft} lineHeight={1.4} />
            </Card>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
