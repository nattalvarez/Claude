import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { CamKeyframe, sampleCamera } from "./camera";
import * as THREE from "three";

/** Drives the R3F PerspectiveCamera from a keyframe list, using the exact
 * same sampler that positions DOM label overlays. Remotion re-renders this
 * component synchronously per frame, so a layout effect keyed on frame is
 * enough — no RAF loop needed. */
export const CameraRig: React.FC<{ keyframes: CamKeyframe[] }> = ({ keyframes }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  useLayoutEffect(() => {
    const sample = sampleCamera(frame, keyframes);
    camera.position.copy(sample.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(sample.lookAt);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = sample.fov;
      camera.updateProjectionMatrix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, camera]);

  return null;
};
