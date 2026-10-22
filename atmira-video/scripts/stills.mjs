// Usage: node scripts/stills.mjs 10,30,60 [prefix]  — bundles once, renders many stills.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const frames = (process.argv[2] ?? "0").split(",").map(Number);
const prefix = process.argv[3] ?? "s";
const browserExecutable =
  process.env.CH ?? fs.readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium_headless_shell")).map((d) => `/opt/pw-browsers/${d}/chrome-linux/headless_shell`)[0];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const comp = await selectComposition({ serveUrl, id: "AtmiraFilm", browserExecutable });
fs.mkdirSync("out/chk", { recursive: true });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `out/chk/${prefix}_${f}.png`, browserExecutable, imageFormat: "png", logLevel: "error" });
}
console.log("done", frames.length);
