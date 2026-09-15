import React, { useMemo } from "react";
import { Img, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { seededRange } from "../lib/random";
import { Sparkline } from "./Sparkline";
import { AnimatedCounter } from "./AnimatedCounter";

type Props = {
  src: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  from: number;
  duration?: number;
};

/**
 * Stand-in for a real product screenshot, used only until the actual asset is supplied.
 * Rather than faking UI chrome, this leans fully into the brand's own geometric language:
 * a dense node constellation with a slowly orbiting focal ring — read as "the engine",
 * not a mockup of a screen. No invented labels, numbers, or interface elements.
 */
const ConstellationPanel: React.FC<{ width: number; height: number; from: number }> = ({ width, height, from }) => {
  const frame = useCurrentFrame();
  const local = frame - from;

  const nodes = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        x: seededRange(`cst-x-${i}`, width * 0.1, width * 0.9),
        y: seededRange(`cst-y-${i}`, height * 0.12, height * 0.88),
        r: seededRange(`cst-r-${i}`, 2.4, 6),
        delay: Math.floor(seededRange(`cst-d-${i}`, 0, 30)),
        breathe: seededRange(`cst-b-${i}`, 60, 140),
      })),
    [width, height]
  );

  const edges = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => {
        const a = Math.floor(seededRange(`cst-ea-${i}`, 0, nodes.length));
        // bias toward nearby indices so lines stay short and the constellation reads
        // as a coherent structure rather than a tangle of long diagonals
        const step = 1 + Math.floor(seededRange(`cst-eb-${i}`, 0, 3));
        const b = (a + step) % nodes.length;
        return { a, b, delay: Math.floor(seededRange(`cst-ed-${i}`, 10, 46)) };
      }),
    [nodes.length]
  );

  const cx = width * 0.52;
  const cy = height * 0.5;
  const ringR = Math.min(width, height) * 0.22;
  const ringRotation = local * 0.55;
  const orbitAngle = (ringRotation * Math.PI) / 180;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={width} height={height} rx={20} fill={COLORS.white} stroke={COLORS.lightBlue} strokeWidth={1.5} />

      {edges.map((e, i) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const p = interpolate(local, [e.delay, e.delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (p <= 0) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={a.x + (b.x - a.x) * p}
            y2={a.y + (b.y - a.y) * p}
            stroke={COLORS.blue}
            strokeWidth={1}
            opacity={0.3}
          />
        );
      })}

      <g transform={`rotate(${ringRotation} ${cx} ${cy})`} opacity={interpolate(local, [20, 44], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={COLORS.turquoise} strokeWidth={1.4} strokeDasharray="2 10" strokeLinecap="round" />
      </g>
      <circle cx={cx + Math.cos(orbitAngle) * ringR} cy={cy + Math.sin(orbitAngle) * ringR} r={4.5} fill={COLORS.turquoise} opacity={interpolate(local, [20, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <circle cx={cx} cy={cy} r={6} fill={COLORS.navy} opacity={interpolate(local, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {nodes.map((n) => {
        const appear = interpolate(local, [n.delay, n.delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (appear <= 0) return null;
        const breathe = 1 + Math.sin((local - n.delay) / n.breathe) * 0.25;
        return <circle key={n.id} cx={n.x} cy={n.y} r={n.r * appear * breathe} fill={COLORS.navy} opacity={0.55 * appear} />;
      })}

      <Sparkline x={width * 0.08} y={height * 0.72} width={width * 0.4} height={height * 0.16} from={from + 36} seed="dash-spark" color={COLORS.turquoise} />
    </svg>
  );
};

const CounterOverlay: React.FC<{ width: number; from: number }> = ({ width, from }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - from, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: width * 0.05,
        left: width * 0.07,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <AnimatedCounter target={1284} from={from} fontSize={30} fontWeight={700} color={COLORS.navy} />
        <span style={{ fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 700, color: COLORS.turquoise }}>▲</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <AnimatedCounter target={38} from={from + 6} decimals={0} suffix="%" fontSize={15} fontWeight={500} color={COLORS.blue} />
      </div>
    </div>
  );
};

export const DashboardFrame: React.FC<Props> = ({ src, x, y, width, height, from, duration = 32 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = interpolate(progress, [0, 1], [0.96, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const clipInset = interpolate(progress, [0, 1], [6, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        borderRadius: 20,
        overflow: "hidden",
        clipPath: `inset(${clipInset}% round 20px)`,
        boxShadow: "0 60px 120px -40px rgba(35,52,86,0.35)",
        border: `1px solid ${COLORS.lightBlue}`,
      }}
    >
      {src ? (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <>
          <ConstellationPanel width={width} height={height} from={from} />
          <CounterOverlay width={width} from={from + 46} />
        </>
      )}
    </div>
  );
};
