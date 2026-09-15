import { random } from "remotion";

/** Deterministic pseudo-random in [min, max), seeded so every frame render is reproducible. */
export const seededRange = (seed: string, min: number, max: number): number => {
  return min + random(seed) * (max - min);
};

export type NetworkNode = {
  id: string;
  x: number; // 0..1 of container width
  y: number; // 0..1 of container height
  r: number; // px radius
  delay: number; // frames
};

export type NetworkEdge = {
  from: string;
  to: string;
  delay: number;
};

/** Builds a deterministic scattered-then-connected node/edge set for ambient backgrounds. */
export const buildNetwork = (
  seedPrefix: string,
  count: number,
  edgeCount: number
): { nodes: NetworkNode[]; edges: NetworkEdge[] } => {
  const nodes: NetworkNode[] = Array.from({ length: count }).map((_, i) => ({
    id: `${seedPrefix}-n${i}`,
    x: seededRange(`${seedPrefix}-x-${i}`, 0.04, 0.96),
    y: seededRange(`${seedPrefix}-y-${i}`, 0.08, 0.92),
    r: seededRange(`${seedPrefix}-r-${i}`, 2, 5),
    delay: Math.floor(seededRange(`${seedPrefix}-d-${i}`, 0, 40)),
  }));

  const edges: NetworkEdge[] = Array.from({ length: edgeCount }).map((_, i) => {
    const a = Math.floor(seededRange(`${seedPrefix}-ea-${i}`, 0, count));
    let b = Math.floor(seededRange(`${seedPrefix}-eb-${i}`, 0, count));
    if (b === a) b = (b + 1) % count;
    return {
      from: nodes[a].id,
      to: nodes[b].id,
      delay: Math.floor(seededRange(`${seedPrefix}-ed-${i}`, 20, 70)),
    };
  });

  return { nodes, edges };
};
