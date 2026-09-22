import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, SPRING, EASE, WIDTH, HEIGHT } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { Solid3D, Stage3D, GroundShadow } from "../components/Primitives3D";
import { KineticTitle, TextBlock, SceneFade } from "../components/TextBlocks";
import { cameraAt, cameraTransform } from "../camera";
import { scene } from "../timeline";

const DUR = scene("intro").duration;

const driftShapes = [
  { x: -360, y: -220, size: 16, kind: "circle" as const, delay: 40 },
  { x: 340, y: -260, size: 12, kind: "dot" as const, delay: 55 },
  { x: -420, y: 160, size: 20, kind: "square" as const, delay: 70 },
  { x: 400, y: 210, size: 14, kind: "dot" as const, delay: 85 },
  { x: 0, y: -320, size: 10, kind: "dot" as const, delay: 100 },
];

const MicroShape: React.FC<{ x: number; y: number; size: number; kind: "circle" | "square" | "dot"; delay: number; frame: number; fps: number }> = ({
  x,
  y,
  size,
  kind,
  delay,
  frame,
  fps,
}) => {
  const p = spring({ frame: frame - delay, fps, config: SPRING.gentle });
  const drift = Math.sin((frame - delay) / 60) * 10;
  const common: React.CSSProperties = {
    position: "absolute",
    left: WIDTH / 2 + x,
    top: HEIGHT / 2 + y + drift,
    width: size,
    height: size,
    opacity: p * 0.5,
    transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`,
  };
  if (kind === "dot") return <div style={{ ...common, borderRadius: "50%", background: COLORS.turquoise }} />;
  if (kind === "square") return <div style={{ ...common, borderRadius: 4, border: `2px solid ${COLORS.blue}` }} />;
  return <div style={{ ...common, borderRadius: "50%", border: `2px solid ${COLORS.blue}` }} />;
};

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cubeIn = spring({ frame: frame - 4, fps, config: SPRING.gentle });
  const cubeScale = interpolate(cubeIn, [0, 1], [0.3, 1]);
  const rotY = frame * 0.55;
  const rotX = 18 + Math.sin(frame / 90) * 6;

  const growScale = interpolate(frame, [30, 150], [1, 1.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const shiftX = interpolate(frame, [168, 210], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const shiftScale = interpolate(frame, [168, 210], [1, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const textShift = interpolate(frame, [168, 210], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });
  const textFade = interpolate(frame, [168, 205], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });

  const cam = cameraAt(frame, [
    [0, 0, 20, 1, 0],
    [150, 0, -10, 1.05, 0],
    [220, 240, -10, 1.02, 0],
  ]);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: cameraTransform(cam), transformOrigin: "50% 50%" }}>
          {driftShapes.map((s, i) => (
            <MicroShape key={i} {...s} frame={frame} fps={fps} />
          ))}

          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                transform: `translateX(${shiftX}px) translateY(-70px) scale(${cubeScale * growScale * shiftScale})`,
              }}
            >
              <GroundShadow w={180} style={{ top: 150 }} opacity={0.14} />
              <Stage3D style={{ width: 220, height: 220 }} perspective={1200}>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transformStyle: "preserve-3d",
                    transform: `translate3d(-50%,-50%,0) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  }}
                >
                  <Solid3D w={150} color={COLORS.blue} radius={22} glow={0.5} />
                </div>
              </Stage3D>
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 300,
              opacity: textFade,
              transform: `translateY(${textShift}px)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              <KineticTitle text="SIREC" from={58} fontSize={116} weight={900} align="center" letterSpacing={-2} />
              <TextBlock
                text="Un ecosistema de servicios alrededor de la plataforma"
                from={98}
                fontSize={34}
                weight={700}
                color={COLORS.navy}
                align="center"
                maxWidth={1000}
              />
              <TextBlock
                text="Soluciones especializadas para acompañar todo el ciclo de vida de SIREC"
                from={126}
                fontSize={22}
                weight={500}
                color={COLORS.navySoft}
                align="center"
                maxWidth={780}
              />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
