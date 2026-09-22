import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, SPRING } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { ServiceCard, CardVariant } from "../components/ServiceCard";
import { KineticTitle, TextBlock, SceneFade, WorldPoint } from "../components/TextBlocks";
import { CamKF, cameraAt, worldCameraTransform } from "../camera";
import { scene, SERVICES } from "../timeline";

const DUR = scene("catalog").duration;

const lookAt = (cx: number, cy: number, s: number, frame: number): CamKF => [frame, cx, cy, s];

const CARD_W = 740;
const COL_L = -410;
const COL_R = 410;
const ROWS = [-320, -100, 120, 340];
const HEADER_Y = -520;

type Layout = { id: string; x: number; y: number; revealFrame: number; variant: CardVariant; big?: boolean };

const LAYOUT: Layout[] = [
  { id: "inception", x: COL_L, y: ROWS[0], revealFrame: 40, variant: "slideL" },
  { id: "uaas", x: COL_R, y: ROWS[0], revealFrame: 76, variant: "slideR" },
  { id: "changeManagement", x: COL_L, y: ROWS[1], revealFrame: 112, variant: "slideUp" },
  { id: "taas", x: COL_R, y: ROWS[1], revealFrame: 148, variant: "mask" },
  { id: "sats", x: COL_L, y: ROWS[2], revealFrame: 184, variant: "pop" },
  { id: "support", x: COL_R, y: ROWS[2], revealFrame: 220, variant: "slideDown" },
  { id: "cloud", x: 0, y: ROWS[3], revealFrame: 256, variant: "pop", big: true },
];

// One single, continuous zoom-out for the whole scene — no intermediate
// stops to visit each card — so the camera never has to snap between
// waypoints (the earlier per-card tour) and nothing risks framing a card
// half off-screen mid-move. Cards still reveal one at a time on their own
// stagger, independent of the camera.
const CAM: CamKF[] = [
  lookAt(0, HEADER_Y - 60, 1.1, 0),
  lookAt(0, -60, 0.74, DUR),
];

export const Scene09Catalog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = cameraAt(frame, CAM);
  const headerP = spring({ frame: frame - 4, fps, config: SPRING.smooth });

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: worldCameraTransform(cam) }}>
          <WorldPoint
            x={0}
            y={HEADER_Y}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: COLORS.white,
              borderRadius: 24,
              boxShadow: `0 30px 70px -24px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
              padding: "34px 56px",
              opacity: headerP,
              transform: `translate(-50%, -50%) translateY(${interpolate(headerP, [0, 1], [20, 0])}px) scale(${interpolate(headerP, [0, 1], [0.96, 1])})`,
            }}
          >
            <KineticTitle text="SIREC" from={4} fontSize={92} align="center" />
            <TextBlock
              text="Servicios para acompañar la evolución de la plataforma"
              from={20}
              fontSize={28}
              weight={500}
              color={COLORS.navySoft}
              align="center"
            />
          </WorldPoint>

          {LAYOUT.map((l) => {
            const svc = SERVICES.find((s) => s.id === l.id)!;
            return (
              <ServiceCard
                key={l.id}
                id={svc.id}
                title={svc.title}
                kicker={svc.kicker}
                desc={svc.desc}
                x={l.x}
                y={l.y}
                w={CARD_W}
                revealFrame={l.revealFrame}
                variant={l.variant}
                big={l.big}
              />
            );
          })}
        </AbsoluteFill>

        <SceneOverlay />
      </AbsoluteFill>
    </SceneFade>
  );
};
