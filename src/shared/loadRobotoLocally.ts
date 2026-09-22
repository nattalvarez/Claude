import { staticFile, delayRender, continueRender } from "remotion";

// Roboto v51 ships as a single variable-weight file per subset on Google
// Fonts, so one bundled file per subset covers every static weight we ask
// for. Loading it from `public/fonts` instead of fetching it live from
// fonts.gstatic.com on every render avoids a network round-trip (and any
// render-time network flakiness) entirely — the rendered glyphs are
// identical either way.
const SUBSETS: Record<string, { file: string; unicodeRange: string }> = {
  latin: {
    file: "fonts/roboto-latin-variable.woff2",
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  },
  "latin-ext": {
    file: "fonts/roboto-latin-ext-variable.woff2",
    unicodeRange:
      "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  },
};

let loaded = false;

export const loadRobotoLocally = (subsets: Array<keyof typeof SUBSETS> = ["latin", "latin-ext"]) => {
  if (loaded || typeof FontFace === "undefined") return;
  loaded = true;

  for (const subset of subsets) {
    const { file, unicodeRange } = SUBSETS[subset];
    const handle = delayRender(`Loading local Roboto font (${subset})`);
    const face = new FontFace("Roboto", `url(${staticFile(file)}) format('woff2')`, {
      weight: "100 900",
      style: "normal",
      unicodeRange,
    });
    face
      .load()
      .then(() => {
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }
};
