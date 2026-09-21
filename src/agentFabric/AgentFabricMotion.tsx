import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { BgMesh, Grade, Grain, Vignette } from "../components/CinematicLayers";
import { World } from "./World";
import { PersistentBrand } from "./PersistentBrand";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

/** SIREC Agent Fabric — 28s, one continuous camera move through a vertical
 * 3D architecture: SIREC → SIREC Agent Fabric → MCP → Agentes IA → wider
 * ecosystem → the three closing statements → a final wide shot of the whole
 * architecture. No cuts, no static cards, and the brand mark never leaves
 * the frame after the opening beat. */
export const AgentFabricMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgMesh />
      <World />
      <Grade />
      <Grain />
      <Vignette />
      <PersistentBrand />
    </AbsoluteFill>
  );
};
