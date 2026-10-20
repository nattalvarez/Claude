import React, { useLayoutEffect, useRef } from "react";
import { C, H, W } from "../theme";
import { hash } from "../lib/anim";

/**
 * SilkField — motivo gráfico principal del vídeo.
 *
 * Una lámina de líneas finas en 3D real (proyección en perspectiva con cámara propia) que se estrecha
 * en un "nudo" y se abre de nuevo, evocando la textura de hilos magenta de la identidad atmira.
 *  - order 0 → líneas enmarañadas (complejidad); order 1 → peinadas y paralelas (arquitectura).
 *  - Todo es función de (props, tiempo): determinista y apta para render frame a frame.
 */
export type Cam = {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  roll?: number;
};

export type SilkProps = {
  /** segundos de fase de flujo (el campo "respira" con este valor) */
  time: number;
  seed?: number;
  lines?: number;
  order?: number;
  twist?: number;
  amp?: number;
  /** 0 = lámina plana de ancho constante, 1 = se cierra del todo en el nudo */
  pinch?: number;
  /** posición del nudo a lo largo de la lámina (0..1) */
  pinchAt?: number;
  spread?: number;
  length?: number;
  cam?: Cam;
  palette?: "brand" | "mono" | "dark" | "ghost";
  lineWidth?: number;
  alpha?: number;
  /** nº de bandas translúcidas entre líneas (volumen) */
  fills?: number;
  /** blur (px) para las líneas más cercanas a cámara: profundidad de campo */
  blurNear?: number;
  /** 0..1 cuánto de la lámina se dibuja (de principio a fin) */
  draw?: number;
  /** 0..1 desplazamiento del inicio visible (para "barrer" la lámina) */
  drawFrom?: number;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
};

const PALETTES: Record<string, { c: string; w: number }[]> = {
  brand: [
    { c: "225,3,122", w: 0.52 },
    { c: "143,1,82", w: 0.12 },
    { c: "240,120,180", w: 0.12 },
    { c: "43,43,48", w: 0.1 },
    { c: "150,149,158", w: 0.14 },
  ],
  mono: [
    { c: "225,3,122", w: 0.3 },
    { c: "43,43,48", w: 0.3 },
    { c: "150,149,158", w: 0.4 },
  ],
  dark: [
    { c: "255,77,166", w: 0.38 },
    { c: "225,3,122", w: 0.3 },
    { c: "255,255,255", w: 0.2 },
    { c: "255,170,214", w: 0.12 },
  ],
  ghost: [
    { c: "225,3,122", w: 0.4 },
    { c: "150,149,158", w: 0.6 },
  ],
};

const pick = (pal: { c: string; w: number }[], r: number) => {
  let acc = 0;
  for (const p of pal) {
    acc += p.w;
    if (r <= acc) return p.c;
  }
  return pal[pal.length - 1].c;
};

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const DEFAULT_CAM: Cam = { pos: [0, 0.6, -15], target: [0, 0, 0], fov: 38 };

export const SilkField: React.FC<SilkProps> = ({
  time,
  seed = 1,
  lines = 120,
  order = 1,
  twist = 0.9,
  amp = 1.1,
  pinch = 0.85,
  pinchAt = 0.5,
  spread = 3.4,
  length = 22,
  cam = DEFAULT_CAM,
  palette = "brand",
  lineWidth = 1.25,
  alpha = 0.9,
  fills = 10,
  blurNear = 2.4,
  draw = 1,
  drawFrom = 0,
  style,
  width = W,
  height = H,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const pal = PALETTES[palette];
    const N = lines;
    const M = 72;
    const near = 0.4;

    // base de cámara
    const f = norm(sub(cam.target, cam.pos));
    let right = norm(cross(f, [0, 1, 0]));
    let up = cross(right, f);
    if (cam.roll) {
      const cr = Math.cos(cam.roll);
      const sr = Math.sin(cam.roll);
      const r2: V3 = [
        right[0] * cr + up[0] * sr,
        right[1] * cr + up[1] * sr,
        right[2] * cr + up[2] * sr,
      ];
      const u2: V3 = [
        -right[0] * sr + up[0] * cr,
        -right[1] * sr + up[1] * cr,
        -right[2] * sr + up[2] * cr,
      ];
      right = r2;
      up = u2;
    }
    const focal = height / 2 / Math.tan(((cam.fov * Math.PI) / 180) / 2);

    const dis = 1 - order;

    type Line = { x: Float32Array; y: Float32Array; z: Float32Array; ok: Uint8Array; depth: number; i: number };
    const all: Line[] = [];

    for (let i = 0; i < N; i++) {
      const v = (i / (N - 1)) * 2 - 1;
      const px = new Float32Array(M);
      const py = new Float32Array(M);
      const pz = new Float32Array(M);
      const ok = new Uint8Array(M);
      let dsum = 0;
      let dn = 0;
      const si = i + seed * 97.13;
      for (let k = 0; k < M; k++) {
        const u = k / (M - 1);
        if (u < drawFrom || u > draw) {
          ok[k] = 0;
          continue;
        }
        // geometría base de la lámina
        const d = u - pinchAt;
        const w = spread * (1 - pinch * Math.exp(-(d * d) / (2 * 0.11 * 0.11)));
        const wave =
          amp * Math.sin(Math.PI * 2 * (u * 1.05 + time * 0.055) + 0.9 * v) +
          amp * 0.38 * Math.sin(Math.PI * 2 * (u * 2.4 - time * 0.04) + 2.1 * v);
        let x = (u - 0.5) * length;
        let y = wave;
        let z = v * w;
        // torsión alrededor del eje de la lámina
        const th = twist * (u - 0.5) + 0.35 * Math.sin(time * 0.1 + v * 1.3) * (1 - 0.5 * order);
        const ct = Math.cos(th);
        const st = Math.sin(th);
        const y2 = y * ct - z * st;
        const z2 = y * st + z * ct;
        y = y2;
        z = z2;
        // desorden suave (enmarañado) ligado a cada línea
        if (dis > 0.001) {
          const n1 = Math.sin(si * 12.9898 + u * 5.3 + time * 0.31);
          const n2 = Math.sin(si * 78.233 + u * 8.1 - time * 0.23);
          const n3 = Math.sin(si * 37.719 + u * 3.7 + time * 0.17);
          x += n3 * dis * 0.9;
          y += (n1 * 0.6 + n2 * 0.4) * dis * amp * 2.4;
          z += (n2 * 0.6 - n3 * 0.4) * dis * amp * 2.6;
        }
        // proyección
        const rel: V3 = [x - cam.pos[0], y - cam.pos[1], z - cam.pos[2]];
        const cx = dot(rel, right);
        const cy = dot(rel, up);
        const cz = dot(rel, f);
        if (cz < near) {
          ok[k] = 0;
          continue;
        }
        px[k] = width / 2 + (focal * cx) / cz;
        py[k] = height / 2 - (focal * cy) / cz;
        pz[k] = cz;
        ok[k] = 1;
        dsum += cz;
        dn++;
      }
      if (dn > 3) all.push({ x: px, y: py, z: pz, ok, depth: dsum / dn, i });
    }

    // lejos → cerca
    all.sort((a, b) => b.depth - a.depth);

    const strokeLine = (L: Line, wScale: number, aScale: number) => {
      const col = pick(pal, hash(L.i + seed * 7.7));
      const depthA = Math.min(1, Math.max(0.25, 1.15 - L.depth / 60));
      const lw = lineWidth * wScale * Math.min(2.6, Math.max(0.5, 14 / L.depth + 0.35));
      let started = false;
      let first = -1;
      let last = -1;
      ctx.beginPath();
      for (let k = 0; k < M; k++) {
        if (!L.ok[k]) {
          started = false;
          continue;
        }
        if (first < 0) first = k;
        last = k;
        if (!started) {
          ctx.moveTo(L.x[k], L.y[k]);
          started = true;
        } else ctx.lineTo(L.x[k], L.y[k]);
      }
      if (first < 0 || last <= first) return;
      const g = ctx.createLinearGradient(L.x[first], L.y[first], L.x[last], L.y[last]);
      const a = alpha * aScale * depthA * (0.55 + 0.45 * hash(L.i * 3.1 + seed));
      g.addColorStop(0, `rgba(${col},0)`);
      g.addColorStop(0.18, `rgba(${col},${a})`);
      g.addColorStop(0.82, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    };

    // bandas translúcidas (volumen de seda)
    if (fills > 0 && all.length > 10) {
      const byIndex = [...all].sort((a, b) => a.i - b.i);
      const step = Math.max(3, Math.floor(byIndex.length / (fills + 1)));
      ctx.save();
      for (let s = 0; s < fills; s++) {
        const a = byIndex[Math.min(byIndex.length - 1, s * Math.floor(byIndex.length / fills))];
        const b = byIndex[Math.min(byIndex.length - 1, s * Math.floor(byIndex.length / fills) + step)];
        if (!a || !b) continue;
        const col = pick(pal, hash(a.i * 1.7 + seed));
        ctx.beginPath();
        let st = false;
        for (let k = 0; k < M; k++) {
          if (!a.ok[k]) continue;
          if (!st) {
            ctx.moveTo(a.x[k], a.y[k]);
            st = true;
          } else ctx.lineTo(a.x[k], a.y[k]);
        }
        for (let k = M - 1; k >= 0; k--) {
          if (!b.ok[k]) continue;
          ctx.lineTo(b.x[k], b.y[k]);
        }
        ctx.closePath();
        // la banda se desvanece en los extremos (sin cortes duros mientras se dibuja)
        let f0 = -1;
        let f1 = -1;
        for (let k = 0; k < M; k++) {
          if (a.ok[k]) {
            if (f0 < 0) f0 = k;
            f1 = k;
          }
        }
        if (f0 >= 0 && f1 > f0) {
          const fg = ctx.createLinearGradient(a.x[f0], a.y[f0], a.x[f1], a.y[f1]);
          fg.addColorStop(0, `rgba(${col},0)`);
          fg.addColorStop(0.2, `rgba(${col},${0.055 * alpha})`);
          fg.addColorStop(0.8, `rgba(${col},${0.055 * alpha})`);
          fg.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = fg;
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // líneas: fondo nítido, primer plano con desenfoque (profundidad de campo)
    const nearCut = all.length ? all[Math.floor(all.length * 0.82)].depth : 0;
    for (const L of all) {
      if (L.depth <= nearCut && blurNear > 0) continue;
      strokeLine(L, 1, 1);
    }
    if (blurNear > 0) {
      ctx.save();
      ctx.filter = `blur(${blurNear}px)`;
      for (const L of all) {
        if (L.depth > nearCut) continue;
        strokeLine(L, 2.2, 0.85);
      }
      ctx.restore();
    }
  });

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ position: "absolute", left: 0, top: 0, width, height, ...style }}
    />
  );
};

export const silkColors = C;
