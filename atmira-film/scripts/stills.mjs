// Usage: node scripts/stills.mjs <outDir> <sec> [sec...]   — renders stills at global seconds, one bundle.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { mkdirSync } from "node:fs";

const [outDir, ...secs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const common = {
  browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  chromiumOptions: { ignoreCertificateErrors: true, gl: "angle" },
};
const comp = await selectComposition({ serveUrl, id: "AtmiraFilm", ...common });
for (const s of secs) {
  const frame = Math.round(parseFloat(s) * comp.fps);
  const output = path.join(outDir, `f_${String(s).replace(".", "_")}.png`);
  await renderStill({ composition: comp, serveUrl, output, frame, imageFormat: "png", scale: 0.6, ...common });
  console.log("still", s, "→", output);
}
