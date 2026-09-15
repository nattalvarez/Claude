import * as THREE from "three";

type PhysicalOpts = {
  color: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  opacity?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
};

/** One factory for every mesh material in the piece — keeps the look
 * consistent (matte, low-metalness, corporate) across all seven scenes. */
export function physical(opts: PhysicalOpts) {
  return new THREE.MeshPhysicalMaterial({
    color: opts.color,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.12,
    clearcoat: opts.clearcoat ?? 0.1,
    clearcoatRoughness: 0.4,
    transmission: opts.transmission ?? 0,
    thickness: opts.thickness ?? 0.5,
    ior: opts.ior ?? 1.3,
    opacity: opts.opacity ?? 1,
    transparent: opts.transparent ?? (opts.transmission ? true : false),
    emissive: opts.emissive ?? "#000000",
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
}
