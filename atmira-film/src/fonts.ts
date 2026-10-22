import { continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("fonts");
const faces: [string, string, FontFaceDescriptors][] = [
  ["Instrument Sans", "fonts/InstrumentSans-normal-400.woff2", { weight: "400 700", style: "normal" }],
  ["Instrument Serif", "fonts/InstrumentSerif-italic-400.woff2", { weight: "400", style: "italic" }],
  ["Instrument Serif", "fonts/InstrumentSerif-normal-400.woff2", { weight: "400", style: "normal" }],
  ["JetBrains Mono", "fonts/JetBrainsMono-normal-500.woff2", { weight: "400 800", style: "normal" }],
];
Promise.all(
  faces.map(([family, file, desc]) =>
    new FontFace(family, `url(${staticFile(file)})`, desc).load().then((f) => (document.fonts as unknown as { add(f: FontFace): void }).add(f)),
  ),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error("font load failed", e);
    continueRender(handle);
  });
