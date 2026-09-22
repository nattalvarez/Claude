import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";
import { COLORS, FONT, SPRING, EASE, shade } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { Eyebrow, TextBlock, Card, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("uaas").duration;
const SIZE = 190;
const LAYER_D = 58;

const swapPulse = (frame: number, start: number, dur: number) => {
  const half = dur / 2;
  const out = interpolate(frame, [start, start + half], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const back = interpolate(frame, [start + half, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });
  return Math.min(out, back);
};

export const Scene06Uaas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 4, fps, config: SPRING.smooth });
  const topSwap = swapPulse(frame, 58, 68);
  const midSwap = swapPulse(frame, 132, 68);

  const rotY = 22 + Math.sin(frame / 90) * 8;

  const cam = cameraAt(frame, [
    [0, 0, 0, 1.02, 0],
    [DUR, 0, -14, 1.06, 0],
  ]);

  const topColor = topSwap > 0.5 ? shade(COLORS.turquoise, 0.2) : COLORS.turquoise;
  const midColor = midSwap > 0.5 ? shade(COLORS.blue, 0.16) : COLORS.blue;

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ position: "relative", transform: `translateY(${-80 + interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.6, 1])})`, opacity: enter }}>
              <GroundShadow w={220} style={{ top: 150 }} opacity={0.15} />
              <Stage3D style={{ width: 300, height: 300 }} perspective={1400}>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transformStyle: "preserve-3d",
                    transform: `translate3d(-50%,-50%,0) rotateX(16deg) rotateY(${rotY}deg)`,
                  }}
                >
                  <div style={{ position: "absolute", transform: `translate3d(0px,0px,${-LAYER_D}px)` }}>
                    <Solid3D w={SIZE} h={SIZE} d={LAYER_D} color={COLORS.navy} radius={20} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      transform: `translate3d(${interpolate(midSwap, [0, 1], [0, 220])}px,0px,0px) rotateY(${interpolate(midSwap, [0, 1], [0, 50])}deg)`,
                    }}
                  >
                    <Solid3D w={SIZE} h={SIZE} d={LAYER_D} color={midColor} radius={20} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      transform: `translate3d(${interpolate(topSwap, [0, 1], [0, -220])}px,0px,${LAYER_D}px) rotateY(${interpolate(topSwap, [0, 1], [0, -50])}deg)`,
                    }}
                  >
                    <Solid3D w={SIZE} h={SIZE} d={LAYER_D} color={topColor} radius={20} glow={0.3} />
                  </div>
                </div>
              </Stage3D>
            </div>

            <Card from={150} style={{ padding: "34px 46px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 44 }}>
              <Eyebrow text="Servicio 05" from={150} align="center" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 76,
                    letterSpacing: -2,
                    color: COLORS.navy,
                    opacity: spring({ frame: frame - 156, fps, config: SPRING.snappy }),
                    transform: `translateY(${interpolate(spring({ frame: frame - 156, fps, config: SPRING.snappy }), [0, 1], [24, 0])}px)`,
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
                    opacity: spring({ frame: frame - 168, fps, config: SPRING.snappy }),
                  }}
                >
                  Upgrade as a Service
                </span>
              </div>
              <TextBlock
                text="Actualizaciones de software para aprovechar las ventajas de las versiones más recientes del producto."
                from={186}
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
