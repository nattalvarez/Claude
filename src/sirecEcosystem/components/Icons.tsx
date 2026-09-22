import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, SPRING } from "../theme";
import { Solid3D, Stage3D } from "./Primitives3D";

export type Piece = {
  w: number;
  h?: number;
  d?: number;
  color: string;
  radius?: number;
  restX: number;
  restY: number;
  restZ?: number;
  restRx?: number;
  restRy?: number;
  restRz?: number;
  fromX: number;
  fromY: number;
  fromZ?: number;
  fromRx?: number;
  fromRy?: number;
  fromRz?: number;
  delay: number;
};

/** The shared assembly language for every hero icon: pieces start apart and
 * mis-turned, then spring into their resting position and orientation, each
 * on its own delay. `localFrame` is frame-since-the-icon-started. Passing
 * `exitStart` makes every piece drift back apart (each still staggered)
 * from that local frame on — the "se desmonta" transition beat. */
export const PieceAssembly: React.FC<{ pieces: Piece[]; localFrame: number; size?: number; exitStart?: number }> = ({
  pieces,
  localFrame,
  size = 320,
  exitStart,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Stage3D style={{ width: size, height: size }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d" }}>
        {pieces.map((p, i) => {
          const sp = spring({ frame: localFrame - p.delay, fps, config: SPRING.smooth });
          const settledX = interpolate(sp, [0, 1], [p.fromX, p.restX]);
          const settledY = interpolate(sp, [0, 1], [p.fromY, p.restY]);
          const settledZ = interpolate(sp, [0, 1], [p.fromZ ?? 0, p.restZ ?? 0]);
          const rx = interpolate(sp, [0, 1], [p.fromRx ?? 0, p.restRx ?? 0]);
          const ry = interpolate(sp, [0, 1], [p.fromRy ?? 0, p.restRy ?? 0]);
          const rz = interpolate(sp, [0, 1], [p.fromRz ?? 0, p.restRz ?? 0]);

          let x = settledX;
          let y = settledY;
          let z = settledZ;
          let op = sp;
          if (exitStart !== undefined) {
            const ex = interpolate(localFrame, [exitStart + i * 3, exitStart + i * 3 + 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            x = interpolate(ex, [0, 1], [settledX, p.fromX * 1.35]);
            y = interpolate(ex, [0, 1], [settledY, p.fromY * 1.35]);
            z = interpolate(ex, [0, 1], [settledZ, (p.fromZ ?? 0) * 1.35]);
            op = sp * (1 - ex);
          }

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transformStyle: "preserve-3d",
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                opacity: op,
              }}
            >
              <Solid3D w={p.w} h={p.h} d={p.d} color={p.color} radius={p.radius ?? 0} rx={rx} ry={ry} rz={rz} />
            </div>
          );
        })}
      </div>
    </Stage3D>
  );
};

// ---- Per-service hero piece sets ------------------------------------------

export const inceptionPieces: Piece[] = [
  { w: 108, d: 20, color: COLORS.blue, radius: 18, restX: -34, restY: -40, restZ: 14, restRx: 16, restRy: -22, restRz: -8, fromX: -34, fromY: -280, fromZ: 14, fromRx: -50, fromRz: -8, delay: 0 },
  { w: 96, d: 20, color: COLORS.turquoise, radius: 18, restX: 54, restY: 8, restZ: -8, restRx: -12, restRy: 26, restRz: 16, fromX: 320, fromY: 8, fromZ: -8, fromRy: 60, fromRz: 16, delay: 10 },
  { w: 84, d: 20, color: COLORS.navy, radius: 16, restX: -18, restY: 58, restZ: 2, restRx: 20, restRy: -14, restRz: 6, fromX: -18, fromY: 320, fromZ: 2, fromRx: 40, fromRz: 6, delay: 20 },
];

export const changeManagementPieces: Piece[] = [
  { w: 78, color: COLORS.blue, radius: 10, restX: -56, restY: -46, restZ: 0, fromX: -240, fromY: -170, fromZ: 40, fromRy: 130, delay: 0 },
  { w: 78, color: COLORS.navy, radius: 10, restX: 44, restY: -46, restZ: 10, fromX: 250, fromY: -200, fromZ: -30, fromRy: -150, delay: 8 },
  { w: 78, color: COLORS.turquoise, radius: 10, restX: -56, restY: 46, restZ: -6, fromX: -280, fromY: 170, fromZ: 0, fromRy: 220, delay: 16 },
  { w: 78, color: COLORS.blue, radius: 10, restX: 44, restY: 46, restZ: 4, fromX: 44, fromY: 300, fromZ: 4, delay: 24 },
  { w: 60, color: COLORS.navy, radius: 8, restX: -6, restY: -2, restZ: 74, restRz: 6, fromX: -6, fromY: -210, fromZ: 74, fromRz: 6, delay: 32 },
];

export type CubePos = { x: number; y: number; delay: number };
export const satsCubeGrid: CubePos[] = [
  { x: -128, y: -96, delay: 0 },
  { x: 0, y: -96, delay: 5 },
  { x: 128, y: -96, delay: 10 },
  { x: -64, y: 8, delay: 15 },
  { x: 64, y: 8, delay: 20 },
  { x: -128, y: 112, delay: 25 },
  { x: 0, y: 112, delay: 25 },
  { x: 128, y: 112, delay: 30 },
];

export const CheckGlyph: React.FC<{ size?: number; color?: string; p: number }> = ({ size = 26, color = COLORS.white, p }) => (
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

// ---- Compact marks for the scene 09 catalog -------------------------------

const MiniStage: React.FC<{ children: React.ReactNode; spin?: number }> = ({ children, spin = 0 }) => {
  const frame = useCurrentFrame();
  const idle = Math.sin(frame / 70) * spin;
  return (
    <Stage3D style={{ width: 84, height: 84 }} perspective={900}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transformStyle: "preserve-3d",
          transform: `translate3d(-50%,-50%,0) rotateY(${idle}deg)`,
        }}
      >
        {children}
      </div>
    </Stage3D>
  );
};

export const MiniIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "inception":
      return (
        <MiniStage spin={10}>
          <div style={{ position: "absolute", transform: "translate3d(-14px,-12px,10px) rotateZ(-10deg)" }}>
            <Solid3D w={40} d={10} color={COLORS.blue} radius={8} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(12px,8px,-8px) rotateZ(14deg)" }}>
            <Solid3D w={34} d={10} color={COLORS.turquoise} radius={8} />
          </div>
        </MiniStage>
      );
    case "changeManagement":
      return (
        <MiniStage spin={12}>
          <div style={{ position: "absolute", transform: "translate3d(-16px,-14px,0px)" }}>
            <Solid3D w={30} color={COLORS.navy} radius={5} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(10px,10px,6px)" }}>
            <Solid3D w={30} color={COLORS.blue} radius={5} />
          </div>
        </MiniStage>
      );
    case "sats":
      return (
        <MiniStage spin={8}>
          <div style={{ position: "absolute", transform: "translate3d(-12px,0px,0px)" }}>
            <Solid3D w={34} color={COLORS.navy} radius={6} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(16px,-6px,14px)" }}>
            <Solid3D w={26} color={COLORS.blue} radius={6} />
          </div>
          <div style={{ position: "absolute", left: 6, top: -14, transform: "translateZ(30px)" }}>
            <CheckGlyph size={20} color={COLORS.turquoise} p={1} />
          </div>
        </MiniStage>
      );
    case "cloud":
      return (
        <MiniStage spin={14}>
          <div style={{ position: "absolute", transform: "translate3d(-14px,10px,-10px)" }}>
            <Solid3D w={52} h={26} d={16} color={COLORS.navy} radius={10} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(-4px,-10px,10px)" }}>
            <Solid3D w={38} h={20} d={14} color={COLORS.blue} radius={8} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(16px,2px,22px)" }}>
            <Solid3D w={20} h={20} d={12} color={COLORS.turquoise} radius={6} />
          </div>
        </MiniStage>
      );
    case "uaas":
      return (
        <MiniStage spin={16}>
          <div style={{ position: "absolute", transform: "translate3d(-20px,-20px,-20px)" }}>
            <Solid3D w={40} h={40} d={14} color={COLORS.navy} radius={6} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(-20px,-20px,-4px)" }}>
            <Solid3D w={40} h={40} d={14} color={COLORS.blue} radius={6} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(-20px,-20px,12px)" }}>
            <Solid3D w={40} h={40} d={14} color={COLORS.turquoise} radius={6} />
          </div>
        </MiniStage>
      );
    case "taas":
      return (
        <MiniStage spin={10}>
          <div style={{ position: "absolute", transform: "translate3d(-14px,-6px,-10px) rotateZ(-8deg)" }}>
            <Solid3D w={34} h={44} d={8} color={COLORS.lightBlue} radius={7} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(4px,2px,4px) rotateZ(4deg)" }}>
            <Solid3D w={34} h={44} d={8} color={COLORS.blue} radius={7} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(20px,10px,16px) rotateZ(14deg)" }}>
            <Solid3D w={34} h={44} d={8} color={COLORS.turquoise} radius={7} />
          </div>
        </MiniStage>
      );
    case "support":
      return (
        <MiniStage spin={12}>
          <div style={{ position: "absolute", transform: "translate3d(-14px,-4px,0px) rotateZ(-6deg)" }}>
            <Solid3D w={38} h={42} d={14} color={COLORS.navy} radius={10} />
          </div>
          <div style={{ position: "absolute", transform: "translate3d(10px,4px,10px) rotateZ(6deg)" }}>
            <Solid3D w={34} h={38} d={14} color={COLORS.turquoise} radius={10} />
          </div>
        </MiniStage>
      );
    default:
      return null;
  }
};
