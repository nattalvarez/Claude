import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TransitionSeries, type TransitionTiming } from "@remotion/transitions";
import timeline from "./data/timeline.json";
import { PRESENTATIONS } from "./transitions/presentations";
import { EASE } from "./theme";
import { audioFile, hasAudio, TOTAL_FRAMES, sceneById } from "./lib/tl";
import { ProgressLine } from "./components/Kinetic";
import { S01Apertura } from "./scenes/S01Apertura";
import { S02Modernizar } from "./scenes/S02Modernizar";
import { S03Agentica } from "./scenes/S03Agentica";
import { S04Transformacion } from "./scenes/S04Transformacion";
import { S05Plataforma } from "./scenes/S05Plataforma";
import { S06AgentFactory } from "./scenes/S06AgentFactory";
import { S07Donde } from "./scenes/S07Donde";
import { S08Como } from "./scenes/S08Como";
import { S09Quien } from "./scenes/S09Quien";
import { S10Especializacion } from "./scenes/S10Especializacion";
import { S11PorSector } from "./scenes/S11PorSector";
import { S12Banking } from "./scenes/S12Banking";
import { S13Insurance } from "./scenes/S13Insurance";
import { S14Smart } from "./scenes/S14Smart";
import { S15Casos } from "./scenes/S15Casos";
import { S16Clientes } from "./scenes/S16Clientes";
import { S17Cifras } from "./scenes/S17Cifras";
import { S18Cierre } from "./scenes/S18Cierre";

const REGISTRY: Record<string, React.FC> = {
  apertura: S01Apertura,
  modernizar: S02Modernizar,
  agentica: S03Agentica,
  transformacion: S04Transformacion,
  plataforma: S05Plataforma,
  agentfactory: S06AgentFactory,
  donde: S07Donde,
  como: S08Como,
  quien: S09Quien,
  especializacion: S10Especializacion,
  porsector: S11PorSector,
  banking: S12Banking,
  insurance: S13Insurance,
  smart: S14Smart,
  casos: S15Casos,
  clientes: S16Clientes,
  cifras: S17Cifras,
  cierre: S18Cierre,
};

const timing = (frames: number): TransitionTiming => ({
  getDurationInFrames: () => frames,
  getProgress: ({ frame }) => EASE.inOut(Math.min(1, Math.max(0, frame / frames))),
});

const Placeholder: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ background: "#eee", alignItems: "center", justifyContent: "center", fontSize: 60 }}>{id}</AbsoluteFill>
);

export const AtmiraCorporativo: React.FC = () => {
  const items: React.ReactNode[] = [];
  timeline.scenes.forEach((s, i) => {
    const Comp = REGISTRY[s.id];
    items.push(
      <TransitionSeries.Sequence key={`s-${s.id}`} durationInFrames={s.duration}>
        {Comp ? <Comp /> : <Placeholder id={s.id} />}
      </TransitionSeries.Sequence>,
    );
    if (s.out && i < timeline.scenes.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`t-${s.id}`}
          presentation={(PRESENTATIONS[s.out.kind] ?? PRESENTATIONS.fade)()}
          timing={timing(s.out.frames)}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <TransitionSeries>{items}</TransitionSeries>
      {/* línea de progreso del vídeo: se retira cuando arranca el clímax del cierre */}
      <ProgressLine total={TOTAL_FRAMES} hideFrom={sceneById("cierre").start + 120} />
      {/* Música y efectos originales (sintetizados desde el montaje; ver scripts/synth_music.py) */}
      <Audio src={staticFile("audio/music.mp3")} volume={0.9} />
      {/* Locución: un Audio por bloque, colocado en su frame exacto */}
      {timeline.scenes.flatMap((s) =>
        s.voice.map((v) =>
          hasAudio(v.id) ? (
            <Sequence key={`a-${v.id}`} from={s.start + v.from} durationInFrames={v.frames + 4}>
              <Audio src={staticFile(audioFile(v.id)!)} volume={1} />
            </Sequence>
          ) : null,
        ),
      )}
    </AbsoluteFill>
  );
};
