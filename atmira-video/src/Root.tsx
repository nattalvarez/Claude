import React from "react";
import { Composition } from "remotion";
import "./lib/fonts";
import { FPS, H, W } from "./theme";
import { TOTAL_FRAMES } from "./lib/tl";
import { AtmiraCorporativo } from "./AtmiraCorporativo";

export const Root: React.FC = () => (
  <>
    <Composition id="AtmiraCorporativo" component={AtmiraCorporativo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
