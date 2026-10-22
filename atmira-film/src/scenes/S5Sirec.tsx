import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Appear, ExitWrap } from "../components/Appear";
import { Eyebrow } from "../components/CueText";
import { AtmiraLogo, SirecLogo, SirecMark } from "../components/Brand";
import { Icon } from "../components/Icons";
import { Grid } from "../components/Grid";
import { lerp, prog, spr } from "../lib/anim";
import { alpha } from "../lib/color";
import { vo } from "../timing";

const c = theme.colors;
const F = theme.fonts;

const whiteCard: React.CSSProperties = {
  background: "#fff", border: `1.5px solid ${c.lineInk}`, borderRadius: 30,
  boxShadow: "0 44px 80px -34px rgba(35,52,86,0.45), 0 2px 0 rgba(255,255,255,0.9) inset",
};
const darkCard: React.CSSProperties = {
  background: `linear-gradient(145deg, ${c.navyMid}, ${c.navy} 62%)`, border: `1.5px solid ${alpha(c.turq, 0.55)}`, borderRadius: 30,
  boxShadow: `0 44px 90px -30px rgba(18,28,50,0.7), 0 0 80px -10px ${alpha(c.turq, 0.35)}`,
};

const Chip: React.FC<{ label: string; at: number; dark?: boolean; hot?: boolean; icon?: boolean }> = ({ label, at, dark, hot, icon }) => {
  const gt = useGT();
  const p = spr(gt, at, theme.spring.bouncy, 2);
  const glow = hot ? Math.max(0, 1 - (gt - at) / 1.0) : 0;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8, height: 50, padding: icon ? "0 20px 0 14px" : "0 20px", borderRadius: 25,
        fontFamily: F.sans, fontWeight: 600, fontSize: 23,
        background: hot ? c.turq : dark ? "rgba(221,231,244,0.12)" : c.ice,
        color: hot ? c.navy : dark ? c.ice : c.navy,
        border: `1.5px solid ${hot ? c.turq : dark ? "rgba(221,231,244,0.28)" : c.lineInk}`,
        boxShadow: hot ? `0 0 ${50 * glow + 14}px ${alpha(c.turq, 0.35 + 0.5 * glow)}` : "none",
        opacity: Math.min(1, p * 1.6), transform: `translateY(${lerp(p, 18, 0)}px) scale(${lerp(p, 0.8, 1)})`,
      }}
    >
      {icon ? <Icon name="check" size={22} stroke={2.6} /> : null}
      {label}
    </div>
  );
};

const Link: React.FC<{ top: number; h: number; at: number; dark?: boolean }> = ({ top, h, at, dark }) => {
  const gt = useGT();
  const p = prog(gt, at, 0.5, theme.ease.out);
  const t = ((gt * 0.7 + top * 0.003) % 1);
  return (
    <div style={{ position: "absolute", left: 1399, top, width: 3, height: h, background: alpha(dark ? c.ice : c.blue, 0.28), transformOrigin: "50% 100%", transform: `scaleY(${p})` }}>
      <div style={{ position: "absolute", left: -4, width: 11, height: 11, borderRadius: 6, background: c.turq, top: `${(1 - t) * 100}%`, boxShadow: `0 0 16px ${c.turq}`, opacity: p }} />
    </div>
  );
};

const Step: React.FC<{ n: string; label: string; at: number; top: number }> = ({ n, label, at, top }) => (
  <Appear at={at} x={-40} y={0} style={{ position: "absolute", left: 124, top, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ width: 66, height: 66, borderRadius: 33, background: c.blue, display: "grid", placeItems: "center", color: "#fff", fontFamily: F.mono, fontWeight: 600, fontSize: 24, boxShadow: `0 14px 30px -10px ${alpha(c.blue, 0.7)}` }}>{n}</div>
    <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 50, letterSpacing: "-0.025em", color: c.navy }}>{label}</div>
  </Appear>
);

const CycleLoop: React.FC = () => {
  const gt = useGT();
  const p = prog(gt, 24.0, 0.8, theme.ease.inOut);
  const spin = ((gt - 24.0) * 0.5) % 1;
  return (
    <svg width={260} height={330} viewBox="0 0 260 330" style={{ position: "absolute", left: 560, top: 676, overflow: "visible" }}>
      <path d="M0 280 C 120 280 120 280 120 240 L 120 80 C 120 40 120 40 0 40" fill="none" stroke={c.turq} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p > 0.98 ? <polygon points="0,40 22,28 22,52" fill={c.turq} /> : null}
      {p > 0.5 ? <circle cx={120} cy={lerp(spin, 240, 80)} r={7} fill={c.navy} opacity={0.8} /> : null}
      <text x={150} y={168} fontFamily={F.mono} fontSize={22} fontWeight={600} letterSpacing={4} fill={c.blue} opacity={p} transform="rotate(0)">CICLO</text>
    </svg>
  );
};

export const S5Sirec: React.FC = () => {
  return (
    <Scene id="s5">
      <SceneStack variant="light" assets={<><Grid ink opacity={0.9} /><WatermarkMark /></>}>
        <ExitWrap>
          <Appear at={21.1} y={-20} blur={0} style={{ position: "absolute", left: 120, top: 84 }}>
            <AtmiraLogo width={190} tint={c.navy} />
          </Appear>
          <Eyebrow text="Plataforma" at={21.25} color={c.blue} style={{ position: "absolute", left: 124, top: 236 }} />
          <Appear at={vo(20.62) } y={30} from={0.88} config={theme.spring.bouncy} blur={14} style={{ position: "absolute", left: 120, top: 292 }}>
            <SirecLogo width={430} />
          </Appear>
          <Step n="01" label="Anticipación" at={22.5} top={676} />
          <Step n="02" label="Seguimiento" at={23.0} top={776} />
          <Step n="03" label="Recobro" at={23.5} top={876} />
          <CycleLoop />

          <Appear at={26.3} y={50} style={{ position: "absolute", left: 1000, top: 104, width: 800, height: 230 }}>
            <div style={{ ...whiteCard, height: "100%", padding: "30px 38px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 62, height: 62, borderRadius: 18, background: c.ice, display: "grid", placeItems: "center", color: c.blue }}><Icon name="spark" size={38} stroke={1.9} /></div>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 50, letterSpacing: "-0.03em", color: c.navy }}>Agentes IA</div>
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 25, color: c.dimInk, margin: "14px 0 20px" }}>Automatización · eficiencia · inteligencia · flexibilidad</div>
              <div style={{ display: "flex", gap: 14 }}>
                <Chip label="OpenAI" at={26.45} />
                <Chip label="Anthropic" at={26.6} />
                <Chip label="Gemini" at={26.75} />
              </div>
            </div>
          </Appear>
          <Link top={334} h={40} at={26.0} />
          <Appear at={25.4} y={20} from={0.8} config={theme.spring.bouncy} style={{ position: "absolute", left: 1275, top: 374, width: 250 }}>
            <div style={{ height: 56, borderRadius: 28, background: c.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: F.mono, fontWeight: 600, fontSize: 24, letterSpacing: "0.14em" }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: c.turq }} />MCP
            </div>
          </Appear>
          <Link top={430} h={40} at={25.5} />
          <Appear at={vo(23.54)} y={60} style={{ position: "absolute", left: 1000, top: 470, width: 800, height: 272 }}>
            <div style={{ ...darkCard, height: "100%", padding: "32px 40px", boxSizing: "border-box" }}>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 58, letterSpacing: "-0.035em", color: "#fff", lineHeight: 1 }}>
                SIREC Agent <span style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 400, color: c.turq, fontSize: 64 }}>Fabric</span>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.16em", color: c.ice, opacity: 0.75, margin: "16px 0 26px", textTransform: "uppercase" }}>Orquestación segura de agentes</div>
              <div style={{ display: "flex", flexWrap: "nowrap", gap: 10 }}>
                <Chip label="Agilidad" at={25.3} dark />
                <Chip label="Escalabilidad" at={25.45} dark />
                <Chip label="Seguridad" at={vo(26.68)} hot icon />
                <Chip label="Cumplimiento" at={vo(27.4)} hot icon />
              </div>
            </div>
          </Appear>
          <Link top={742} h={50} at={25.0} dark />
          <Appear at={22.3} y={50} style={{ position: "absolute", left: 1000, top: 792, width: 800, height: 188 }}>
            <div style={{ ...whiteCard, height: "100%", padding: "28px 38px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ width: 96, height: 96, borderRadius: 26, background: c.ice, display: "grid", placeItems: "center", overflow: "hidden" }}>
                <SirecMark width={92} />
              </div>
              <div>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 54, letterSpacing: "-0.03em", color: c.navy, lineHeight: 1 }}>SIREC</div>
                <div style={{ fontFamily: F.sans, fontSize: 26, color: c.dimInk, marginTop: 10 }}>Plataforma E2E · Orquestación</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontFamily: F.mono, fontSize: 21, fontWeight: 600, letterSpacing: "0.12em", color: c.blue }}>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: c.turq }} />KPIS DE NEGOCIO
                </div>
              </div>
            </div>
          </Appear>
        </ExitWrap>
      </SceneStack>
    </Scene>
  );
};

const WatermarkMark: React.FC = () => {
  const gt = useGT();
  const p = prog(gt, 21.0, 1.2, theme.ease.out);
  return (
    <AbsoluteFill style={{ opacity: 0.075 * p, transform: `translate(${Math.sin(gt * 0.6) * 10}px, ${Math.cos(gt * 0.5) * 12}px)` }}>
      <SirecMark width={1250} style={{ position: "absolute", right: -230, top: -120 }} />
    </AbsoluteFill>
  );
};
