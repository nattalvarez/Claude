import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Mode, MaskLine, SceneShell, Words, ramp, rand, useSpring } from "../components/kit";
import { KenBurns } from "../components/Media";
import { BEAT, theme } from "../theme";

const SLAM = 196;

const shake = (frame: number, hit: number, amp = 14) => {
  const k = frame - hit;
  if (k < 0 || k > 6) return 0;
  return (rand(k + hit) - 0.5) * amp * (1 - k / 6);
};

const Slam: React.FC<{ word: string; at: number; struck?: boolean; strikeAt?: number }> = ({
  word,
  at,
  struck,
  strikeAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.slam });
  const strike = ramp(frame, strikeAt, strikeAt + 8, 0, 100, theme.ease.out);
  const dim = struck ? ramp(frame, strikeAt, strikeAt + 10, 1, 0.3) : 1;
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "0 0 28px", margin: "0 0 -28px" }}>
      <div
        style={{
          transform: `translate(${shake(frame, at)}px, ${interpolate(p, [0, 1], [120, 0])}%) scale(${interpolate(p, [0, 1], [1.12, 1])})`,
          opacity: interpolate(p, [0, 0.25], [0, dim], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (struck ? 1 : 1),
          position: "relative",
          display: "inline-block",
        }}
      >
        {word}
        {struck && (
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "56%",
              height: 18,
              width: `calc(${strike}% + 20px)`,
              background: theme.colors.hero,
              boxShadow: `0 0 40px ${theme.colors.hero}`,
            }}
          />
        )}
      </div>
    </div>
  );
};

const NoTodo: React.FC = () => {
  const frame = useCurrentFrame();
  const out = ramp(frame, 74, 88, 0, 1, theme.ease.in);
  return (
    <SceneShell mode="dark" seed={1} exit={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            gap: 46,
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: SLAM,
            letterSpacing: "-0.045em",
            color: theme.colors.text,
            lineHeight: 1,
            transform: `scale(${1 + out * 0.25}) translateY(${-out * 40}px)`,
            opacity: 1 - out,
            filter: `blur(${out * 14}px)`,
          }}
        >
          <Slam word="No" at={6} />
          <Slam word="hacemos" at={ BEAT + 6 } />
          <Slam word="todo." at={ BEAT * 2 + 6 } struck strikeAt={BEAT * 3 + 8} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const HacemosEsto: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(2, theme.spring.slam);
  const under = ramp(frame, 22, 46, 0, 100, theme.ease.inOut);
  const mode: Mode = "light";
  return (
    <SceneShell mode={mode} seed={2} exit={false}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <KenBurns
          src="brand/gradient.jpg"
          zoomTo={1.12} panX={0}
          origin="100% 100%"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 40 }}>
          <MaskLine delay={2} style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 250, letterSpacing: "-0.05em", color: theme.colors.ink, lineHeight: 1 }}>
            Hacemos
          </MaskLine>
          <div style={{ position: "relative" }}>
            <MaskLine delay={9} style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 330, color: theme.colors.hero, lineHeight: 0.9 }}>
              esto.
            </MaskLine>
            <div
              style={{
                position: "absolute",
                left: 6,
                bottom: 18,
                height: 10,
                width: `${under}%`,
                background: theme.colors.hero,
                opacity: p,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Hook: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={BEAT * 6}>
      <NoTodo />
    </Sequence>
    <Sequence from={BEAT * 6} durationInFrames={BEAT * 6}>
      <HacemosEsto />
    </Sequence>
  </>
);
