import React from "react";
import { useCurrentFrame } from "remotion";
import { Dot3, Poly3 } from "../engine/primitives";
import { Vec3, lerp, ramp } from "../engine/math";
import { C, ease } from "../theme";

export const arcPoint = (a: Vec3, b: Vec3, lift: number, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t) + lift * Math.sin(Math.PI * t),
  lerp(a[2], b[2], t),
];

export type Packet = { f0: number; dur: number; dir?: 1 | -1; color?: string; r?: number };

type ChannelProps = {
  a: Vec3; b: Vec3; lift?: number;
  draw?: number; // 0..1 hairline drawn from a
  color?: string; sw?: number; opacity?: number; dash?: string;
  packets?: Packet[];
  packetColor?: string;
};

/** A hairline between two entities and the information that travels along it. */
export const Channel: React.FC<ChannelProps> = ({
  a, b, lift = 90, draw = 1, color = C.g500, sw = 1.1, opacity = 1, dash, packets = [], packetColor = C.ink,
}) => {
  const frame = useCurrentFrame();
  const N = 44;
  const pts = Array.from({ length: Math.max(2, Math.ceil(N * draw) + 1) }, (_, i) =>
    arcPoint(a, b, lift, Math.min(draw, (i / N))),
  );
  return (
    <>
      {draw > 0.01 && <Poly3 pts={pts} stroke={color} sw={sw} opacity={opacity} dash={dash} />}
      {packets.map((pk, i) => {
        const u0 = (frame - pk.f0) / pk.dur;
        if (u0 < 0 || u0 > 1) return null;
        const e = ease.inOut(u0);
        const t = pk.dir === -1 ? 1 - e : e;
        const fade = Math.min(1, u0 / 0.12, (1 - u0) / 0.12);
        const col = pk.color ?? packetColor;
        const tail = [0.07, 0.045, 0.02, 0].map((k) => {
          const tt = pk.dir === -1 ? Math.min(1, t + k) : Math.max(0, t - k);
          return arcPoint(a, b, lift, tt);
        });
        return (
          <React.Fragment key={i}>
            <Poly3 pts={tail} stroke={col} sw={2} opacity={0.35 * fade * opacity} />
            <Dot3 p={arcPoint(a, b, lift, t)} r={pk.r ?? 6} fill={col} opacity={fade * opacity} />
          </React.Fragment>
        );
      })}
    </>
  );
};
