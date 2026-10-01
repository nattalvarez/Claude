import React from "react";
import { Layer, Poly3, rectPts } from "../engine/primitives";
import { Vec3, add3, lerp } from "../engine/math";
import { C, pinkA, ease } from "../theme";
import { Client, Mediator, Insurer, AgentSwarm } from "./Entities";
import { Channel, Packet } from "./Channel";
import { REL, HEIGHT } from "./layout";

export type SysState = {
  o?: Vec3; // origin of this copy of the system
  a: { c: number; m: number; i: number; agent: number; plane: number };
  draw: { cm: number; mi: number; ac: number; am: number; ai: number };
  cPos?: Vec3; mPos?: Vec3; // absolute overrides (opening scene: they approach each other)
  packets?: Partial<Record<"cm" | "mi" | "ac" | "am" | "ai", Packet[]>>;
  hot?: number;
  pulse?: { c?: number; m?: number; i?: number };
  gap?: number; seal?: number;
  opacity?: number;
  pinkChannels?: boolean;
  agentR?: number;
};

/**
 * The ecosystem: client (point) · mediator (prism) · insurer (layered slab) and
 * the new actor — a distributed swarm living on its own plane above them.
 */
export const System: React.FC<SysState> = ({
  o = [0, 0, 0], a, draw, cPos, mPos, packets = {}, hot = 0, pulse = {}, gap = 14, seal = 0, opacity = 1, agentR = 104,
}) => {
  const P = (v: Vec3): Vec3 => add3(v, o);
  const cp = cPos ?? P(REL.client);
  const mp = mPos ?? P(REL.mediator);
  const ip = P(REL.insurer);
  const cA: Vec3 = [cp[0], HEIGHT.client, cp[2]];
  const mA: Vec3 = [mp[0], HEIGHT.mediator, mp[2]];
  const iA: Vec3 = [ip[0], HEIGHT.insurer, ip[2]];
  const ag = P(REL.agent);
  const planeY = ag[1] - 10;
  const pa = ease.out(a.plane);
  const half: [number, number] = [600 * pa, 380 * pa];
  const planeC: Vec3 = [o[0] + 60, planeY, o[2] + 130];
  const sw = 1 + hot * 0.9;
  return (
    <Layer opacity={opacity}>
      {/* the agents' plane — a new layer of the system */}
      {a.plane > 0.01 && (
        <>
          <Poly3 pts={rectPts(planeC, half[0] * 2, half[1] * 2).map((p) => [p[0], planeY, p[2]] as Vec3)} stroke={C.pink} sw={1} opacity={0.38 * pa} fill={pinkA(0.05 * pa)} />
        </>
      )}
      <Channel a={cA} b={mA} lift={110} draw={draw.cm} color={C.g500} sw={sw} packets={packets.cm} />
      <Channel a={mA} b={iA} lift={110} draw={draw.mi} color={C.g500} sw={sw} packets={packets.mi} />
      {/* agent tendrils */}
      <Channel a={[ag[0], ag[1] - 48, ag[2]]} b={mA} lift={0} draw={draw.am} color={C.pink} sw={1.1} opacity={0.75} packets={packets.am} packetColor={C.pink} />
      <Channel a={[ag[0], ag[1] - 40, ag[2]]} b={cA} lift={20} draw={draw.ac} color={C.pink} sw={1.1} opacity={0.75} packets={packets.ac} packetColor={C.pink} />
      <Channel a={[ag[0], ag[1] - 40, ag[2]]} b={iA} lift={20} draw={draw.ai} color={C.pink} sw={1.1} opacity={0.75} packets={packets.ai} packetColor={C.pink} />
      <Client a={a.c} pos={cp} pulse={pulse.c} />
      <Insurer a={a.i} pos={ip} gap={gap} seal={seal} pulse={pulse.i} />
      <Mediator a={a.m} pos={mp} pulse={pulse.m} />
      {a.agent > 0.01 && <AgentSwarm center={ag} assemble={a.agent} R={agentR} />}
    </Layer>
  );
};

/** Schedule helper: repeating packets between f0 and f1. */
export const loop = (f0: number, f1: number, period: number, dur: number, dir: 1 | -1 = 1, color?: string, r?: number): Packet[] => {
  const out: Packet[] = [];
  for (let f = f0; f < f1; f += period) out.push({ f0: f, dur, dir, color, r });
  return out;
};
