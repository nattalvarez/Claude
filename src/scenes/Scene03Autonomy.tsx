import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { LevelLadder } from "../components/LevelLadder";
import { NetworkBackground } from "../components/NetworkBackground";

const LEVELS = [
  { n: "01", label: "Automatización de tareas" },
  { n: "02", label: "Asistencia inteligente" },
  { n: "03", label: "Autonomía supervisada" },
  { n: "04", label: "Alta autonomía" },
  { n: "05", label: "Recobro autónomo" },
];

const LADDER_WIDTH = 1500;

/** 0:08–0:13 — De la automatización a la autonomía. A five-step evolution line fills
 * progressively; the final step becomes the scene's climax. */
export const Scene03Autonomy: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <NetworkBackground seed="s03" nodeCount={10} edgeCount={6} opacity={0.1} sceneFrom={0} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <KineticText
          parts={[{ text: "De la automatización al " }, { text: "recobro autónomo.", color: COLORS.turquoise }]}
          from={6}
          fontSize={50}
          fontWeight={500}
          color={COLORS.navy}
          align="center"
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: 60 }}>
          <LevelLadder levels={LEVELS} from={38} stagger={17} width={LADDER_WIDTH} highlightLastLabel="Recobro Autónomo Gobernado" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
