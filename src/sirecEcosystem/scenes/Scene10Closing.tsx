import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONT, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { MiniIcon } from "../components/Icons";
import { KineticTitle, TextBlock, SceneFade, WorldPoint } from "../components/TextBlocks";
import { cameraAt, worldCameraTransform } from "../camera";
import { scene, SERVICES } from "../timeline";

const DUR = scene("closing").duration;

const COL_L = -370;
const COL_R = 370;
const ROWS = [-230, -74, 82, 238];
const HEADER_Y = -430;
const POS: { id: string; x: number; y: number }[] = [
  { id: "inception", x: COL_L, y: ROWS[0] },
  { id: "uaas", x: COL_R, y: ROWS[0] },
  { id: "changeManagement", x: COL_L, y: ROWS[1] },
  { id: "taas", x: COL_R, y: ROWS[1] },
  { id: "sats", x: COL_L, y: ROWS[2] },
  { id: "support", x: COL_R, y: ROWS[2] },
  { id: "cloud", x: 0, y: ROWS[3] },
];

const Chip: React.FC<{ id: string; x: number; y: number; fade: number; scale: number }> = ({ id, x, y, fade, scale }) => {
  const svc = SERVICES.find((s) => s.id === id)!;
  return (
    <WorldPoint
      x={x}
      y={y}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: fade,
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: COLORS.white,
        borderRadius: 18,
        boxShadow: `0 20px 44px -20px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
        padding: "14px 22px",
      }}
    >
      <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(0.62)" }}>
        <MiniIcon id={id} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: COLORS.navySoft, whiteSpace: "nowrap" }}>{svc.title}</span>
    </WorldPoint>
  );
};

export const Scene10Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const secondaryFade = interpolate(frame, [0, 44], [1, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secondaryScale = interpolate(frame, [0, 54], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const syn = spring({ frame: frame - 84, fps, config: SPRING.smooth });
  const headerP = spring({ frame: frame - 6, fps, config: SPRING.smooth });

  const cam = cameraAt(frame, [
    [0, 0, -50, 0.85, 0],
    [70, 0, -20, 0.88, 0],
    [DUR, 0, -6, 0.9, 0],
  ]);

  return (
    <SceneFade duration={DUR} inFrames={20} outFrames={70}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: worldCameraTransform(cam) }}>
          {POS.map((p) => (
            <Chip key={p.id} id={p.id} x={p.x} y={p.y} fade={secondaryFade} scale={secondaryScale} />
          ))}

          <WorldPoint
            x={0}
            y={HEADER_Y}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              background: COLORS.white,
              borderRadius: 28,
              boxShadow: `0 30px 70px -24px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
              padding: "44px 64px",
              opacity: headerP,
              transform: `translate(-50%, -50%) translateY(${interpolate(headerP, [0, 1], [20, 0])}px) scale(${interpolate(headerP, [0, 1], [0.96, 1])})`,
            }}
          >
            <KineticTitle text="SIREC" from={6} fontSize={100} align="center" />
            <TextBlock
              text="Un ecosistema de servicios alrededor de la plataforma"
              from={30}
              fontSize={28}
              weight={600}
              color={COLORS.navy}
              align="center"
              maxWidth={1000}
            />
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: syn,
                transform: `translateY(${interpolate(syn, [0, 1], [14, 0])}px)`,
              }}
            >
              {["Consultoría", "Tecnología", "Formación", "Soporte"].map((w, i) => (
                <React.Fragment key={w}>
                  {i > 0 && <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.turquoise }} />}
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: COLORS.blue, letterSpacing: 0.4 }}>{w}</span>
                </React.Fragment>
              ))}
            </div>
          </WorldPoint>
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
