import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";
import { buildNetwork } from "../lib/random";
import { ConnectionLine } from "./ConnectionLine";
import { GeometricNode } from "./GeometricNode";

type Props = {
  seed: string;
  nodeCount?: number;
  edgeCount?: number;
  opacity?: number;
  color?: string;
  sceneFrom: number;
};

/** A very subtle ambient node/line texture used behind scene content for visual continuity
 * across the piece — never the focal point, always secondary motion. */
export const NetworkBackground: React.FC<Props> = ({
  seed,
  nodeCount = 14,
  edgeCount = 10,
  opacity = 0.16,
  color = COLORS.blue,
  sceneFrom,
}) => {
  const frame = useCurrentFrame();
  const { nodes, edges } = useMemo(() => buildNetwork(seed, nodeCount, edgeCount), [seed, nodeCount, edgeCount]);
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const globalOpacity = interpolate(frame - sceneFrom, [0, 30], [0, opacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <g opacity={globalOpacity}>
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          return (
            <ConnectionLine
              key={i}
              x1={a.x * WIDTH}
              y1={a.y * HEIGHT}
              x2={b.x * WIDTH}
              y2={b.y * HEIGHT}
              from={sceneFrom + e.delay}
              duration={30}
              color={color}
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}
        {nodes.map((n) => (
          <GeometricNode
            key={n.id}
            cx={n.x * WIDTH}
            cy={n.y * HEIGHT}
            r={n.r}
            color={color}
            from={sceneFrom + n.delay}
          />
        ))}
      </g>
    </svg>
  );
};
