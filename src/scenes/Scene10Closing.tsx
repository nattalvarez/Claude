import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, FONT_FAMILY, SCENE_DURATIONS, SERVICES } from "../styles/theme";
import { ServiceIcon3D, ServiceKey } from "../components/ServiceIcon3D";

const DURATION = SCENE_DURATIONS.closing;

const POSITIONS: Record<ServiceKey, { x: number; y: number }> = {
  inception: { x: 560, y: 350 },
  uaas: { x: 1360, y: 350 },
  changeManagement: { x: 560, y: 540 },
  taas: { x: 1360, y: 540 },
  sats: { x: 560, y: 730 },
  support: { x: 1360, y: 730 },
  cloud: { x: 960, y: 900 },
};

/** Scene 10 — Cierre. Every service remains visible but recedes — a small zoom-out and a
 * gentle fade of the secondary elements — while the core message takes the centre: the
 * SIREC name, its line, and a short synthesis. Ends on a slow fade to white. */
export const Scene10Closing: React.FC = () => {
  const frame = useCurrentFrame();

  const zoomOut = interpolate(frame, [0, 90], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const secondaryDim = interpolate(frame, [30, 90], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleAppear = interpolate(frame, [50, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });
  const syntaxAppear = interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });
  const finalFade = interpolate(frame, [DURATION - 34, DURATION - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <AbsoluteFill style={{ opacity: finalFade }}>
        <>
          <AbsoluteFill
            style={{
              transform: `scale(${zoomOut})`,
              transformOrigin: "960px 610px",
              opacity: secondaryDim,
            }}
          >
            {SERVICES.map((s) => {
              const pos = POSITIONS[s.key as ServiceKey];
              return (
                <div key={s.key} style={{ position: "absolute", left: pos.x - 60, top: pos.y - 60 }}>
                  <ServiceIcon3D type={s.key as ServiceKey} x={60} y={60} size={110} from={0} />
                  <div
                    style={{
                      marginTop: 8,
                      textAlign: "center",
                      fontFamily: FONT_FAMILY,
                      fontWeight: 500,
                      fontSize: 15,
                      letterSpacing: 1.2,
                      color: COLORS.navy,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>

          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                position: "absolute",
                width: 900,
                height: 420,
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${COLORS.white}f2 0%, ${COLORS.white}b8 48%, transparent 74%)`,
                filter: "blur(4px)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  opacity: titleAppear,
                  transform: `translateY(${interpolate(titleAppear, [0, 1], [16, 0])}px)`,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 92,
                  letterSpacing: -2,
                  color: COLORS.navy,
                }}
              >
                SIREC
              </div>
              <div
                style={{
                  marginTop: 8,
                  opacity: titleAppear,
                  transform: `translateY(${interpolate(titleAppear, [0, 1], [16, 0])}px)`,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 26,
                  color: COLORS.turquoise,
                }}
              >
                Un ecosistema de servicios alrededor de la plataforma
              </div>
              <div
                style={{
                  marginTop: 30,
                  opacity: syntaxAppear,
                  transform: `translateY(${interpolate(syntaxAppear, [0, 1], [12, 0])}px)`,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: 1,
                  color: COLORS.blue,
                }}
              >
                Consultoría · Tecnología · Formación · Soporte
              </div>
            </div>
          </AbsoluteFill>
        </>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
