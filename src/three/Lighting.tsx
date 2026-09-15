import React from "react";
import { COLORS } from "../styles/theme";

/** Soft corporate lighting rig — ambient fill + one directional key + a
 * restrained rim light in the accent color for edge definition. No neon
 * emissive blow-outs, no game-engine point-light clusters. */
export const LightingLight: React.FC<{ rim?: string; keyIntensity?: number }> = ({
  rim = COLORS.turquoise,
  keyIntensity = 1.4,
}) => (
  <>
    <ambientLight intensity={1.05} color={COLORS.white} />
    <directionalLight position={[6, 9, 6]} intensity={keyIntensity} color={COLORS.white} />
    <directionalLight position={[-8, 2, -6]} intensity={0.7} color={rim} />
    <directionalLight position={[-4, -3, 7]} intensity={0.55} color={COLORS.white} />
    <hemisphereLight args={[COLORS.white, COLORS.lightBlue, 0.5]} />
  </>
);

export const LightingDark: React.FC<{ rim?: string }> = ({ rim = COLORS.turquoise }) => (
  <>
    <ambientLight intensity={0.22} color={COLORS.lightBlue} />
    <directionalLight position={[5, 8, 5]} intensity={0.9} color={COLORS.lightBlue} />
    <directionalLight position={[-7, -2, 4]} intensity={1.1} color={rim} />
    <hemisphereLight args={[COLORS.turquoise, COLORS.navy, 0.3]} />
  </>
);
