import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { FontLoader } from "./engine/fonts";
import { CameraProvider, sampleCamera } from "./engine/camera";
import { CAM_KEYS } from "./cameraPath";
import { Floor } from "./world/Floor";
import { RIPPLES } from "./events";
import { Act1 } from "./scenes/Act1";
import { Act2 } from "./scenes/Act2";
import { Act3 } from "./scenes/Act3";
import { Act4 } from "./scenes/Act4";
import { Act5, PinkField } from "./scenes/Act5";
import { wallCover } from "./climax";
import { Sound } from "./audio/Sound";
import { Grain } from "./Grain";
import { TechBackground } from "./Background";
import { Brand } from "./Brand";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = sampleCamera(CAM_KEYS, frame);
  return (
    <FontLoader>
      <AbsoluteFill style={{ background: C.bg }}>
        <Grain />
        <CameraProvider cam={cam}>
          <TechBackground />
          <PinkField />
          <TechBackground variant="pink" opacity={0.0 + wallCover(frame)} />
          <Floor inverse={wallCover(frame)} ripples={RIPPLES} appear={{ f0: 0, dur: 70, origin: [-200, 60], reach: 3400 }} />
          <Act1 />
          <Act2 />
          <Act3 />
          <Act4 />
          <Act5 />
        </CameraProvider>
        <Brand />
        <Sound />
      </AbsoluteFill>
    </FontLoader>
  );
};
