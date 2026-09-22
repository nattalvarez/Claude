import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, EASE, FONT_FAMILY, SCENE_DURATIONS, SERVICES } from "../styles/theme";
import { ServiceIcon3D, ServiceKey } from "../components/ServiceIcon3D";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.catalog;

type Entrance = "slideLeft" | "slideRight" | "slideUp" | "scaleIn" | "mask" | "zoomIn" | "fadeLift";

type CardSpec = { svc: ServiceKey; label: string; x: number; y: number; width: number; from: number; entrance: Entrance };

const SERVICE_MAP = Object.fromEntries(SERVICES.map((s) => [s.key, s.description])) as Record<ServiceKey, string>;

const CARDS: CardSpec[] = [
  { svc: "inception", label: "INCEPTION", x: 560, y: 350, width: 480, from: 16, entrance: "slideLeft" },
  { svc: "uaas", label: "UaaS", x: 1360, y: 350, width: 480, from: 66, entrance: "zoomIn" },
  { svc: "changeManagement", label: "CHANGE MANAGEMENT", x: 560, y: 540, width: 480, from: 116, entrance: "scaleIn" },
  { svc: "taas", label: "TaaS", x: 1360, y: 540, width: 480, from: 148, entrance: "slideRight" },
  { svc: "sats", label: "SATS", x: 560, y: 730, width: 480, from: 188, entrance: "slideUp" },
  { svc: "support", label: "DEDICATED SUPPORT", x: 1360, y: 730, width: 480, from: 214, entrance: "fadeLift" },
  { svc: "cloud", label: "SIREC CLOUD SERVICES", x: 960, y: 900, width: 620, from: 248, entrance: "mask" },
];

type Waypoint = { frame: number; x: number; y: number; scale: number };

const WAYPOINTS: Waypoint[] = [
  { frame: 0, x: 700, y: 310, scale: 1.22 },
  { frame: 95, x: 1220, y: 330, scale: 1.2 },
  { frame: 185, x: 700, y: 610, scale: 1.14 },
  { frame: 265, x: 1220, y: 700, scale: 1.1 },
  { frame: 305, x: 960, y: 880, scale: 1.04 },
  { frame: DURATION, x: 960, y: 610, scale: 1 },
];

const camera = (frame: number) => {
  let i = 0;
  while (i < WAYPOINTS.length - 2 && frame > WAYPOINTS[i + 1].frame) i++;
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const t = interpolate(frame, [a.frame, b.frame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    scale: a.scale + (b.scale - a.scale) * t,
  };
};

const CatalogCard: React.FC<CardSpec> = ({ svc, label, x, y, width, from, entrance }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - from, fps, config: { damping: 17, mass: 0.85, stiffness: 118 } });
  const p = interpolate(appear, [0, 1], [0, 1]);

  let transform = "";
  let clip: string | undefined;
  const height = 132;

  switch (entrance) {
    case "slideLeft":
      transform = `translateX(${interpolate(p, [0, 1], [-90, 0])}px)`;
      break;
    case "slideRight":
      transform = `translateX(${interpolate(p, [0, 1], [90, 0])}px)`;
      break;
    case "slideUp":
      transform = `translateY(${interpolate(p, [0, 1], [70, 0])}px)`;
      break;
    case "scaleIn":
      transform = `scale(${interpolate(p, [0, 1], [0.7, 1])})`;
      break;
    case "zoomIn":
      transform = `scale(${interpolate(appear, [0, 1], [1.22, 1])})`;
      break;
    case "fadeLift":
      transform = `translateY(${interpolate(p, [0, 1], [28, 0])}px)`;
      break;
    case "mask":
      clip = `inset(0 ${interpolate(p, [0, 1], [100, 0])}% 0 0)`;
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        opacity: entrance === "mask" ? 1 : p,
        clipPath: clip,
        transform,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 8px",
      }}
    >
      <div style={{ width: 110, height: 110, position: "relative", flexShrink: 0 }}>
        <ServiceIcon3D type={svc} x={55} y={55} size={110} from={from + 8} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 27, letterSpacing: -0.4, color: COLORS.navy }}>{label}</div>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 400, fontSize: 18, lineHeight: 1.35, color: COLORS.blue, maxWidth: 340 }}>
          {SERVICE_MAP[svc]}
        </div>
      </div>
    </div>
  );
};

/** Scene 09 — El catálogo completo. An editorial, two-column composition (a wider centered
 * card closes the set) — never a radial diagram. Cards appear one at a time while a slow,
 * elegant camera drifts through the grid, then pulls back to reveal every service at once. */
export const Scene09Catalog: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camera(frame);

  const headerAppear = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={18}>
        <AbsoluteFill
          style={{
            transform: `scale(${cam.scale}) translate(${(960 - cam.x) * 0.35}px, ${(540 - cam.y) * 0.35}px)`,
            transformOrigin: `${cam.x}px ${cam.y}px`,
          }}
        >
          {CARDS.map((c) => (
            <CatalogCard key={c.svc} {...c} />
          ))}
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
          <div
            style={{
              opacity: headerAppear,
              transform: `translateY(${interpolate(headerAppear, [0, 1], [-14, 0])}px)`,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 56, letterSpacing: -1.4, color: COLORS.navy }}>SIREC</div>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 500, fontSize: 22, color: COLORS.turquoise, marginTop: 6 }}>
              Servicios para acompañar la evolución de la plataforma
            </div>
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
