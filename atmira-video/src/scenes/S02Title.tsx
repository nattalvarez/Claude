import { Footage } from "../components/Footage";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Eyebrow, Logo, MaskLine, Pop, SceneShell, DrawLine, useSpring } from "../components/kit";
import { KenBurns } from "../components/Media";
import { BEAT, theme } from "../theme";

const Chip: React.FC<{ label: string; delay: number }> = ({ label, delay }) => (
  <Pop delay={delay} from="left" dist={50}>
    <div
      style={{
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "16px 30px",
        border: `2px solid ${theme.colors.ink}`,
        borderRadius: 100,
        color: theme.colors.ink,
      }}
    >
      {label}
    </div>
  </Pop>
);

export const Title: React.FC = () => {
  const logoP = useSpring(4, theme.spring.smooth);
  const hero = { fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 } as const;
  return (
    <SceneShell mode="dark" seed={3} footage={<Footage id="4170" tone="dark" scrim="left" zoom={1.12} />}>
      <div style={{ position: "absolute", left: 130, top: 90, opacity: logoP, transform: `translateY(${(1 - logoP) * -20}px)` }}>
        <Logo width={250} tint="white" />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130, paddingTop: 60 }}>
        <Eyebrow delay={BEAT * 0.5} style={{ marginBottom: 34 }}>
          Banca · Seguros
        </Eyebrow>
        <MaskLine delay={6} style={{ ...hero, fontSize: 152, color: "#fff" }}>
          Modernizamos
        </MaskLine>
        <MaskLine delay={32} style={{ ...hero, fontSize: 152, color: "#fff" }}>
          y{" "}
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em", fontSize: 178, color: theme.colors.hero, textShadow: "0 0 50px rgba(230,0,126,0.55)" }}>
            aceleramos
          </span>
        </MaskLine>
        <MaskLine delay={62} style={{ ...hero, fontSize: 100, color: "#fff", marginTop: 22 }}>
          los servicios financieros
        </MaskLine>
        <DrawLine delay={100} width={420} color="#fff" thickness={3} style={{ marginTop: 46 }} />
      </AbsoluteFill>
    </SceneShell>
  );
};
