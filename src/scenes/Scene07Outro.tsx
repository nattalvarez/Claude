import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";
import { BrandLockup } from "../components/BrandLockup";
import { KineticText } from "../components/KineticText";
import { PillButton } from "../components/PillButton";
import { GeometricNode } from "../components/GeometricNode";
import { ConnectionLine } from "../components/ConnectionLine";
import { PulseRings } from "../components/PulseRings";
import { seededRange } from "../lib/random";

const CENTRE = { x: WIDTH / 2, y: HEIGHT / 2 - 80 };

/** 0:27–0:30 — Cierre. Everything the system built collapses to a single, quiet point;
 * the last two seconds hold completely still so the message reads clearly. */
export const Scene07Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const residual = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `outro-${i}`,
        angle: (Math.PI / 180) * (i * 60),
        dist: seededRange(`outro-dist-${i}`, 220, 420),
      })),
    []
  );

  const collapse = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const residualOpacity = interpolate(frame, [0, 6, 20], [0, 0.5, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <PulseRings cx={WIDTH / 2} cy={HEIGHT / 2} from={36} interval={40} count={3} startRadius={140} maxRadius={520} maxOpacity={0.12} strokeWidth={1} />
        <g opacity={residualOpacity}>
          {residual.map((n) => {
            const dist = n.dist * (1 - collapse);
            const x = CENTRE.x + Math.cos(n.angle) * dist;
            const y = CENTRE.y + Math.sin(n.angle) * dist;
            return (
              <React.Fragment key={n.id}>
                <ConnectionLine x1={CENTRE.x} y1={CENTRE.y} x2={x} y2={y} from={0} duration={4} color={COLORS.turquoise} strokeWidth={1} opacity={0.5} />
                <GeometricNode cx={x} cy={y} r={3} color={COLORS.blue} from={0} pulse={false} />
              </React.Fragment>
            );
          })}
        </g>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <BrandLockup from={0} speed={2.4} iconSize={108} wordmarkSize={116} />
        <KineticText
          parts={[{ text: "La plataforma agéntica para la gestión del riesgo de crédito." }]}
          from={32}
          wordStagger={1}
          fontSize={32}
          fontWeight={400}
          color={COLORS.blue}
          align="center"
          maxWidth={980}
        />
        <div style={{ marginTop: 18 }}>
          <PillButton label="Conoce la plataforma" from={58} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
