import React from "react";
import { useCurrentFrame } from "remotion";
import { Layer, Dot3, Poly3, ringPts } from "../engine/primitives";
import { Channel, arcPoint } from "../world/Channel";
import { PlaneText, Screen, TextBlock } from "../engine/Text";
import { project, useCam } from "../engine/camera";
import { Vec3, lerp, lerp3, ramp } from "../engine/math";
import { C, WEIGHT, ease, pinkA } from "../theme";
import { SC } from "../config";
import { X } from "../world/layout";
import { anchorAt } from "../cameraPath";

const G = X.ghost;
type N = { p: Vec3; solid: boolean };
const NODES: N[] = [
  { p: [G - 80, 0, 40], solid: true },
  { p: [G + 160, 0, 220], solid: true },
  { p: [G + 330, 0, 0], solid: false },
  { p: [G + 120, 0, -160], solid: false },
  { p: [G + 540, 0, 160], solid: false },
];
const LINKS: { a: number; b: number; solid: boolean; t0: number }[] = [
  { a: 0, b: 1, solid: true, t0: 936 },
  { a: 1, b: 3, solid: true, t0: 948 },
  { a: 1, b: 2, solid: false, t0: 958 },
  { a: 0, b: 3, solid: false, t0: 966 },
  { a: 2, b: 4, solid: false, t0: 976 },
];
const STUBS: { from: number; to: Vec3; t0: number }[] = [
  { from: 2, to: [G + 470, 0, -210], t0: 984 },
  { from: 4, to: [G + 760, 0, 260], t0: 990 },
];
const up = (p: Vec3, y = 16): Vec3 => [p[0], y, p[2]];

/** Draft: a structure that exists only in part. Solid = agreed, dashed = open. */
const Draft: React.FC = () => {
  const f = useCurrentFrame();
  const C_ANCHOR: Vec3 = [X.C + 200, 110, 40];
  return (
    <>
      <Channel a={C_ANCHOR} b={up(NODES[0].p)} lift={60} draw={ramp(f, 930, 960, ease.inOut)} color={C.g500} sw={1.1} />
      {LINKS.map((l, i) => (
        <Channel key={i} a={up(NODES[l.a].p)} b={up(NODES[l.b].p)} lift={40} draw={ramp(f, l.t0, l.t0 + 26, ease.inOut)}
          color={l.solid ? C.g500 : C.g400} sw={1.1} dash={l.solid ? undefined : "6 7"} />
      ))}
      {STUBS.map((s, i) => {
        const e = ramp(f, s.t0, s.t0 + 28, ease.inOut);
        const end = lerp3(up(NODES[s.from].p), up(s.to), e);
        return (
          <React.Fragment key={i}>
            <Poly3 pts={[up(NODES[s.from].p), end]} stroke={C.g400} sw={1.1} dash="6 7" opacity={0.9} />
            <Poly3 pts={ringPts([s.to[0], 4, s.to[2]], 18 * e, 24)} stroke={C.pink} sw={1.3} opacity={e * 0.9} />
          </React.Fragment>
        );
      })}
      {NODES.map((n, i) => {
        const e = ease.out(ramp(f, 928 + i * 8, 960 + i * 8));
        return (
          <React.Fragment key={i}>
            <Poly3 pts={ringPts([n.p[0], 0, n.p[2]], 44 * e)} stroke={C.g400} sw={1} opacity={0.8 * e} dash={n.solid ? undefined : "4 5"} />
            {n.solid && <Dot3 p={[n.p[0], 18, n.p[2]]} r={16 * e} fill={C.g600} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ── Q1 · ¿Quién entra? — a boundary with an opening, someone waiting at it
const Q1 = X.q1;
const Gate: React.FC = () => {
  const f = useCurrentFrame();
  const c: Vec3 = [Q1 + 130, 0, 90];
  const e = ramp(f, 990, 1020, ease.inOut);
  const pt = (x: number, z: number): Vec3 => [c[0] + x, 0, c[2] + z];
  const walk = ramp(f, 1014, 1050, ease.inOut);
  const waiter: Vec3 = [lerp(Q1 - 330, Q1 - 150, walk), 52 + Math.sin(f / 20) * 4, c[2] + 20];
  const inner: Vec3[] = [pt(-80, -30), pt(60, 70), pt(120, -50)].map((p) => [p[0], 40, p[2]] as Vec3);
  return (
    <>
      <Poly3 pts={[pt(-220, 150), pt(-220, 240), pt(220, 240), pt(220, -60), pt(-220, -60), pt(-220, 20)]} stroke={C.g500} sw={1.2} opacity={e} />
      <Poly3 pts={[pt(-220, 20), pt(-220, 70)]} stroke={C.pink} sw={1.2} dash="3 5" opacity={e} />
      <Poly3 pts={[inner[0], inner[1], inner[2], inner[0]]} stroke={C.g400} sw={1} opacity={e * 0.9} />
      {inner.map((p, i) => <Dot3 key={i} p={p} r={20 * e} fill={C.g600} />)}
      <Poly3 pts={ringPts([c[0] - 90, 0, c[2] + 150], 34 * e, 28)} stroke={C.g500} sw={1.1} dash="4 5" opacity={e} />
      <Poly3 pts={ringPts([waiter[0], 0, waiter[2]], 46 * e)} stroke={C.pink} sw={1} opacity={0.7 * e} />
      <Dot3 p={waiter} r={20 * e} fill={C.pink} />
    </>
  );
};

// ── Q2 · ¿Qué se intercambia? — packets whose content is not defined yet
const Q2 = X.q2;
const Ghost: React.FC<{ p: Vec3; kind: number; rot: number; op: number }> = ({ p, kind, rot, op }) => {
  const cam = useCam();
  const q = project(p, cam);
  if (!q.vis || op <= 0.01) return null;
  const r = 22 * q.s * 1.4;
  const pts = kind === 0 ? 4 : kind === 1 ? 3 : 0;
  return (
    <g transform={`translate(${q.x} ${q.y}) rotate(${rot})`} opacity={op}>
      {pts === 0 ? (
        <circle r={r * 0.9} fill="none" stroke={C.ink} strokeWidth={1.4} strokeDasharray="3 3" />
      ) : (
        <polygon
          points={Array.from({ length: pts }, (_, i) => {
            const a = (i / pts) * Math.PI * 2 + (pts === 4 ? Math.PI / 4 : -Math.PI / 2);
            return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
          }).join(" ")}
          fill="none" stroke={C.ink} strokeWidth={1.4} strokeDasharray="3 3" strokeLinejoin="round"
        />
      )}
    </g>
  );
};
const Exchange: React.FC = () => {
  const f = useCurrentFrame();
  const e = ease.out(ramp(f, 1040, 1066));
  const a: Vec3 = [Q2 - 260, 62, 90], b: Vec3 = [Q2 + 260, 62, 90];
  const items: React.ReactNode[] = [];
  for (let k = 0; k < 4; k++) {
    const t0 = 1066 + k * 22;
    const u = ((f - t0) % 88) / 88;
    if (f < t0) continue;
    const dir = k % 2 === 0 ? 1 : -1;
    const t = dir > 0 ? ease.inOut(u) : 1 - ease.inOut(u);
    const op = Math.min(1, u * 8, (1 - u) * 8);
    items.push(<Ghost key={k} p={arcPoint(a, b, 70, t)} kind={k % 3} rot={f * (1.2 + k * 0.4)} op={op} />);
  }
  return (
    <>
      <Poly3 pts={ringPts([a[0], 0, a[2]], 58 * e)} stroke={C.g400} sw={1} opacity={0.8 * e} />
      <Poly3 pts={ringPts([b[0], 0, b[2]], 58 * e)} stroke={C.g400} sw={1} opacity={0.8 * e} />
      <Channel a={a} b={b} lift={70} draw={ramp(f, 1046, 1076, ease.inOut)} color={C.g500} sw={1.1} />
      <Dot3 p={a} r={20 * e} fill={C.g600} />
      <Dot3 p={b} r={20 * e} fill={C.g600} />
      {items}
    </>
  );
};

// ── Q3 · ¿Quién cobra? — one decision floating between three open sockets
const Q3 = X.q3;
const Sockets: React.FC = () => {
  const f = useCurrentFrame();
  const e = ease.out(ramp(f, 1090, 1118));
  const S: Vec3[] = [[Q3 - 170, 0, -50], [Q3 + 170, 0, -50], [Q3, 0, 220]];
  const c: Vec3 = [Q3, 120, 70];
  const w = f / 38;
  const pos: Vec3 = [c[0] + Math.sin(w) * 90, c[1] + Math.sin(w * 1.7) * 18, c[2] + Math.cos(w * 0.8) * 80];
  return (
    <>
      {S.map((s, i) => (
        <React.Fragment key={i}>
          <Poly3 pts={ringPts(s, 42 * e)} stroke={C.g500} sw={1.2} opacity={e} />
          <Poly3 pts={ringPts(s, 14 * e, 20)} stroke={C.g400} sw={1} opacity={e} />
          <Poly3 pts={[[pos[0], pos[1], pos[2]], [s[0], 4, s[2]]]} stroke={C.pink} sw={1} dash="4 6" opacity={0.55 * e} />
        </React.Fragment>
      ))}
      <Poly3 pts={ringPts([pos[0], 0, pos[2]], 40 * e)} stroke={C.pink} sw={1} opacity={0.5 * e} />
      <Dot3 p={pos} r={21 * e} fill={C.pink} />
    </>
  );
};

const AGENT_T = anchorAt(880, 190, 560, 2700);

export const Act3: React.FC = () => {
  const f = useCurrentFrame();
  if (f < SC.s05[0] - 10 || f > SC.s07[0] + 30) return null;
  const Qpos = {
    q1: anchorAt(1048, 190, 330, 1500),
    q2: anchorAt(1102, 190, 780, 1500),
    q3: anchorAt(1160, 190, 330, 1500),
  };
  return (
    <>
      <Layer>
        <Draft />
        <Gate />
        <Exchange />
        <Sockets />
      </Layer>

      {/* S05 — the name */}
      <Screen style={{ left: 80, top: 178 }}>
        <TextBlock start={852} exit={912} size={212} weight={WEIGHT.light} track={-0.045} lead={0.96} stagger={10} dur={36}
          lines={[[{ t: "Agent", color: C.ink }], [{ t: "Economy", color: C.ink }, { t: ".", color: C.pink, w: WEIGHT.medium }]]} />
      </Screen>

      {/* S06 — header + three open questions, each at its own scale */}
      <Screen style={{ left: 80, top: 150 }}>
        <TextBlock start={938} exit={SC.s06[1] - 8} size={56} weight={WEIGHT.light} track={-0.02} color={C.text2}
          lines={["Con reglas todavía por escribir."]} />
      </Screen>
      <Screen style={{ left: 80, top: 250 }}>
        <TextBlock start={1018} exit={1052} size={150} weight={WEIGHT.regular} track={-0.04} lead={1} lines={["¿Quién entra?"]} />
      </Screen>
      <Screen style={{ left: 80, top: 290 }}>
        <TextBlock start={1072} exit={1102} size={100} weight={WEIGHT.regular} track={-0.035} lead={1} lines={["¿Qué se intercambia?"]} />
      </Screen>
      <Screen style={{ left: 80, top: 250 }}>
        <TextBlock start={1124} exit={SC.s06[1] - 14} size={150} weight={WEIGHT.regular} track={-0.04} lead={1} lines={["¿Quién cobra?"]} />
      </Screen>
    </>
  );
};
