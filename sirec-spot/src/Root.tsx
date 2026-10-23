import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { SirecSpot } from "./SirecSpot";
import { DURATION_FRAMES, FPS } from "./timing";

export const Root: React.FC = () => (
  <Composition id="SirecSpot" component={SirecSpot} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
);
