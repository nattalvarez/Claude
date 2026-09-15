import * as THREE from "three";
import { Easing } from "remotion";
import { EASE } from "../styles/theme";

export type Vec3 = [number, number, number];

export type CamKeyframe = {
  frame: number;
  position: Vec3;
  lookAt: Vec3;
  fov?: number;
  easing?: (t: number) => number;
};

export type CameraSample = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
};

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Deterministic camera sampler — same math drives the WebGL camera and the
 * DOM label projections, so 3D anchors and 2D text never drift apart. */
export function sampleCamera(frame: number, keyframes: CamKeyframe[]): CameraSample {
  const kfs = keyframes;
  if (kfs.length === 1) {
    const k = kfs[0];
    return {
      position: new THREE.Vector3(...k.position),
      lookAt: new THREE.Vector3(...k.lookAt),
      fov: k.fov ?? 40,
    };
  }
  let i = 0;
  while (i < kfs.length - 2 && frame >= kfs[i + 1].frame) i++;
  const a = kfs[i];
  const b = kfs[i + 1];
  const span = Math.max(1, b.frame - a.frame);
  const rawT = Math.min(1, Math.max(0, (frame - a.frame) / span));
  const ease = b.easing ?? EASE.inOut;
  const t = ease(rawT);
  const position = lerp3(a.position, b.position, t);
  const lookAt = lerp3(a.lookAt, b.lookAt, t);
  const fov = (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * t;
  return {
    position: new THREE.Vector3(...position),
    lookAt: new THREE.Vector3(...lookAt),
    fov,
  };
}

const projCamera = new THREE.PerspectiveCamera();
const projVec = new THREE.Vector3();

/** Projects a 3D world point to normalized screen space using the SAME
 * camera transform as the WebGL layer, so DOM labels stay glued to their
 * 3D anchors as the cinematic camera moves. */
export function projectToScreen(
  point: Vec3,
  sample: CameraSample,
  width: number,
  height: number
): { x: number; y: number; scale: number; depth: number; behind: boolean } {
  projCamera.fov = sample.fov;
  projCamera.aspect = width / height;
  projCamera.near = 0.1;
  projCamera.far = 200;
  projCamera.position.copy(sample.position);
  projCamera.up.set(0, 1, 0);
  projCamera.lookAt(sample.lookAt);
  projCamera.updateProjectionMatrix();
  projCamera.updateMatrixWorld(true);

  projVec.set(...point);
  const camDist = sample.position.distanceTo(projVec);
  const behind = projVec.clone().sub(sample.position).dot(
    sample.lookAt.clone().sub(sample.position)
  ) < 0;
  projVec.project(projCamera);

  const x = (projVec.x * 0.5 + 0.5) * width;
  const y = (1 - (projVec.y * 0.5 + 0.5)) * height;
  // scale factor for depth cueing — 1 at a reference distance, smaller far away
  const refDist = 10;
  const scale = THREE.MathUtils.clamp(refDist / Math.max(1, camDist), 0.35, 1.6);
  return { x, y, scale, depth: camDist, behind };
}

export const linear = (t: number) => t;
export { Easing };
