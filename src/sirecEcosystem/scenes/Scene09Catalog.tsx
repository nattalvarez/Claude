import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { SceneBackdrop, SceneOverlay } from "../components/Chrome";
import { ServiceCard, CardVariant } from "../components/ServiceCard";
import { KineticTitle, TextBlock, SceneFade, WorldPoint } from "../components/TextBlocks";
import { CamKF, cameraAt, worldCameraTransform } from "../camera";
import { scene, SERVICES } from "../timeline";

const DUR = scene("catalog").duration;

const lookAt = (cx: number, cy: number, s: number, frame: number): CamKF => [frame, cx, cy, s];

const CARD_W = 660;
const COL_L = -370;
const COL_R = 370;
const ROWS = [-260, -84, 92, 268];
const HEADER_Y = -430;

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

const CAM: CamKF[] = [
  lookAt(0, HEADER_Y - 20, 1.05, 0),
  lookAt(COL_L, ROWS[0], 1.55, 34),
  lookAt(COL_R, ROWS[0], 1.55, 72),
  lookAt(COL_L, ROWS[1], 1.55, 108),
  lookAt(COL_R, ROWS[1], 1.55, 144),
  lookAt(COL_L, ROWS[2], 1.55, 180),
  lookAt(COL_R, ROWS[2], 1.55, 216),
  lookAt(0, ROWS[3], 1.4, 252),
  lookAt(0, -50, 0.85, 306),
  lookAt(0, -50, 0.85, DUR),
];

export const Scene09Catalog: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame, CAM);

  return (
    <SceneFade duration={DUR}>
      <AbsoluteFill>
        <SceneBackdrop />

        <AbsoluteFill style={{ transform: worldCameraTransform(cam) }}>
          <WorldPoint x={0} y={HEADER_Y} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <KineticTitle text="SIREC" from={4} fontSize={70} align="center" />
            <TextBlock
              text="Servicios para acompañar la evolución de la plataforma"
              from={20}
              fontSize={24}
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
