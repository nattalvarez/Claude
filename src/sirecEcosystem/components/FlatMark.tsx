import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, SPRING } from "../theme";

export type ServiceId = "inception" | "changeManagement" | "sats" | "cloud" | "uaas" | "taas" | "support";

/** A flat, geometric color block — the one shape every mark in this piece
 * is built from. No perspective, no fake depth: a soft drop shadow is all
 * the dimension it needs. */
export const Chip: React.FC<{ w: number; h?: number; color: string; radius?: number; style?: React.CSSProperties }> = ({
  w,
  h,
  color,
  radius = 16,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h ?? w,
      borderRadius: radius,
      background: color,
      boxShadow: `0 16px 30px -16px ${COLORS.shadow}`,
      ...style,
    }}
  />
);

export type FlatPiece = {
  x: number;
  y: number;
  w: number;
  h?: number;
  color: string;
  radius?: number;
  rot?: number;
  fromX?: number;
  fromY?: number;
  fromRot?: number;
  delay?: number;
};

/** The coordinate space every piece dataset below is authored in — wide
 * enough to contain the widest one (satsPieces/supportPieces) without
 * clipping. `FlatAssembly`'s `size` prop is the actual rendered footprint;
 * it scales this fixed canvas down (or up) to fit, so `size` finally means
 * what it says instead of being ignored. */
export const PIECE_CANVAS = 250;

/** Renders a small cluster of flat chips. With `localFrame` each piece
 * springs in from its own direction, staggered; without it, every piece
 * simply sits at rest — the same layout doubles as the small catalog mark
 * and the animated hero for a scene, so the two always agree. */
export const FlatAssembly: React.FC<{
  pieces: FlatPiece[];
  size: number;
  refCanvas?: number;
  localFrame?: number;
  exitStart?: number;
  fps?: number;
  extra?: React.ReactNode;
}> = ({ pieces, size, refCanvas = PIECE_CANVAS, localFrame, exitStart, fps: fpsProp, extra }) => {
  const config = useVideoConfig();
  const fps = fpsProp ?? config.fps;
  const groupScale = size / refCanvas;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: refCanvas,
          height: refCanvas,
          transform: `translate(-50%, -50%) scale(${groupScale})`,
        }}
      >
        {pieces.map((p, i) => {
          let x = p.x;
          let y = p.y;
          let rot = p.rot ?? 0;
          let pieceScale = 1;
          let opacity = 1;

          if (localFrame !== undefined) {
            const sp = spring({ frame: localFrame - (p.delay ?? 0), fps, config: SPRING.smooth });
            x = interpolate(sp, [0, 1], [p.fromX ?? p.x, p.x]);
            y = interpolate(sp, [0, 1], [p.fromY ?? p.y, p.y]);
            rot = interpolate(sp, [0, 1], [p.fromRot ?? rot, rot]);
            pieceScale = interpolate(sp, [0, 1], [0.55, 1]);
            opacity = sp;

            if (exitStart !== undefined) {
              const ex = interpolate(localFrame, [exitStart + i * 3, exitStart + i * 3 + 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              x = interpolate(ex, [0, 1], [x, (p.fromX ?? p.x) * 1.3]);
              y = interpolate(ex, [0, 1], [y, (p.fromY ?? p.y) * 1.3]);
              opacity *= 1 - ex;
            }
          }

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: refCanvas / 2 + x,
                top: refCanvas / 2 + y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pieceScale})`,
                opacity,
              }}
            >
              <Chip w={p.w} h={p.h} color={p.color} radius={p.radius} />
            </div>
          );
        })}
        {extra}
      </div>
    </div>
  );
};

// ---- Piece layouts — shared between each dedicated scene's animated hero
// and the scene 09/10 static mark, so both read as the same object. --------

export const inceptionPieces: FlatPiece[] = [
  { x: -28, y: -32, w: 96, radius: 20, color: COLORS.blue, fromX: -28, fromY: -230, delay: 0 },
  { x: 40, y: 12, w: 82, radius: 18, color: COLORS.turquoise, fromX: 250, fromY: 12, delay: 8 },
  { x: -14, y: 48, w: 70, radius: 16, color: COLORS.navy, fromX: -14, fromY: 240, delay: 16 },
];

export const changeManagementPieces: FlatPiece[] = [
  { x: -40, y: -34, w: 64, radius: 12, color: COLORS.blue, fromX: -230, fromY: -140, delay: 0 },
  { x: 32, y: -34, w: 64, radius: 12, color: COLORS.navy, fromX: 230, fromY: -160, delay: 6 },
  { x: -40, y: 34, w: 64, radius: 12, color: COLORS.turquoise, rot: -6, fromX: -230, fromY: 160, fromRot: -30, delay: 12 },
  { x: 32, y: 34, w: 64, radius: 12, color: COLORS.blue, fromX: 32, fromY: 240, delay: 18 },
];

export const satsPieces: FlatPiece[] = [
  { x: -84, y: -54, w: 60, radius: 12, color: COLORS.navy, fromY: -240, delay: 0 },
  { x: 0, y: -54, w: 60, radius: 12, color: COLORS.blue, fromY: -240, delay: 5 },
  { x: 84, y: -54, w: 60, radius: 12, color: COLORS.navy, fromY: -240, delay: 10 },
  { x: -42, y: 46, w: 60, radius: 12, color: COLORS.blue, fromY: 240, delay: 15 },
  { x: 42, y: 46, w: 60, radius: 12, color: COLORS.navy, fromY: 240, delay: 20 },
];

export const supportPieces: FlatPiece[] = [
  { x: -56, y: 0, w: 108, h: 138, radius: 26, color: COLORS.navy, fromX: -280, delay: 0 },
  { x: 56, y: 8, w: 128, h: 108, radius: 26, color: COLORS.turquoise, fromX: 280, delay: 6 },
];

export const cloudPieces: FlatPiece[] = [
  { x: 0, y: 52, w: 216, h: 54, radius: 18, color: COLORS.navy, fromY: 220, delay: 0 },
  { x: 0, y: 2, w: 168, h: 48, radius: 16, color: COLORS.blue, fromY: 190, delay: 8 },
  { x: 0, y: -44, w: 120, h: 40, radius: 14, color: COLORS.turquoise, fromY: 160, delay: 16 },
];

export const uaasPieces: FlatPiece[] = [
  { x: 0, y: 0, w: 168, radius: 30, color: COLORS.navy, delay: 0 },
  { x: 36, y: 36, w: 92, radius: 20, color: COLORS.turquoise, fromX: 200, fromY: 200, delay: 10 },
];

// ---- Small glyph marks for the TaaS cards ---------------------------------

export type Glyph = "doc" | "play" | "bars" | "book" | "dots";

export const GlyphMark: React.FC<{ kind: Glyph; color: string; size?: number }> = ({ kind, color, size = 34 }) => {
  if (kind === "play") {
    return (
      <svg width={size} height={size} viewBox="0 0 34 34">
        <polygon points="11,8 26,17 11,26" fill={color} />
      </svg>
    );
  }
  if (kind === "bars") {
    return (
      <svg width={size} height={size} viewBox="0 0 34 34">
        <rect x={6} y={20} width={6} height={8} rx={1.5} fill={color} />
        <rect x={14} y={13} width={6} height={15} rx={1.5} fill={color} opacity={0.75} />
        <rect x={22} y={6} width={6} height={22} rx={1.5} fill={color} opacity={0.55} />
      </svg>
    );
  }
  if (kind === "book") {
    return (
      <svg width={size} height={size} viewBox="0 0 34 34">
        <rect x={6} y={8} width={10} height={19} rx={2} fill="none" stroke={color} strokeWidth={2.2} />
        <rect x={18} y={8} width={10} height={19} rx={2} fill="none" stroke={color} strokeWidth={2.2} />
      </svg>
    );
  }
  if (kind === "dots") {
    return (
      <svg width={size} height={size} viewBox="0 0 34 34">
        {[9, 17, 25].map((x) => [9, 17, 25].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={color} />))}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 34 34">
      {[9, 15, 21, 27].map((y) => (
        <line key={y} x1={7} y1={y} x2={27} y2={y} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      ))}
    </svg>
  );
};

export const CheckGlyph: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 26, color = COLORS.white, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})` }}>
    <path
      d="M4 12.5 L9.5 18 L20 6"
      fill="none"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={24}
      strokeDashoffset={interpolate(p, [0, 1], [24, 0])}
    />
  </svg>
);

// ---- Static mark — the settled version of each service's shape, used for
// the scene 09 catalog cards and the scene 10 closing chips. ---------------

const REF = 220;

export const ServiceMark: React.FC<{ id: ServiceId; size?: number }> = ({ id, size = 72 }) => {
  const scale = size / REF;
  const wrap = (children: React.ReactNode) => (
    <div style={{ width: size, height: size, position: "relative", overflow: "visible" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div style={{ position: "relative", width: REF, height: REF }}>{children}</div>
      </div>
    </div>
  );

  if (id === "inception") return wrap(<FlatAssembly pieces={inceptionPieces} size={REF} refCanvas={REF} />);
  if (id === "changeManagement") return wrap(<FlatAssembly pieces={changeManagementPieces} size={REF} refCanvas={REF} />);
  if (id === "cloud") return wrap(<FlatAssembly pieces={cloudPieces} size={REF} refCanvas={REF} />);
  if (id === "uaas") return wrap(<FlatAssembly pieces={uaasPieces} size={REF} refCanvas={REF} />);
  if (id === "support") return wrap(<FlatAssembly pieces={supportPieces} size={REF} refCanvas={REF} />);
  if (id === "sats")
    return wrap(
      <>
        <FlatAssembly pieces={satsPieces} size={REF} refCanvas={REF} />
        {satsPieces.slice(0, 3).map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: REF / 2 + p.x + p.w / 2 - 10,
              top: REF / 2 + p.y - p.w / 2 - 6,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: COLORS.turquoise,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckGlyph size={14} color={COLORS.white} />
          </div>
        ))}
      </>
    );
  // taas
  return wrap(
    <>
      <div style={{ position: "absolute", left: REF / 2 - 60, top: REF / 2 - 14, transform: "translate(-50%,-50%) rotate(-8deg)" }}>
        <Chip w={92} h={122} radius={16} color={COLORS.white} style={{ boxShadow: `0 16px 30px -16px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}` }} />
      </div>
      <div style={{ position: "absolute", left: REF / 2 + 8, top: REF / 2, transform: "translate(-50%,-50%) rotate(6deg)" }}>
        <Chip w={92} h={122} radius={16} color={COLORS.white} style={{ boxShadow: `0 20px 34px -16px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
          <GlyphMark kind="doc" color={COLORS.blue} size={30} />
        </div>
      </div>
    </>
  );
};
