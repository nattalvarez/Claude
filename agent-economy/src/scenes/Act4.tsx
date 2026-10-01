import React from "react";
import { useCurrentFrame } from "remotion";
import { Layer, Dot3, Poly3, Solid3, octaFaces, ringPts } from "../engine/primitives";
import { Channel } from "../world/Channel";
import { Screen, TextBlock } from "../engine/Text";
import { useCam } from "../engine/camera";
import { Vec3, clamp, lerp, lerp3, ramp, rng } from "../engine/math";
import { C, WEIGHT, ease, pinkA } from "../theme";
import { SC } from "../config";
import { X } from "../world/layout";

const smooth = (t: number) => { const c = clamp(t); return c * c * (3 - 2 * c); };

// ═════════════════════ S07 · el precio — abundance collapses into one line ═════════════════════
const GATE = X.gate;
const STREAKS = Array.from({ length: 92 }, (_, i) => {
  const r = rng(300 + i);
  return { y0: 30 + r() * 470, z0: -260 + r() * 800, v: 16 + r() * 30, L: 80 + r() * 170, ph: r() * 3000, tone: r() };
});
const FORE = Array.from({ length: 7 }, (_, i) => {
  const r = rng(900 + i);
  return { y0: 40 + r() * 380, z0: -760 + r() * 240, v: 40 + r() * 30, L: 260 + r() * 260, ph: r() * 4000 };
});
const funnel = (x: number, y0: number, z0: number): Vec3 => {
  const s = smooth((x - (GATE - 1150)) / 1050);
  return [x, lerp(y0, 250, s * 0.97), lerp(z0, 110, s * 0.96)];
};

const Price: React.FC = () => {
  const f = useCurrentFrame();
  const cam = useCam();
  const t = f - SC.s07[0];
  const vis = ramp(f, 1186, 1206) * (1 - ramp(f, 1290, 1318));
  if (vis <= 0.01) return null;
  const SPAN = 3200, base = cam.x - 1400;
  const mk = (s: typeof STREAKS[number], key: string, w: number, op: number) => {
    const x = base + ((((s.ph + f * s.v - base) % SPAN) + SPAN) % SPAN);
    const head = funnel(x, s.y0, s.z0), tail = funnel(x - s.L, s.y0, s.z0);
    const hot = x > GATE - 260;
    const col = hot ? C.pink : s.tone > 0.7 ? C.ink : s.tone > 0.35 ? C.g500 : C.g400;
    return <Poly3 key={key} pts={[tail, head]} stroke={col} sw={w} opacity={op * vis * (hot ? 0.95 : 0.8)} />;
  };
  return (
    <>
      <Layer>
        {STREAKS.map((s, i) => mk(s, `s${i}`, 1.6 + s.tone * 0.9, 1))}
        <Poly3 pts={[[GATE, 175, 10], [GATE, 175, 210], [GATE, 325, 210], [GATE, 325, 10]]} closed stroke={C.pink} sw={1.2} opacity={0.55 * vis} />
      </Layer>
      <Layer blur={5}>{FORE.map((s, i) => mk(s as any, `f${i}`, 4, 0.55))}</Layer>
    </>
  );
};

// ═════════════════════ S08 · el criterio — one possibility gains weight ═════════════════════
const CR = X.crit;
const COLS = 6, ROWS = 4;
const SEL = { c: 3, r: 1 };
const latPos = (c: number, r: number): Vec3 => [CR - 375 + c * 150, 60, -50 + r * 150];

const Criterio: React.FC = () => {
  const f = useCurrentFrame();
  const selP = latPos(SEL.c, SEL.r);
  const focus = ramp(f, 1344, 1380, ease.inOut);
  const rise = ramp(f, 1352, 1384, ease.inOut);
  const others: React.ReactNode[] = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (c === SEL.c && r === SEL.r) continue;
    const e = ease.out(ramp(f, 1310 + c * 4 + r * 2, 1338 + c * 4 + r * 2));
    const p = latPos(c, r);
    others.push(<Dot3 key={`${c}_${r}`} p={[p[0], p[1] + (1 - e) * 40 - focus * 22, p[2]]} r={17 * e * (1 - 0.25 * focus)} fill={C.g500} opacity={e * (1 - 0.55 * focus)} />);
  }
  const e0 = ease.out(ramp(f, 1310 + SEL.c * 4, 1338 + SEL.c * 4));
  const y = selP[1] + rise * 120;
  const morph = ramp(f, 1366, 1388, ease.inOut);
  return (
    <>
      <Layer blur={focus * 3.2}>{others}</Layer>
      <Layer>
        {rise > 0.01 && <Poly3 pts={[[selP[0], 0, selP[2]], [selP[0], y, selP[2]]]} stroke={C.pink} sw={1.2} opacity={rise * 0.8} />}
        <Poly3 pts={ringPts([selP[0], 0, selP[2]], 40 + focus * 36)} stroke={focus > 0.01 ? C.pink : C.g400} sw={1.2} opacity={e0 * (0.6 + 0.4 * focus)} />
        <Dot3 p={[selP[0], y, selP[2]]} r={17 * e0 * (1 + focus * 1.2) } fill={C.g600} opacity={1 - morph} />
        {morph > 0.01 && <Solid3 faces={octaFaces([selP[0], y, selP[2]], 40, f * 0.02)} lo="#9B9B98" hi="#FAFAF8" opacity={morph} edge={C.pink} edgeW={1.6} />}
      </Layer>
    </>
  );
};

// ═════════════════════ S09 · el dato — scatter becomes structure ═════════════════════
const D = X.data;
const CEN: Vec3[] = [[D - 330, 110, 40], [D + 20, 200, -90], [D + 340, 90, 130]];
const PTS = (() => {
  const r = rng(77);
  const out: { a: Vec3; b: Vec3; k: number }[] = [];
  for (let i = 0; i < 66; i++) {
    const k = i % 3;
    const g = () => (r() + r() + r() - 1.5) * 1.3;
    out.push({
      a: [D - 760 + r() * 1520, 20 + r() * 380, -300 + r() * 700],
      b: [CEN[k][0] + g() * 120, CEN[k][1] + g() * 80, CEN[k][2] + g() * 100],
      k,
    });
  }
  return out;
})();
const EDGES = (() => {
  const e: [number, number][] = [];
  PTS.forEach((p, i) => {
    const near = PTS.map((q, j) => ({ j, d: q.k === p.k && j !== i ? Math.hypot(q.b[0] - p.b[0], q.b[1] - p.b[1], q.b[2] - p.b[2]) : 1e9 }))
      .sort((x, y) => x.d - y.d).slice(0, 2);
    near.forEach((n) => { if (i < n.j || !e.some((x) => x[0] === n.j && x[1] === i)) e.push([i, n.j]); });
  });
  return e;
})();

const Dato: React.FC = () => {
  const f = useCurrentFrame();
  const vis = ramp(f, 1396, 1412) * (1 - ramp(f, 1488, 1506));
  if (vis <= 0.01) return null;
  const pos = PTS.map((p, i) => {
    const t = ease.inOut(ramp(f, 1426 + (i % 11) * 2, 1466 + (i % 11) * 2));
    return lerp3(p.a, p.b, t);
  });
  const edges = ramp(f, 1462, 1490, ease.out);
  return (
    <Layer opacity={vis}>
      {edges > 0.01 && EDGES.map(([i, j], n) => (
        <Poly3 key={n} pts={[pos[i], lerp3(pos[i], pos[j], edges)]} stroke={C.g500} sw={0.9} opacity={0.65} />
      ))}
      {edges > 0.01 && CEN.map((c, i) => (
        <React.Fragment key={i}>
          {CEN.slice(i + 1).map((d, j) => (
            <Poly3 key={j} pts={[c, lerp3(c, d, ramp(f, 1476 + i * 6, 1494 + i * 6))]} stroke={C.pink} sw={1.1} opacity={0.8} />
          ))}
        </React.Fragment>
      ))}
      {PTS.map((p, i) => {
        const settle = ramp(f, 1466, 1490);
        return <Dot3 key={i} p={pos[i]} r={5.5 + settle * 1.5} fill={C.g600} opacity={0.35 + 0.6 * ramp(f, 1400 + (i % 9) * 3, 1420 + (i % 9) * 3)} />;
      })}
      {CEN.map((c, i) => {
        const e = ease.out(ramp(f, 1476 + i * 6, 1496 + i * 6));
        return <Dot3 key={`c${i}`} p={c} r={11 * e} fill={C.pink} />;
      })}
    </Layer>
  );
};

export const Act4: React.FC = () => {
  const f = useCurrentFrame();
  if (f < SC.s07[0] - 20 || f > SC.s11[0] + 20) return null;
  const precio = {
    t: "precio", w: WEIGHT.medium,
    dyn: (fr: number) => {
      const d = ramp(fr, 1236, 1262, ease.inOut);
      return { color: d > 0 ? `color-mix(in srgb, ${C.g400} ${d * 100}%, ${C.ink})` : C.ink, opacity: 1 - d * 0.55 };
    },
  };
  return (
    <>
      <Price />
      <Criterio />
      <Dato />

      <Screen style={{ left: 160, top: 690 }}>
        <TextBlock
          start={1196} exit={SC.s07[1] - 12} size={58} track={-0.02} lead={1.12} stagger={8} color={C.g600}
          lines={[
            "Cuando comparar sea",
            [{ t: "inmediato, el " }, precio],
            "dejará de marcar la",
            "diferencia.",
          ]}
        />
      </Screen>

      <Screen style={{ left: 160, top: 730 }}>
        <TextBlock
          start={1330} exit={SC.s08[1] - 10} size={74} track={-0.025} lead={1.1} stagger={10}
          lines={[
            [{ t: "La diferencia estará en", color: C.g600 }],
            [{ t: "el " , color: C.g600 }, { t: "criterio", w: WEIGHT.medium, color: C.pink }, { t: ".", color: C.g600 }],
          ]}
        />
      </Screen>

      <Screen style={{ left: 160, top: 130 }}>
        <TextBlock
          start={1424} exit={SC.s09[1] - 10} size={74} track={-0.025} lead={1.1} stagger={10}
          lines={[
            [{ t: "La diferencia estará en", color: C.g600 }],
            [{ t: "el " , color: C.g600 }, { t: "dato", w: WEIGHT.medium, color: C.ink }, { t: ".", color: C.g600 }],
          ]}
        />
      </Screen>

      <Screen style={{ left: 160, top: 730 }}>
        <TextBlock
          start={1526} exit={SC.s10[1] - 4} size={74} track={-0.025} lead={1.1} stagger={10}
          lines={[
            [{ t: "La diferencia estará en", color: C.g600 }],
            [{ t: "la " , color: C.g600 }, { t: "confianza", w: WEIGHT.medium, color: C.ink }, { t: ".", color: C.g600 }],
          ]}
        />
      </Screen>
    </>
  );
};
