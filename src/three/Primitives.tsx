import React, { useMemo } from "react";
import * as THREE from "three";
import { physical } from "./materials";

// ---------------------------------------------------------------------
// Basic volumetric shapes. Every shape gets real geometry, real shading —
// no flat planes standing in for "3D".
// ---------------------------------------------------------------------

export const Node: React.FC<{
  position: [number, number, number];
  radius?: number;
  color: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  detail?: number;
  faceted?: boolean;
  opacity?: number;
  rotation?: [number, number, number];
}> = ({ position, radius = 0.5, color, roughness, metalness, clearcoat, detail = 2, faceted = false, opacity = 1, rotation }) => {
  const geometry = useMemo(
    () => (faceted ? new THREE.IcosahedronGeometry(radius, detail) : new THREE.SphereGeometry(radius, 48, 32)),
    [radius, detail, faceted]
  );
  const material = useMemo(
    () => physical({ color, roughness, metalness, clearcoat, opacity, transparent: opacity < 1 }),
    [color, roughness, metalness, clearcoat, opacity]
  );
  return <mesh position={position} rotation={rotation} geometry={geometry} material={material} />;
};

export const Ring: React.FC<{
  position: [number, number, number];
  radius?: number;
  tube?: number;
  color: string;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
  opacity?: number;
}> = ({ position, radius = 1, tube = 0.045, color, rotation = [Math.PI / 2, 0, 0], roughness, metalness, opacity = 1 }) => {
  const geometry = useMemo(() => new THREE.TorusGeometry(radius, tube, 20, 96), [radius, tube]);
  const material = useMemo(
    () => physical({ color, roughness, metalness, clearcoat: 0.3, opacity, transparent: opacity < 1 }),
    [color, roughness, metalness, opacity]
  );
  return <mesh position={position} rotation={rotation} geometry={geometry} material={material} />;
};

export const Plate: React.FC<{
  position: [number, number, number];
  size?: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
  opacity?: number;
}> = ({ position, size = [1.4, 0.08, 0.9], color, rotation, roughness, metalness, opacity = 1 }) => {
  const geometry = useMemo(() => new THREE.BoxGeometry(...size, 2, 1, 2), [size[0], size[1], size[2]]);
  const material = useMemo(
    () => physical({ color, roughness, metalness, clearcoat: 0.25, opacity, transparent: opacity < 1 }),
    [color, roughness, metalness, opacity]
  );
  return <mesh position={position} rotation={rotation} geometry={geometry} material={material} />;
};

export const Prism: React.FC<{
  position: [number, number, number];
  radius?: number;
  height?: number;
  sides?: number;
  color: string;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
  opacity?: number;
}> = ({ position, radius = 0.5, height = 1, sides = 6, color, rotation, roughness, metalness, opacity = 1 }) => {
  const geometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, height, sides, 1), [radius, height, sides]);
  const material = useMemo(
    () => physical({ color, roughness, metalness, clearcoat: 0.2, opacity, transparent: opacity < 1 }),
    [color, roughness, metalness, opacity]
  );
  return <mesh position={position} rotation={rotation} geometry={geometry} material={material} />;
};

export const Cube: React.FC<{
  position: [number, number, number];
  size?: number;
  color: string;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
  opacity?: number;
}> = ({ position, size = 0.4, color, rotation, roughness, metalness, opacity = 1 }) => {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
  const material = useMemo(
    () => physical({ color, roughness, metalness, clearcoat: 0.2, opacity, transparent: opacity < 1 }),
    [color, roughness, metalness, opacity]
  );
  return <mesh position={position} rotation={rotation} geometry={geometry} material={material} />;
};

// ---------------------------------------------------------------------
// Connection line between two points — a thin real cylinder, not a 2D
// stroke, so it holds up under perspective and camera movement.
// ---------------------------------------------------------------------
export const Line3D: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  radius?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
}> = ({ from, to, color, radius = 0.012, opacity = 1, emissive, emissiveIntensity }) => {
  const { geometry, position, quaternion } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, 8, 1);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { geometry: geo, position: mid, quaternion: quat };
  }, [from[0], from[1], from[2], to[0], to[1], to[2], radius]);

  const material = useMemo(
    () =>
      physical({
        color,
        roughness: 0.4,
        metalness: 0.05,
        opacity,
        transparent: true,
        emissive,
        emissiveIntensity,
      }),
    [color, opacity, emissive, emissiveIntensity]
  );

  return <mesh geometry={geometry} position={position} quaternion={quaternion} material={material} />;
};

/** A small bright sphere travelling from `from` to `to` at parameter `t`
 * (0..1) — the signal pulse that reads a network connection as "live". */
export const PulseSignal: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  t: number;
  color: string;
  radius?: number;
}> = ({ from, to, t, color, radius = 0.05 }) => {
  if (t <= 0 || t >= 1) return null;
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const p = a.lerp(b, t);
  return (
    <mesh position={[p.x, p.y, p.z]}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------------
// Scattered geometric particle field — the "data ecosystem" for scene 1.
// Deterministic (seeded), so re-renders per frame stay stable.
// ---------------------------------------------------------------------
export type ParticleSpec = {
  position: [number, number, number];
  gridTarget?: [number, number, number];
  scale: number;
  kind: "cube" | "sphere" | "tetra" | "disc";
  color: string;
  seed: number;
};

export const ParticleField: React.FC<{ particles: ParticleSpec[]; frame: number; settle: number }> = ({
  particles,
  frame,
  settle,
}) => {
  return (
    <group>
      {particles.map((p, i) => {
        const drift = Math.sin(frame / 50 + p.seed) * 0.12 * (1 - settle);
        const driftY = Math.cos(frame / 65 + p.seed * 1.7) * 0.1 * (1 - settle);
        const base = p.gridTarget
          ? [
              p.position[0] + (p.gridTarget[0] - p.position[0]) * settle,
              p.position[1] + (p.gridTarget[1] - p.position[1]) * settle,
              p.position[2] + (p.gridTarget[2] - p.position[2]) * settle,
            ]
          : p.position;
        const pos: [number, number, number] = [base[0] + drift, base[1] + driftY, base[2]];
        const rot: [number, number, number] = [frame / 90 + p.seed, frame / 130 + p.seed * 0.6, 0];
        const mat = physical({ color: p.color, roughness: 0.6, metalness: 0.08, clearcoat: 0.15 });
        if (p.kind === "sphere") {
          return <mesh key={i} position={pos} rotation={rot} material={mat}><sphereGeometry args={[p.scale, 20, 16]} /></mesh>;
        }
        if (p.kind === "tetra") {
          return <mesh key={i} position={pos} rotation={rot} material={mat}><tetrahedronGeometry args={[p.scale, 0]} /></mesh>;
        }
        if (p.kind === "disc") {
          return <mesh key={i} position={pos} rotation={rot} material={mat}><cylinderGeometry args={[p.scale, p.scale, p.scale * 0.12, 20]} /></mesh>;
        }
        return <mesh key={i} position={pos} rotation={rot} material={mat}><boxGeometry args={[p.scale, p.scale, p.scale]} /></mesh>;
      })}
    </group>
  );
};

export function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
