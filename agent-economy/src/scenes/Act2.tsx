import React from "react";
import { useCurrentFrame } from "remotion";
import { Layer, Dot3, Poly3, Solid3, boxFaces, octaFaces, ringPts, rectPts } from "../engine/primitives";
import { Channel, arcPoint } from "../world/Channel";
import { Insurer } from "../world/Entities";
import { loop } from "../world/System";
import { PlaneText, Screen, TextBlock } from "../engine/Text";
import { Vec3, clamp, lerp, lerp3, ramp, rotY } from "../engine/math";
import { C, WEIGHT, ease, pinkA } from "../theme";
import { SC } from "../config";
import { anchorAt } from "../cameraPath";
import { REL } from "../world/layout";
import { X } from "../world/layout";

const VERB = {
  a: anchorAt(632, 190, 140, 1500),
  b: anchorAt(700, 190, 780, 1500),
  c: anchorAt(805, 1010, 150, 1500),
};
const AG: Vec3 = [REL.agent[0], REL.agent[1] - 40, REL.agent[2]];

// ───────────────────────── station A · COMPARAN ─────────────────────────
const SELECTED = [2, 7, 10];
const cubeHome = (i: number): Vec3 => [X.A - 10 + (i % 6) * 112, 26, -10 + Math.floor(i / 6) * 190];
const lineUp = (k: number): Vec3 => [X.A + 130 + k * 150, 26, 85];

const StationA: React.FC = () => {
  const f = useCurrentFrame();
  const planeX = lerp(X.A - 60, X.A + 640, ramp(f, 598, 628, ease.inOut));
  const planeOp = ramp(f, 594, 602) * (1 - ramp(f, 628, 640));
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const home = cubeHome(i);
    const t0 = 574 + i * 2.6;
    const e = ease.out(ramp(f, t0, t0 + 30));
    if (e <= 0) continue;
    const start: Vec3 = [home[0] - 620, home[1] + 640, home[2] - 360];
    let pos = lerp3(start, home, e);
    const sel = SELECTED.indexOf(i);
    const passed = home[0] <= planeX + 10 && f > 598;
    const drop = ramp(f, 624 + (i % 6) * 2, 648, ease.inOut);
    let op = 1;
    if (sel < 0) { op = 1 - 0.8 * drop; pos = [pos[0], pos[1] - 10 * drop, pos[2]]; }
    else {
      const lift = ramp(f, 640, 668, ease.inOut);
      pos = lerp3(pos, lineUp(sel), lift);
      pos = [pos[0], pos[1] + 36 * lift, pos[2]];
      // leave towards C (they are what gets contracted)
      const go = ramp(f, 686 + sel * 6, 732 + sel * 6, ease.inOut);
      const dest: Vec3 = [X.C + 200 + (sel - 1) * 40, 220, 40];
      const mid = lerp3(pos, dest, go);
      pos = [mid[0], mid[1] + Math.sin(Math.PI * go) * 160, mid[2]];
      op = 1 - ramp(f, 722 + sel * 6, 744 + sel * 6);
    }
    const faces = boxFaces(pos, 52, 52, 52, 0.35);
    nodes.push(
      <React.Fragment key={i}>
        <Solid3 faces={faces} lo="#A2A29F" hi="#FFFFFF" opacity={op * e} />
        {passed && (sel >= 0 || drop < 0.2) && (
          <Poly3 pts={rectPts([pos[0], pos[1] + 26.5, pos[2]], 52, 52, 0.35)} stroke={C.pink} sw={2} opacity={op * (sel >= 0 ? 1 : 1 - drop * 5)} closed />
        )}
      </React.Fragment>,
    );
  }
  return (
    <>
      {nodes}
      <Poly3
        pts={[[planeX, 0, -90], [planeX, 0, 290], [planeX, 170, 290], [planeX, 170, -90]]}
        closed stroke={C.pink} sw={1.2} fill={pinkA(0.06)} opacity={planeOp}
      />
    </>
  );
};

// ───────────────────────── station B · COTIZAN ─────────────────────────
const SRC: Vec3[] = [[X.B - 330, 170, -120], [X.B - 390, 70, 70], [X.B - 330, 130, 250]];
const CONV: Vec3 = [X.B + 160, 104, 70];
const StationB: React.FC = () => {
  const f = useCurrentFrame();
  const a = ease.out(ramp(f, 640, 668));
  const cols = [C.g500, C.ink, C.g400];
  const dots: React.ReactNode[] = [];
  let lastHit = -999;
  SRC.forEach((s, k) => {
    for (let j = 0; j < 6; j++) {
      const t0 = 664 + k * 4 + j * 5;
      const u = (f - t0) / 24;
      if (u > 1) lastHit = Math.max(lastHit, t0 + 24);
      if (u < 0 || u > 1) continue;
      const e = ease.inOut(u);
      const p = arcPoint(s, CONV, 50 + k * 20, e);
      const jitter: Vec3 = [0, Math.sin(j * 2.1 + k) * 18 * (1 - e), Math.cos(j * 1.3 + k) * 18 * (1 - e)];
      dots.push(<Dot3 key={`${k}_${j}`} p={[p[0] + jitter[0], p[1] + jitter[1], p[2] + jitter[2]]} r={7} fill={cols[k]} opacity={Math.min(1, u * 5) * (1 - Math.max(0, (u - 0.85) / 0.15))} />);
    }
  });
  const bump = 1 + 0.18 * Math.max(0, 1 - (f - lastHit) / 8) * (f >= lastHit ? 1 : 0);
  const outU = ramp(f, 698, 728, ease.inOut);
  const out = arcPoint(CONV, [X.C + 200, 160, 40], 130, outU);
  return (
    <>
      <Poly3 pts={ringPts([CONV[0], 0, CONV[2]], 120 * a)} stroke={C.g400} sw={1} opacity={0.7 * a} />
      {dots}
      <Solid3 faces={octaFaces([CONV[0], CONV[1], CONV[2]], 46 * a * bump, f * 0.07)} lo="#9B9B98" hi="#FAFAF8" />
      {f > 696 && f < 734 && <Dot3 p={out} r={9} fill={C.pink} opacity={ramp(f, 696, 702) * (1 - ramp(f, 726, 734))} />}
      {f > 690 && f < 740 && <Poly3 pts={ringPts([CONV[0], 0, CONV[2]], 120 + ramp(f, 690, 730) * 120)} stroke={C.pink} sw={1.2} opacity={(1 - ramp(f, 690, 730)) * 0.8} />}
    </>
  );
};

// ───────────────────────── station C · CONTRATAN ─────────────────────────
const StationC: React.FC = () => {
  const f = useCurrentFrame();
  const gap = lerp(30, 0, ramp(f, 746, 772, ease.inOut));
  const seal = ramp(f, 764, 782);
  return (
    <Insurer pos={[X.C + 200, 0, 40]} a={ramp(f, 704, 736)} gap={gap} seal={seal} pulse={ramp(f, 764, 800)} />
  );
};

/** Out-of-focus agent particles sweeping past the lens as the camera leaves the system (S3 → S4). */
const Bokeh: React.FC = () => {
  const f = useCurrentFrame();
  const vis = ramp(f, 556, 566) * (1 - ramp(f, 596, 612));
  if (vis <= 0.01) return null;
  return (
    <Layer blur={7} opacity={vis * 0.7}>
      {Array.from({ length: 7 }, (_, i) => (
        <Dot3 key={i} p={[640 + i * 170, 240 + ((i * 53) % 4) * 70, -1180 + (i % 3) * 60]} r={9 + (i % 3) * 3} fill={C.pink} />
      ))}
    </Layer>
  );
};

export const Act2: React.FC = () => {
  const f = useCurrentFrame();
  if (f < SC.s04[0] - 20 || f > SC.s06[1] + 20) return null;
  const draw = (a: number, b: number) => ramp(f, a, b, ease.inOut);
  const Aanchor: Vec3 = [X.A + 200, 130, 100];
  const Banchor: Vec3 = [CONV[0], 120, CONV[2]];
  const Canchor: Vec3 = [X.C + 200, 120, 40];
  const stream = (f0: number, f1: number, per: number) => loop(f0, f1, per, 26, 1, undefined, 5.5);
  return (
    <>
      <Layer>
        <Channel a={AG} b={Aanchor} lift={70} draw={draw(556, 592)} color={C.pink} sw={1.1} opacity={0.8}
          packets={[...stream(560, 700, 14), ...stream(700, 800, 7), ...stream(800, 1200, 16)]} packetColor={C.pink} />
        <Channel a={Aanchor} b={Banchor} lift={120} draw={draw(640, 664)} color={C.pink} sw={1.1} opacity={0.8}
          packets={[...stream(660, 800, 9), ...stream(800, 1200, 20)]} packetColor={C.pink} />
        <Channel a={Banchor} b={Canchor} lift={120} draw={draw(704, 728)} color={C.pink} sw={1.1} opacity={0.8}
          packets={[...stream(724, 800, 8), ...stream(800, 1200, 18)]} packetColor={C.pink} />
        <StationA />
        <StationB />
        <StationC />
      </Layer>

      <Bokeh />

      {/* the three verbs: one per station, each in its own place and size */}
      <Screen style={{ left: 80, top: 160 }}>
        <TextBlock start={590} exit={634} size={200} weight={WEIGHT.light} track={-0.04} lead={1} lines={["Comparan."]} />
      </Screen>
      <Screen style={{ right: 80, top: 250 }}>
        <TextBlock start={654} exit={700} size={200} weight={WEIGHT.light} track={-0.04} lead={1} align="right" lines={["Cotizan."]} />
      </Screen>
      <Screen style={{ left: 80, top: 160 }}>
        <TextBlock start={712} exit={750} size={190} weight={WEIGHT.light} track={-0.04} lead={1} lines={["Contratan."]} />
      </Screen>

      <Screen style={{ left: 80, top: 190 }}>
        <TextBlock
          start={752} exit={SC.s04[1] + 8} size={78} track={-0.025} lead={1.04} stagger={10}
          lines={[
            [{ t: "En nombre de alguien.", color: C.g600 }],
            [{ t: "En segundos.", w: WEIGHT.medium, color: C.pink, size: 1.85 }],
          ]}
        />
      </Screen>
    </>
  );
};
