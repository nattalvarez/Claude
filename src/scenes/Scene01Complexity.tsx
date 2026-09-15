import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE } from "../styles/theme";
import { seededRange } from "../lib/random";
import { KineticText } from "../components/KineticText";

const NODE_COUNT_PER_BAND = 9;
const ORGANIZE_START = 18;
const ORGANIZE_END = 92;

type Point = { x: number; y: number };

type FieldNode = {
  id: string;
  band: "upper" | "lower";
  index: number;
  scattered: Point;
  ordered: Point;
  stagger: number;
  r: number;
};

const buildField = (): FieldNode[] => {
  const nodes: FieldNode[] = [];
  (["upper", "lower"] as const).forEach((band) => {
    const bandY = band === "upper" ? 250 : 830;
    for (let i = 0; i < NODE_COUNT_PER_BAND; i++) {
      const id = `${band}-${i}`;
      const t = i / (NODE_COUNT_PER_BAND - 1);
      const x = 260 + t * (WIDTH - 520);
      // a gentle arc, echoing the brand's curved accent line
      const curve = Math.sin(t * Math.PI) * (band === "upper" ? -34 : 34);
      nodes.push({
        id,
        band,
        index: i,
        scattered: {
          x: seededRange(`${id}-sx`, 60, WIDTH - 60),
          y: seededRange(`${id}-sy`, 60, HEIGHT - 60),
        },
        ordered: { x, y: bandY + curve },
        stagger: Math.floor(seededRange(`${id}-stagger`, 0, 26)),
        r: seededRange(`${id}-r`, 2.6, 4.6),
      });
    }
  });
  return nodes;
};

/** 0:00–0:04 — Complejidad → orden. A scattered field of points settles into two calm,
 * curved rows that frame the message instead of covering it; a handful of connectors
 * snap into place once the field has organized, and the last one grows to carry us
 * into Scene02. */
export const Scene01Complexity: React.FC = () => {
  const frame = useCurrentFrame();
  const fields = useMemo(buildField, []);

  const position = (n: FieldNode): Point => {
    const progress = interpolate(frame, [ORGANIZE_START + n.stagger, ORGANIZE_END + n.stagger], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE.standard),
    });
    return {
      x: n.scattered.x + (n.ordered.x - n.scattered.x) * progress,
      y: n.scattered.y + (n.ordered.y - n.scattered.y) * progress,
    };
  };

  const appearOpacity = interpolate(frame, [0, 14], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fieldFadeOut = interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // sequential connectors within each band, drawn only once both endpoints have settled
  const settleFrame = (n: FieldNode) => ORGANIZE_END + n.stagger;
  const bandEdges = (band: "upper" | "lower") => {
    const bandNodes = fields.filter((n) => n.band === band);
    return bandNodes.slice(0, -1).map((n, i) => {
      const next = bandNodes[i + 1];
      const from = Math.max(settleFrame(n), settleFrame(next)) - 6;
      const a = position(n);
      const b = position(next);
      const progress = interpolate(frame, [from, from + 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...EASE.enter),
      });
      return { key: `${band}-${i}`, a, b, progress };
    });
  };

  const transitionProgress = interpolate(frame, [96, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <g opacity={fieldFadeOut}>
          {(["upper", "lower"] as const).flatMap((band) =>
            bandEdges(band).map((e) =>
              e.progress > 0 ? (
                <line
                  key={e.key}
                  x1={e.a.x}
                  y1={e.a.y}
                  x2={e.a.x + (e.b.x - e.a.x) * e.progress}
                  y2={e.a.y + (e.b.y - e.a.y) * e.progress}
                  stroke={COLORS.blue}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  opacity={0.55}
                />
              ) : null
            )
          )}
          {fields.map((n) => {
            const p = position(n);
            return <circle key={n.id} cx={p.x} cy={p.y} r={n.r} fill={COLORS.navy} opacity={appearOpacity} />;
          })}
        </g>
      </svg>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 220px" }}>
        <KineticText
          parts={[{ text: "El riesgo de crédito exige decisiones cada vez más rápidas." }]}
          from={20}
          exitAt={56}
          fontSize={50}
          fontWeight={400}
          color={COLORS.navy}
          align="center"
        />
        <div style={{ position: "absolute" }}>
          <KineticText
            parts={[{ text: "¿Y si pudieran ejecutarse de forma autónoma?" }]}
            from={62}
            exitAt={92}
            fontSize={50}
            fontWeight={500}
            color={COLORS.navy}
            align="center"
          />
        </div>
      </AbsoluteFill>

      {/* the transition line — one connection outgrows the field and sweeps to fill the frame */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 3,
          transform: `translateY(-1.5px) scaleX(${transitionProgress})`,
          transformOrigin: "50% 50%",
          background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.turquoise})`,
        }}
      />
    </AbsoluteFill>
  );
};
