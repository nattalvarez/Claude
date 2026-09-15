import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";
import { DashboardFrame } from "../components/DashboardFrame";
import { KineticText } from "../components/KineticText";
import { Wordmark } from "../components/Wordmark";
import { GeometricNode } from "../components/GeometricNode";
import { ConnectionLine } from "../components/ConnectionLine";
import { SCREENSHOTS } from "../assets/manifest";

const DASH = { x: 1030, y: 210, w: 760, h: 520 };

/** 0:04–0:08 — Presentación de SIREC. The real product surface enters, framed by the
 * system's geometric language; the wordmark and positioning line land on the left. */
export const Scene02Sirec: React.FC = () => {
  const frame = useCurrentFrame();

  const curtainProgress = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const anchorPoints = [
    { x: DASH.x - 30, y: DASH.y - 20 },
    { x: DASH.x + DASH.w + 30, y: DASH.y - 20 },
    { x: DASH.x - 30, y: DASH.y + DASH.h + 20 },
    { x: DASH.x + DASH.w + 30, y: DASH.y + DASH.h + 20 },
  ];
  const centre = { x: DASH.x + DASH.w / 2, y: DASH.y + DASH.h / 2 };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* curtain split — visual handoff from Scene01's growing line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: COLORS.white,
          transform: `translateY(${-curtainProgress * 12}px)`,
          borderBottom: `2px solid rgba(51,101,162,${1 - curtainProgress})`,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 1 - curtainProgress,
        }}
      />

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        {anchorPoints.map((p, i) => (
          <ConnectionLine key={i} x1={p.x} y1={p.y} x2={centre.x} y2={centre.y} from={30 + i * 6} duration={26} color={COLORS.turquoise} strokeWidth={1.2} opacity={0.35} />
        ))}
        {anchorPoints.map((p, i) => (
          <GeometricNode key={i} cx={p.x} cy={p.y} r={4} color={COLORS.turquoise} from={26 + i * 6} pulse={false} />
        ))}
      </svg>

      <DashboardFrame src={SCREENSHOTS.dashboard} x={DASH.x} y={DASH.y} width={DASH.w} height={DASH.h} from={6} duration={30} />

      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, paddingRight: 900 }}>
        <Wordmark from={26} fontSize={104} />
        <div style={{ marginTop: 28 }}>
          <KineticText
            parts={[
              { text: "La plataforma " },
              { text: "agéntica ", color: COLORS.turquoise },
              { text: "para la gestión del riesgo de crédito." },
            ]}
            from={50}
            fontSize={38}
            fontWeight={400}
            color={COLORS.navy}
            align="left"
            maxWidth={620}
            lineHeight={1.3}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
