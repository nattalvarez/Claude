import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { BED, CUES } from "./cues";
import { SOUND_ENABLED } from "../config";

const LEAD = 2; // frames: sound lands with the picture, not after it

export const Sound: React.FC = () => {
  if (!SOUND_ENABLED) return null;
  return (
    <>
      <Audio src={staticFile(`sfx/${BED.file}.wav`)} volume={BED.vol} />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.max(0, c.f - LEAD)} durationInFrames={150} layout="none">
          <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </>
  );
};
