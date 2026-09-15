import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SCENES, WIDTH, HEIGHT } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { LevelLadder } from "../components/LevelLadder";
import { ScanGrid } from "../components/ScanGrid";
import { SceneExit } from "../components/SceneExit";
import { Sparkline } from "../components/Sparkline";

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
    <AbsoluteFill>
      <SceneExit duration={SCENES.s03.duration}>
        <ScanGrid from={0} />

        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
          <Sparkline x={(WIDTH - 1500) / 2} y={330} width={1500} height={130} from={30} duration={70} seed="s03-trend" color={COLORS.blue} />
        </svg>

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
      </SceneExit>
    </AbsoluteFill>
  );
};
