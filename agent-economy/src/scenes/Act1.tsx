import React from "react";
import { useCurrentFrame } from "remotion";
import { System, loop, SysState } from "../world/System";
import { Layer, Dot3 } from "../engine/primitives";
import { Screen, TextBlock } from "../engine/Text";
import { C, WEIGHT, ease } from "../theme";
import { lerp3, ramp, Vec3 } from "../engine/math";
import { SC } from "../config";
import { REL } from "../world/layout";

/** Opening trilogy shares ONE live system: the scenes only change what it shows. */
export const systemState = (frame: number): SysState => {
  const mv = ramp(frame, 24, 140, ease.inOut);
  const cPos: Vec3 = lerp3([-840, 0, -40], REL.client, mv);
  const mPos: Vec3 = lerp3([360, 0, 170], REL.mediator, mv);
  const hot = ramp(frame, 124, 150, ease.out);

  const cm: any[] = [
    { f0: 112, dur: 46 },
    { f0: 152, dur: 38, dir: -1 },
    { f0: 128, dur: 40, color: C.pink, r: 6.5 },
    { f0: 176, dur: 34 },
  ];
  const mi: any[] = [];
  // S2/S3: information moves client → mediator → insurer and back
  for (let k = 0; k < 12; k++) {
    const b = 296 + k * 92;
    cm.push({ f0: b, dur: 38 }, { f0: b + 70, dur: 38, dir: -1 });
    mi.push({ f0: b + 24, dur: 38 }, { f0: b + 48, dur: 38, dir: -1 });
  }
  const pk = (f0: number) => loop(f0, 1200, 78, 40, 1, undefined, 6.5);
  return {
    a: {
      c: ramp(frame, 20, 58), m: ramp(frame, 36, 76), i: ramp(frame, 238, 300),
      agent: ramp(frame, 392, 470), plane: ramp(frame, 392, 436),
    },
    draw: {
      cm: ramp(frame, 78, 128), mi: ramp(frame, 262, 304),
      ac: ramp(frame, 458, 492), am: ramp(frame, 468, 502), ai: ramp(frame, 478, 512),
    },
    cPos, mPos, hot,
    packets: {
      cm, mi,
      ac: pk(520), am: loop(508, 1200, 78, 40, -1, undefined, 6.5), ai: pk(548),
    },
    pulse: {
      c: ramp(frame, 318, 366), m: ramp(frame, 332, 380), i: ramp(frame, 346, 394),
    },
  };
};

export const Act1: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > SC.s06[1] + 10) return null;
  const st = systemState(frame);
  const key = (f: number) => ({
    dyn: () => ({
      color: `color-mix(in srgb, ${C.ink} ${ramp(frame, f, f + 18) * 100}%, ${C.text3})`,
      fontWeight: 500,
    }),
  });
  const bokeh = 0; // (gray bokeh read as smudges on the square frame)
  return (
    <>
      <System {...st} />
      {bokeh > 0.01 && (
        <Layer blur={8} opacity={bokeh * 0.55}>
          {[[-260, 330], [120, 260], [380, 380], [700, 300]].map(([x, y], i) => (
            <Dot3 key={i} p={[x, y, -1150 + i * 40]} r={14 + i * 3} fill={C.g500} />
          ))}
        </Layer>
      )}

      {/* S01 — conversation: the word is the hero, the actors sit below it */}
      <Screen style={{ left: 80, top: 150 }}>
        <TextBlock
          start={100} exit={SC.s01[1] - 14} size={84} track={-0.025} lead={1.04}
          lines={[
            [{ t: "El seguro siempre", color: C.text2 }],
            [{ t: "ha sido una", color: C.text2 }],
            [{ t: "conversación.", w: WEIGHT.medium, size: 1.78 }],
          ]}
        />
      </Screen>

      {/* S02 — three actors (type below, system above) */}
      <Screen style={{ left: 80, top: 640 }}>
        <TextBlock
          start={302} exit={SC.s02[1] + 8} size={100} track={-0.03} lead={1.06} stagger={7}
          weight={WEIGHT.light}
          lines={[
            [{ t: "Entre un " }, { t: "cliente", ...key(318) }, { t: ", su" }],
            [{ t: "mediador", ...key(332) }, { t: " y su" }],
            [{ t: "aseguradora", ...key(346) }, { t: "." }],
          ].map((l) => l.map((s) => ({ color: C.text3, ...s })))}
        />
      </Screen>

      {/* S03 — agents join */}
      <Screen style={{ left: 80, top: 150 }}>
        <TextBlock
          start={436} exit={SC.s03[1] - 18} size={66} track={-0.02} lead={1.1} stagger={9}
          lines={[
            [{ t: "Muy pronto, en esa conversación", color: C.text2 }],
            [{ t: "participarán también sus", color: C.text2 }],
            [{ t: "agentes de IA.", w: WEIGHT.medium, color: C.pink, size: 1.9 }],
          ]}
        />
      </Screen>
    </>
  );
};
