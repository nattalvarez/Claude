import React from "react";
import { theme } from "../theme";
import { Scene } from "../components/Scene";
import { CueText, Tok } from "../components/CueText";
import { gap, vw } from "../timing";

const SHADOW = "0 6px 50px rgba(6,14,28,0.55)";

const L1: Tok[] = [
  { t: "El", at: vw("el", 0) },
  { t: "agua", at: vw("agua") },
  { t: "nunca", at: vw("nunca"), serif: true, color: theme.colors.ice },
  { t: "se", at: vw("se", 0) },
  { t: "detiene.", at: vw("detiene") },
];

const L2: Tok[] = [
  { t: "Rodea.", at: vw("rodea"), br: false },
  { t: "Avanza.", at: vw("avanza"), br: true },
  { t: "Y", at: vw("y", 0) },
  { t: "siempre", at: vw("siempre") },
  { t: "encuentra", at: vw("encuentra") },
  { t: "su", at: vw("su", 0) },
  { t: "camino.", at: vw("camino"), serif: true },
];

export const Intro1: React.FC = () => (
  <Scene from={0} to={gap("detiene")} name="El agua nunca se detiene">
    <CueText family="serif" tokens={L1} size={128} style={{ position: "absolute", left: 210, top: 380, width: 1500, justifyContent: "center", textShadow: SHADOW }} />
  </Scene>
);

export const Intro2: React.FC = () => (
  <Scene from={gap("detiene")} to={gap("camino")} name="Rodea, avanza, encuentra su camino">
    <CueText family="serif" tokens={L2} size={100} style={{ position: "absolute", left: 120, top: 610, width: 1400, textShadow: SHADOW }} />
  </Scene>
);
