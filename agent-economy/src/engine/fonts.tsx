import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// Roboto is bundled with the project (public/fonts) and loaded explicitly, so
// render never silently falls back to a system font.
const FACES = [
  { w: 300, file: "roboto-latin-300-normal.woff2" },
  { w: 400, file: "roboto-latin-400-normal.woff2" },
  { w: 500, file: "roboto-latin-500-normal.woff2" },
  { w: 700, file: "roboto-latin-700-normal.woff2" },
];

export const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Roboto"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(
      FACES.map(async (f) => {
        const face = new FontFace("Roboto", `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
          weight: String(f.w), style: "normal",
        });
        await face.load();
        (document.fonts as any).add(face);
      }),
    )
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        throw new Error("Roboto failed to load: " + e);
      });
  }, [handle]);
  return <>{ready ? children : null}</>;
};
