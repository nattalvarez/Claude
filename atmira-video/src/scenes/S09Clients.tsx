import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BEAT, theme } from "../theme";
import { Counter, Pop, SceneShell, Words, ramp } from "../components/kit";
import wall from "../logoWall.json";

type L = { f: string; x: number; y: number; w: number; h: number };
const logos = wall as L[];
const SX = 1.98;
const minX = Math.min(...logos.map((l) => l.x));
const maxX = Math.max(...logos.map((l) => l.x + l.w));
const minY = Math.min(...logos.map((l) => l.y));
const maxY = Math.max(...logos.map((l) => l.y + l.h));
const PW = (maxX - minX) * SX;
const OX = (1920 - PW) / 2;
const OY = 300;

export const Clients: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = ramp(frame, BEAT * 5, BEAT * 5 + 40, -0.1, 1.2, theme.ease.inOut);
  const panel = ramp(frame, 6, 22, 0, 1);
  return (
    <SceneShell mode="light" seed={50}>
      <div style={{ position: "absolute", left: 130, top: 70 }}>
        <Words text="Relaciones duraderas con *nuestros clientes*" size={72} mode="light" per={2.5} maxWidth={1100} lineHeight={1.02} />
      </div>
      <Pop delay={14} from="right" style={{ position: "absolute", right: 130, top: 66 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.055em", color: theme.colors.hero, lineHeight: 1 }}>
            +<Counter to={40} delay={14} />
          </span>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 34, color: theme.colors.ink, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            clientes
            <br />
            activos
          </span>
        </div>
      </Pop>
      <div
        style={{
          position: "absolute",
          left: OX - 50,
          top: OY - 44,
          width: PW + 100,
          height: (maxY - minY) * SX + 88,
          borderRadius: 34,
          background: "#fff",
          boxShadow: "0 40px 100px -40px rgba(230,0,126,0.4), 0 0 0 1.5px rgba(17,17,17,0.07)",
          opacity: panel,
          transform: `translateY(${(1 - panel) * 30}px)`,
          overflow: "hidden",
        }}
      />
      {logos.map((l, i) => {
        const wave = (l.x - minX) * 0.07 + (l.y - minY) * 0.05;
        const p = ramp(frame, 8 + wave, 8 + wave + 12, 0, 1);
        const cx = (l.x - minX) / (maxX - minX);
        const hot = Math.max(0, 1 - Math.abs(cx - shine) * 9);
        return (
          <Img
            key={i}
            src={staticFile(l.f)}
            style={{
              position: "absolute",
              left: OX + (l.x - minX) * SX,
              top: OY + (l.y - minY) * SX,
              width: l.w * SX,
              height: l.h * SX,
              objectFit: "contain",
              opacity: p,
              transform: `translateY(${(1 - p) * 14}px) scale(${interpolate(p, [0, 1], [0.8, 1]) + hot * 0.18})`,
              filter: hot > 0.05 ? `drop-shadow(0 0 ${hot * 14}px rgba(230,0,126,${hot * 0.6}))` : undefined,
            }}
          />
        );
      })}
    </SceneShell>
  );
};
