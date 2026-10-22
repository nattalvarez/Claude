import { continueRender, delayRender, staticFile } from "remotion";

/** Carga Roboto (variable, normal y cursiva) desde public/fonts: sin red, determinista. Roboto es la única tipografía del vídeo. */
const handle = delayRender("fuentes Roboto");
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";
const faces = [
  { file: "fonts/roboto-latin-wght-normal.woff2", range: LATIN, style: "normal" },
  { file: "fonts/roboto-latin-ext-wght-normal.woff2", range: LATIN_EXT, style: "normal" },
  { file: "fonts/roboto-latin-wght-italic.woff2", range: LATIN, style: "italic" },
];
Promise.all(
  faces.map(async (f) => {
    const face = new FontFace("Roboto Variable", `url(${staticFile(f.file)}) format("woff2")`, {
      weight: "100 900",
      style: f.style,
      unicodeRange: f.range,
    });
    await face.load();
    (document.fonts as unknown as { add(f: FontFace): void }).add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("No se pudo cargar la fuente", e);
    continueRender(handle);
  });
