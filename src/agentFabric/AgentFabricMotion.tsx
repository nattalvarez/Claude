import React from "react";
import { AbsoluteFill } from "remotion";
import { loadRobotoLocally } from "../shared/loadRobotoLocally";
import { Grade, Grain, Vignette } from "../components/CinematicLayers";
import { World } from "./World";
import { Background } from "./Background";

loadRobotoLocally();

/** SIREC Agent Fabric — 28s, one continuous camera move through a tight
 * vertical 3D architecture: SIREC → SIREC Agent Fabric → MCP → Agentes IA →
 * wider ecosystem → the three closing statements → a final wide shot of the
 * whole architecture. No cuts, no static cards. */
export const AgentFabricMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <World />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
