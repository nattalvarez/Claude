import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";
import { Cube3D } from "./Cube3D";
import { Panel3D } from "./Panel3D";
import { FloatingPiece } from "./FloatingPiece";
import { TechIcon } from "./TechIcon";

export type ServiceKey = "inception" | "changeManagement" | "sats" | "cloud" | "uaas" | "taas" | "support";

type Props = {
  type: ServiceKey;
  x: number;
  y: number;
  size?: number;
  from?: number;
};

const Piece: React.FC<{ x: number; y: number; size: number; color: string; kind: "circle" | "square"; from: number }> = ({
  x,
  y,
  size,
  color,
  kind,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.7, stiffness: 140 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        opacity: interpolate(appear, [0, 1], [0, 1]),
        transform: `scale(${interpolate(appear, [0, 1], [0.7, 1])})`,
      }}
    >
      <FloatingPiece type={kind} size={size} color={color} />
    </div>
  );
};

/** A compact, bespoke 3D mark for each service — built from the same primitives as the
 * hero scenes (cubes, panels, flat pieces) at small scale, never a flat icon-font glyph.
 * Shares one visual language across all seven so the catalog reads as one family. */
export const ServiceIcon3D: React.FC<Props> = ({ type, x, y, size = 120, from = 0 }) => {
  const s = size;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checkAppear = spring({ frame: frame - from - 16, fps, config: { damping: 12, mass: 0.5, stiffness: 220 } });

  switch (type) {
    case "inception":
      return (
        <>
          <Piece x={x - s * 0.22} y={y - s * 0.18} size={s * 0.3} color={COLORS.turquoise} kind="circle" from={from} />
          <Cube3D x={x + s * 0.14} y={y + s * 0.05} size={s * 0.42} color={COLORS.blue} from={from + 6} rotateX={-18} rotateY={28} floatAmp={2} spinY={0.03} />
          <Piece x={x - s * 0.12} y={y + s * 0.28} size={s * 0.24} color={COLORS.blue} kind="square" from={from + 12} />
        </>
      );
    case "changeManagement":
      return (
        <>
          <Panel3D x={x - s * 0.2} y={y - s * 0.14} width={s * 0.4} height={s * 0.32} color={COLORS.blue} from={from} rotateX={8} rotateY={-14} floatAmp={2} filled />
          <Panel3D x={x + s * 0.2} y={y - s * 0.02} width={s * 0.36} height={s * 0.3} color={COLORS.turquoise} from={from + 7} rotateX={8} rotateY={-14} floatAmp={2} filled />
          <Panel3D x={x - s * 0.02} y={y + s * 0.26} width={s * 0.34} height={s * 0.28} color={COLORS.navy} from={from + 14} rotateX={8} rotateY={-14} floatAmp={2} />
        </>
      );
    case "sats":
      return (
        <>
          <Cube3D x={x} y={y + s * 0.08} size={s * 0.52} color={COLORS.blue} from={from} rotateX={-16} rotateY={28} floatAmp={2} spinY={0.03} />
          <div
            style={{
              position: "absolute",
              left: x - s * 0.13,
              top: y - s * 0.38,
              opacity: interpolate(checkAppear, [0, 1], [0, 1]),
              transform: `scale(${interpolate(checkAppear, [0, 1], [0.5, 1])})`,
              width: s * 0.26,
              height: s * 0.26,
              borderRadius: "50%",
              background: COLORS.white,
              boxShadow: `0 8px 18px -8px ${COLORS.turquoise}88`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TechIcon type="check" color={COLORS.turquoise} size={s * 0.18} />
          </div>
        </>
      );
    case "cloud":
      return (
        <>
          <Cube3D x={x - s * 0.16} y={y + s * 0.12} size={s * 0.38} color={COLORS.blue} from={from} rotateX={-16} rotateY={24} floatAmp={2} spinY={0.03} />
          <Cube3D x={x + s * 0.2} y={y - s * 0.06} size={s * 0.3} color={COLORS.turquoise} from={from + 8} rotateX={-16} rotateY={24} floatAmp={2} spinY={0.03} />
          <Panel3D x={x + s * 0.02} y={y + s * 0.3} width={s * 0.5} height={s * 0.2} color={COLORS.navy} from={from + 14} rotateX={20} rotateY={-6} floatAmp={1} />
        </>
      );
    case "uaas":
      return (
        <>
          <Cube3D x={x} y={y + s * 0.1} size={s * 0.46} color={COLORS.navy} from={from} rotateX={-14} rotateY={26} floatAmp={2} spinY={0.03} />
          <Panel3D x={x} y={y - s * 0.28} width={s * 0.5} height={s * 0.14} color={COLORS.turquoise} from={from + 10} rotateX={70} rotateY={0} floatAmp={2} filled glow />
        </>
      );
    case "taas":
      return (
        <>
          <Panel3D x={x - s * 0.1} y={y + s * 0.06} width={s * 0.42} height={s * 0.32} color={COLORS.blue} from={from} rotateX={8} rotateY={-16} floatAmp={2} filled>
            <TechIcon type="doc" color={COLORS.blue} size={s * 0.16} />
          </Panel3D>
          <Panel3D x={x + s * 0.18} y={y - s * 0.14} width={s * 0.38} height={s * 0.3} color={COLORS.turquoise} from={from + 8} rotateX={8} rotateY={-16} floatAmp={2} filled>
            <TechIcon type="play" color={COLORS.turquoise} size={s * 0.15} />
          </Panel3D>
        </>
      );
    case "support":
      return (
        <>
          <Piece x={x - s * 0.14} y={y} size={s * 0.36} color={COLORS.blue} kind="square" from={from} />
          <Piece x={x + s * 0.14} y={y} size={s * 0.36} color={COLORS.turquoise} kind="square" from={from + 8} />
        </>
      );
  }
};
