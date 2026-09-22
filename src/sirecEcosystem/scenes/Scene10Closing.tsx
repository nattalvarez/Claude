import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONT, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { ServiceMark, ServiceId } from "../components/FlatMark";
import { KineticTitle, TextBlock, SceneFade, WorldPoint } from "../components/TextBlocks";
import { worldCameraTransform, CamState } from "../camera";
import { scene, SERVICES } from "../timeline";

const DUR = scene("closing").duration;

const COL_L = -300;
const COL_R = 300;
const ROWS = [-170, -55, 60, 175];
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

// A calm, static view — everything is already framed to fit, so nothing
// needs to pan or zoom to be seen. Only a very small settle-in scale on the
// whole group, once, instead of a camera move.
const STATIC_CAM: CamState = { x: 0, y: -110, scale: 0.88, rotate: 0 };

const Chip: React.FC<{ id: string; x: number; y: number; delay: number }> = ({ id, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  const svc = SERVICES.find((s) => s.id === id)!;
  return (
    <WorldPoint
      x={x}
      y={y}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: p,
        transform: `translate(-50%, -50%) translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        background: COLORS.white,
        borderRadius: 20,
        boxShadow: `0 20px 44px -20px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
        padding: "16px 28px",
      }}
    >
      <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <ServiceMark id={id as ServiceId} size={40} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: COLORS.navy, whiteSpace: "nowrap" }}>{svc.title}</span>
    </WorldPoint>
  );
};

export const Scene10Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame: frame - 6, fps, config: SPRING.smooth });
  const syn = spring({ frame: frame - 26, fps, config: SPRING.smooth });

  return (
    <SceneFade duration={DUR} inFrames={20} outFrames={70}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: worldCameraTransform(STATIC_CAM) }}>
          {POS.map((p, i) => (
            <Chip key={p.id} id={p.id} x={p.x} y={p.y} delay={10 + i * 4} />
          ))}

          <WorldPoint
            x={0}
            y={HEADER_Y}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              background: COLORS.white,
              borderRadius: 28,
              boxShadow: `0 30px 70px -24px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
              padding: "48px 72px",
              opacity: headerP,
              transform: `translate(-50%, -50%) translateY(${interpolate(headerP, [0, 1], [20, 0])}px) scale(${interpolate(headerP, [0, 1], [0.96, 1])})`,
            }}
          >
            <KineticTitle text="SIREC" from={6} fontSize={124} align="center" />
            <TextBlock
              text="Un ecosistema de servicios alrededor de la plataforma"
              from={16}
              fontSize={32}
              weight={600}
              color={COLORS.navy}
              align="center"
              maxWidth={1000}
            />
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: syn,
                transform: `translateY(${interpolate(syn, [0, 1], [12, 0])}px)`,
              }}
            >
              {["Consultoría", "Tecnología", "Formación", "Soporte"].map((w, i) => (
                <React.Fragment key={w}>
                  {i > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.turquoise }} />}
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: COLORS.blue, letterSpacing: 0.3 }}>{w}</span>
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
