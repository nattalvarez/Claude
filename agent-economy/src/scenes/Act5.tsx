import React from "react";
import { useCurrentFrame, staticFile } from "remotion";
import { Layer, Poly3, Dot3, Solid3, boxFaces, octaFaces, ringPts, rectPts } from "../engine/primitives";
import { Channel } from "../world/Channel";
import { Client, Mediator, Insurer, AgentSwarm } from "../world/Entities";
import { Screen, TextBlock } from "../engine/Text";
import { CameraProvider } from "../engine/camera";
import { Vec3, lerp, lerp3, ramp, rng } from "../engine/math";
import { C, WEIGHT, ease, pinkA } from "../theme";
import { SC, LOGO, W, H } from "../config";
import { X } from "../world/layout";
import { loop } from "../world/System";
import { wallCover, WALL, PANEL, pinkRect } from "../climax";

const T = X.trust;
const K: Vec3 = [T + 330, 0, 40];
const ROW: Vec3[] = [[T - 480, 0, 0], [T - 160, 0, 0], [T + 160, 0, 0], [T + 480, 0, 0]];

// slabs: [base, reaction target, reaction frame, convergence slot]
const SLABS: { base: Vec3; tgt: Vec3; t: number; slot: Vec3 }[] = [
  { base: [T - 60, 0, 330], tgt: [T - 20, 0, 200], t: 1684, slot: [K[0] - 280, 0, 150] },
  { base: [T + 300, 0, 260], tgt: [T + 300, 0, 170], t: 1694, slot: [K[0], 0, 150] },
  { base: [T + 640, 0, 330], tgt: [T + 640, 0, 200], t: 1704, slot: [K[0] + 280, 0, 150] },
  { base: [T + 160, 0, 0], tgt: [T + 210, 0, -230], t: 1650, slot: [K[0] - 280, 0, -60] }, // first mover
  { base: [T + 560, 0, -190], tgt: [T + 560, 0, -130], t: 1678, slot: [K[0], 0, -60] },
  { base: [T + 860, 0, 60], tgt: [T + 860, 0, -10], t: 1690, slot: [K[0] + 280, 0, -60] },
];

/** Draw `fn` in pink and in white; crossfade as the pink surface takes over the stage. */
const Dual: React.FC<{ w: number; fn: (c: string) => React.ReactNode }> = ({ w, fn }) => (
  <>
    {w < 0.99 && <g opacity={1 - w}>{fn(C.pink)}</g>}
    {w > 0.01 && <g opacity={w}>{fn("#FFFFFF")}</g>}
  </>
);

/**
 * The climax recalls earlier scenes: small white echoes of the comparison grid, the
 * converter, the data constellation, the open sockets and the funnel appear around
 * the system and drift toward it — the whole ecosystem, converging.
 */
const Echoes: React.FC<{ conv: number }> = ({ conv }) => {
  const f = useCurrentFrame();
  const op = ramp(f, 1774, 1812) * (1 - ramp(f, 1866, 1892));
  if (op <= 0.01) return null;
  const pull = 1 - 0.3 * conv;
  const P = (x: number, y: number, z: number): Vec3 => [K[0] + x * pull, y, K[2] + z * pull];
  const W_ = "#FFFFFF";
  const grid: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) grid.push(<Solid3 key={i} faces={boxFaces(P(-1750 + (i % 4) * 130, 26, 380 + Math.floor(i / 4) * 150), 52, 52, 52, 0.35)} lo="#D4D4D1" hi="#FFFFFF" opacity={op} />);
  const rr = rng(5);
  const dots = Array.from({ length: 22 }, () => P(1250 + (rr() - 0.5) * 420, 40 + rr() * 160, 620 + (rr() - 0.5) * 300));
  const centers: Vec3[] = [P(-1620, 60, 450), P(-1200, 90, 940), P(1250, 100, 620), P(-250, 40, 1010), P(1650, 250, -200)];
  return (
    <>
      {grid}
      <Solid3 faces={octaFaces(P(-1200, 100, 940), 46, f * 0.05)} lo="#D4D4D1" hi="#FFFFFF" opacity={op} />
      <Poly3 pts={ringPts(P(-1200, 0, 940), 130)} stroke={W_} sw={1} opacity={0.6 * op} />
      {dots.map((d, i) => <Dot3 key={i} p={d} r={6.5} fill={W_} opacity={0.9 * op} />)}
      {dots.slice(1).map((d, i) => <Poly3 key={`l${i}`} pts={[dots[i], d]} stroke={W_} sw={0.8} opacity={0.35 * op} />)}
      {[[-420, 1030], [-120, 1000], [-250, 1230]].map(([x, z], i) => (
        <Poly3 key={`s${i}`} pts={ringPts(P(x, 0, z), 44)} stroke={W_} sw={1.2} opacity={0.7 * op} />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const y0 = 40 + i * 38, x0 = 1500 + ((i * 41) % 5) * 60;
        return <Poly3 key={`k${i}`} pts={[P(x0, y0, -200), P(x0 + 260, 190, -200)]} stroke={W_} sw={1.4} opacity={0.65 * op} />;
      })}
      {centers.map((c, i) => (
        <Channel key={`c${i}`} a={c} b={[K[0], 160, K[2]]} lift={120} draw={ramp(f, 1782 + i * 5, 1830 + i * 5, ease.inOut)} color={W_} sw={1} opacity={0.38 * op} />
      ))}
    </>
  );
};

const Field: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1500 || f > SC.s13[0] + 40) return null;
  const w = ramp(f, WALL.rise[0] + 4, WALL.rise[1] + 10);
  const fade = 1 - ramp(f, WALL.rise[0] + 2, WALL.rise[1] + 4); // the pink stage is clean: elements leave as it rises
  const conv = ease.inOut(ramp(f, 1744, 1806));
  const sett = ease.inOut(ramp(f, 1520, 1566));
  const offz = (i: number) => lerp(((i * 97) % 5 - 2) * 130, 0, sett);
  const e1 = ease.inOut(ramp(f, 1612, 1652));

  // actors
  const cP = lerp3([ROW[0][0], 0, offz(0)], [K[0], 0, -300], conv);
  const mP = lerp3([ROW[1][0], 0, offz(1)], [K[0], 0, 360], conv);
  const swarmC = lerp3(lerp3([ROW[3][0], 120, offz(3)], [T + 330, 450, 150], e1), [K[0], 430, K[2]], conv);
  const R = lerp(lerp(72, 96, e1), 135, conv);
  const aIn = (i: number) => ease.out(ramp(f, 1506 + i * 7, 1536 + i * 7));

  const slabPos = (i: number): Vec3 => {
    const s = SLABS[i];
    const base: Vec3 = i === 3 ? [ROW[2][0], 0, offz(2)] : s.base;
    const r = ease.inOut(ramp(f, s.t, s.t + 40));
    return lerp3(lerp3(base, s.tgt, r), s.slot, ease.inOut(ramp(f, 1744 + i * 3, 1806 + i * 3)));
  };
  const slabA = (i: number) => (i === 3 ? aIn(2) : ease.out(ramp(f, 1612 + i * 6, 1650 + i * 6)));

  const planeOp = ramp(f, 1622, 1656) * (1 - ramp(f, 1790, 1830));
  const lineOp = (1 - ramp(f, 1604, 1632)) * ramp(f, 1556, 1590);
  const line = ramp(f, 1556, 1590, ease.inOut);

  const tendrils = (col: string, mul: number) => (
    <>
      {SLABS.map((s, i) => {
        const p = slabPos(i);
        const start = Math.max(1644, s.t - 6);
        return (
          <Channel key={i} a={[swarmC[0], swarmC[1] - 30, swarmC[2]]} b={[p[0], 110, p[2]]} lift={0}
            draw={ramp(f, start, start + 24, ease.inOut)} color={col} sw={1.1} opacity={0.8 * mul}
            packets={loop(start + 20, 1880, 52, 34, i % 2 ? 1 : -1, col, 5.5)} packetColor={col} />
        );
      })}
      <Channel a={[swarmC[0], swarmC[1] - 30, swarmC[2]]} b={[cP[0], 90, cP[2]]} lift={0} draw={ramp(f, 1750, 1780)} color={col} sw={1.1} opacity={0.8 * mul} />
      <Channel a={[swarmC[0], swarmC[1] - 30, swarmC[2]]} b={[mP[0], 150, mP[2]]} lift={0} draw={ramp(f, 1756, 1786)} color={col} sw={1.1} opacity={0.8 * mul} />
    </>
  );

  return (
    <Layer opacity={fade}>
      <Echoes conv={conv} />
      {lineOp > 0.01 && (
        <Poly3 pts={[[ROW[0][0], 104, 0], [lerp(ROW[0][0], ROW[3][0], line), 104, 0]]} stroke={C.pink} sw={1.4} opacity={0.85 * lineOp} />
      )}
      {planeOp > 0.01 && (
        <Dual w={w} fn={(c) => (
          <Poly3 pts={rectPts([T + 330 + (K[0] - T - 330) * conv, 440, 130], 1400, 660).map((p) => [p[0], 440, p[2]] as Vec3)}
            stroke={c} sw={1} opacity={0.4 * planeOp} fill={c === C.pink ? pinkA(0.05) : "rgba(255,255,255,0.06)"} />
        )} />
      )}
      <Dual w={w} fn={(c) => tendrils(c, 1)} />
      <Client a={aIn(0)} pos={cP} sync />
      <Mediator a={aIn(1)} pos={mP} sync />
      {SLABS.map((_, i) => (
        <Insurer key={i} a={slabA(i)} pos={slabPos(i)} scale={0.8 + 0.2 * conv} gap={14 - 10 * conv} pulse={i === 3 ? ramp(f, 1650, 1700) : 0} />
      ))}
      <Dual w={w} fn={(c) => <AgentSwarm center={swarmC} R={R} assemble={aIn(3)} count={34} size={5.8} color={c} />} />
    </Layer>
  );
};

/** Pink surface: rises behind the system (climax), then contracts into the end-card panel. */
export const PinkField: React.FC = () => {
  const f = useCurrentFrame();
  const r = pinkRect(f);
  if (!r) return null;
  return <div style={{ position: "absolute", left: r.x0, top: r.y0, width: r.x1 - r.x0, height: r.y1 - r.y0, background: C.pink }} />;
};

const UI_CAM = { x: 0, y: 0, z: -1400, yaw: 0, pitch: 0, f: 1400, ox: 0, oy: 0, k: 1 };

export const Act5: React.FC = () => {
  const f = useCurrentFrame();
  const inEnd = f >= SC.s13[0] - 6;
  return (
    <>
      <Field />

      {/* S11 */}
      <Screen style={{ left: 80, top: 625 }}>
        <TextBlock start={1642} exit={SC.s11[1] - 20} size={78} track={-0.028} lead={1.05} stagger={9} color={C.text2}
          lines={[
            "Las aseguradoras que",
            [{ t: "den hoy el primer paso", w: WEIGHT.medium, color: C.ink }],
            "ayudarán a escribir las",
            [{ t: "reglas de mañana.", w: WEIGHT.medium, color: C.pink, size: 1.38 }],
          ]} />
      </Screen>

      {/* S12 — climax: scale + silence + camera; type in white on the pink surface */}
      <Screen style={{ left: 80, top: 600 }}>
        <TextBlock start={1772} exit={SC.s12[1] - 4} size={108} weight={WEIGHT.medium} color="#FFFFFF" track={-0.04} lead={1.04} stagger={11} dur={34}
          lines={["Las reglas se", "están escribiendo", "ahora."]} />
      </Screen>

      {/* S13 — close: clean. Title, the publication's mark, the date. */}
      {inEnd && (
        <>
          <Screen style={{ left: 80, top: 330 }}>
            <TextBlock start={1920} size={74} track={-0.03} lead={1.1} stagger={12} color={C.text2}
              lines={[
                [{ t: "Agent Economy", w: WEIGHT.medium, color: C.ink }, { t: ": quién" }],
                "fijará las reglas del seguro",
              ]} />
          </Screen>
          {/* Insurance Revolution, 1.25× its native 150×58 so it stays sharp */}
          <img src={staticFile("logo-ir.png")} style={{
            position: "absolute", left: 80, top: 552 + (1 - ramp(f, 1962, 1988, ease.out)) * 10, width: 188, height: 73,
            opacity: ramp(f, 1962, 1988, ease.out),
          }} />
          <Screen style={{ left: 80, top: 680 }}>
            <TextBlock start={1992} size={52} weight={WEIGHT.medium} track={-0.015} lead={1.2} dur={28} color={C.ink}
              lines={["12 de noviembre"]} />
          </Screen>
        </>
      )}
    </>
  );
};
