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
    <SceneShell mode="light" seed={3}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <KenBurns
          src="brand/swirl.jpg"
          zoomTo={1.14}
          from={1.02}
          panX={-60}
          panY={-10}
          origin="70% 50%"
          style={{
            position: "absolute",
            right: -340,
            top: -60,
            width: 1200,
            height: 1200,
            objectFit: "cover",
            mixBlendMode: "multiply",
            WebkitMaskImage: "radial-gradient(ellipse 56% 58% at 60% 50%, #000 50%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 56% 58% at 60% 50%, #000 50%, transparent 100%)",
          }}
        />
        <KenBurns
          src="brand/gradient.jpg"
          zoomTo={1.1} panX={0}
          origin="100% 100%"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.85 }}
        />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 90, opacity: logoP, transform: `translateY(${(1 - logoP) * -20}px)` }}>
        <Logo width={250} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130, paddingTop: 60 }}>
        <Eyebrow mode="light" delay={BEAT * 0.5} style={{ marginBottom: 34 }}>
          Banca · Seguros
        </Eyebrow>
        <MaskLine delay={6} style={{ ...hero, fontSize: 152, color: theme.colors.hero }}>
          Modernizamos
        </MaskLine>
        <MaskLine delay={32} style={{ ...hero, fontSize: 152, color: theme.colors.hero }}>
          y{" "}
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em", fontSize: 178 }}>
            aceleramos
          </span>
        </MaskLine>
        <MaskLine delay={62} style={{ ...hero, fontSize: 100, color: theme.colors.ink, marginTop: 22 }}>
          los servicios financieros
        </MaskLine>
        <DrawLine delay={100} width={420} color={theme.colors.ink} thickness={3} style={{ marginTop: 46 }} />
      </AbsoluteFill>
    </SceneShell>
  );
};
