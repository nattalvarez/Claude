import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { FPS, SHOTS } from "../timing";
import { prog } from "../lib/anim";

const c = theme.colors;
const FADE = 0.7; // cross-dissolve between shots

type Grade = { tint: number; dark: number; scrim?: number; scrimBottom?: number; bloom?: number; sat?: number; contrast?: number; bright?: number; zoom?: [number, number]; origin?: string };
// real stock footage graded gently toward the brand blue: keep the natural water colours, unify the look
const G: Record<string, Grade> = {
  s01_light_rays: { tint: 0.1, dark: 0.12, bloom: 0.0, zoom: [1.0, 1.1] },
  s02_river_rocks: { tint: 0.2, dark: 0.2, scrim: 0.55, sat: 1.0, bloom: 0.12, zoom: [1.1, 1.0] },
  s03_rain_ripples: { tint: 0.25, dark: 0.22, scrim: 0.5, sat: 1.0, bloom: 0.1, zoom: [1.0, 1.1] },
  s04_river_aerial: { tint: 0.2, dark: 0.15, sat: 1.05, bloom: 0.12, zoom: [1.06, 1.0] },
  s05_wave_crash: { tint: 0.25, dark: 0.42, scrim: 0.65, zoom: [1.0, 1.1] },
  s06_horizon: { tint: 0.3, dark: 0.15, scrim: 0.5, bloom: 0.1, zoom: [1.0, 1.08] },
  s07_dolphins: { tint: 0.12, dark: 0.1, scrim: 0.45, sat: 1.05, bloom: 0.1, zoom: [1.08, 1.0] },
  s08_wave_sand: { tint: 0.25, dark: 0.18, scrim: 0.5, bloom: 0.12, zoom: [1.0, 1.08] },
  s09_fish_school: { tint: 0.08, dark: 0.18, scrimBottom: 0.55, sat: 1.05, zoom: [1.0, 1.1] },
  s10_jellyfish: { tint: 0.05, dark: 0.12, scrimBottom: 0.5, zoom: [1.1, 1.0] },
  s11_ocean_aerial: { tint: 0.12, dark: 0.1, scrim: 0.55, bright: 1.1, sat: 1.15, bloom: 0.1, zoom: [1.0, 1.08] },
  s12_sunrise: { tint: 0.1, dark: 0.04, bright: 1.06, bloom: 0.1, zoom: [1.1, 1.0], origin: "70% 50%" },
};

const Shot: React.FC<{ src: string; dur: number; first: boolean }> = ({ src, dur, first }) => {
  const f = useCurrentFrame();
  const g = G[src.replace(".mp4", "")] ?? { tint: 0.3, dark: 0.3 };
  const z = interpolate(f, [0, dur * FPS], g.zoom ?? [1, 1.08], { easing: theme.ease.soft, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = first ? 1 : prog(f / FPS, 0, FADE, theme.ease.soft);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`footage/${src}`)}
        muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: g.origin ?? "50% 50%", filter: `saturate(${g.sat ?? 1}) contrast(${g.contrast ?? 1.05}) brightness(${g.bright ?? 0.96})` }}
      />
      <AbsoluteFill style={{ background: c.blue, mixBlendMode: "color", opacity: g.tint }} />
      <AbsoluteFill style={{ background: c.navyDeep, opacity: g.dark }} />
      {g.bloom ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 60% 20%, ${c.turq}, transparent 70%)`, mixBlendMode: "screen", opacity: g.bloom }} /> : null}
      {g.scrimBottom ? <AbsoluteFill style={{ background: `linear-gradient(0deg, ${c.navyDeep}${Math.round(g.scrimBottom * 255).toString(16).padStart(2, "0")} 0%, ${c.navyDeep}00 45%)` }} /> : null}
      {g.scrim ? <AbsoluteFill style={{ background: `linear-gradient(95deg, ${c.navyDeep}${Math.round(g.scrim * 255).toString(16).padStart(2, "0")} 0%, ${c.navyDeep}00 64%)` }} /> : null}
    </AbsoluteFill>
  );
};

/** The picture track: every shot cross-dissolves over the previous one (which keeps running underneath). */
export const ShotTrack: React.FC = () => (
  <AbsoluteFill style={{ background: c.navyDeep }}>
    {SHOTS.map((s, i) => {
      const lead = i === 0 ? 0 : FADE;
      const dur = s.to - s.from + lead + FADE;
      return (
        <Sequence key={s.src} from={Math.round((s.from - lead) * FPS)} durationInFrames={Math.round(dur * FPS)} name={s.src}>
          <Shot src={s.src} dur={dur} first={i === 0} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
