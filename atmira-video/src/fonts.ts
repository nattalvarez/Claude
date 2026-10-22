import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, string, FontFaceDescriptors][] = [
  ["Bricolage", "fonts/bricolage.woff2", { weight: "200 800", style: "normal" }],
  ["Instrument Serif", "fonts/instrument.woff2", { weight: "400", style: "normal" }],
  ["Instrument Serif", "fonts/instrument-italic.woff2", { weight: "400", style: "italic" }],
  ["Inter", "fonts/inter.woff2", { weight: "100 900", style: "normal" }],
];

export const loadFonts = () => {
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(async ([family, file, desc]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, desc);
      await f.load();
      (document.fonts as unknown as { add(f: FontFace): void }).add(f);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
