import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { BgMesh, Grade, Grain, Vignette } from "../components/CinematicLayers";
import { World } from "./World";
import { T } from "./timeline";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

// Every hit lands 2–3 frames BEFORE its visual — early reads as synced, late as broken.
const HITS: { frame: number; src: string; volume: number }[] = [
  { frame: Math.max(0, T.titleFrom - 3), src: "whoosh.wav", volume: 0.5 },
  { frame: T.sirec.container - 3, src: "pop.wav", volume: 0.55 },
  { frame: T.connSirecFabric.from - 3, src: "whoosh.wav", volume: 0.4 },
  { frame: T.fabric.container - 3, src: "pop.wav", volume: 0.55 },
  { frame: T.connFabricMcp.from - 3, src: "whoosh.wav", volume: 0.35 },
  { frame: T.mcp.badge - 3, src: "bass.wav", volume: 0.7 },
  { frame: T.connMcpAgents.from - 3, src: "whoosh.wav", volume: 0.4 },
  { frame: T.agents.container - 3, src: "pop.wav", volume: 0.55 },
  ...T.pills.map((p) => ({ frame: p.from - 2, src: "pop.wav", volume: 0.32 })),
  { frame: 498, src: "whoosh.wav", volume: 0.55 }, // pull-back to ecosystem
  { frame: T.ecosystem.gc1NodeFrom - 3, src: "bass.wav", volume: 0.4 },
  { frame: T.concepts.potencia - 3, src: "shimmer.wav", volume: 0.6 },
  { frame: T.concepts.integra - 3, src: "shimmer.wav", volume: 0.6 },
  { frame: T.concepts.orquesta - 3, src: "shimmer.wav", volume: 0.6 },
];

/** SIREC Agent Fabric — 26s, one continuous camera move through a vertical
 * 3D architecture: SIREC → SIREC Agent Fabric → MCP → Agentes IA → wider
 * ecosystem → the three closing statements. No cuts, no static cards. */
export const AgentFabricMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("sfx/pad.wav")} volume={0.8} />
      {HITS.map((h, i) => (
        <Sequence key={i} from={h.frame}>
          <Audio src={staticFile(`sfx/${h.src}`)} volume={h.volume} />
        </Sequence>
      ))}

      <BgMesh />
      <World />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
