// Bundle once, render many stills:  node scripts/stills.mjs 100 250 400
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const frames = process.argv.slice(2).map(Number);
const entry = path.resolve("src/index.ts");
const bundled = await bundle({ entryPoint: entry, publicDir: path.resolve("public") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const comp = await selectComposition({ serveUrl: bundled, id: "AgentEconomy", browserExecutable });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl: bundled, frame: f, output: `out/f_${String(f).padStart(4, "0")}.png`, browserExecutable, imageFormat: "png" });
  console.log("frame", f);
}
