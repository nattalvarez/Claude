#!/usr/bin/env node
/**
 * Renderiza fotogramas sueltos para revisión visual (un único bundle para toda la lista).
 *   node scripts/frames.mjs <CompId> <outDir> <frame,frame,...> [scale]
 * Los frames pueden ser globales (n) o "escena:frameLocal" (p. ej. banking:120).
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [comp, outDir, list, scale = "1"] = process.argv.slice(2);
const tl = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/timeline.json"), "utf8"));
fs.mkdirSync(outDir, { recursive: true });
const bundled = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), webpackOverride: (c) => c });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const warned = new Set();
const onBrowserLog = (l) => { if (/cue no encontrada|alignTokens|no encuentro/.test(l.text) && !warned.has(l.text)) { warned.add(l.text); console.log("AVISO:", l.text); } };
const composition = await selectComposition({ serveUrl: bundled, id: comp, browserExecutable, onBrowserLog });
for (const item of list.split(",")) {
  let frame;
  let name;
  if (item.includes(":")) {
    const [sid, f] = item.split(":");
    const sc = tl.scenes.find((s) => s.id === sid);
    frame = sc.start + parseInt(f, 10);
    name = `${sid}_${String(f).padStart(4, "0")}`;
  } else {
    frame = parseInt(item, 10);
    name = `f${String(frame).padStart(6, "0")}`;
  }
  await renderStill({ composition, serveUrl: bundled, output: path.join(outDir, `${name}.png`), frame, browserExecutable, scale: parseFloat(scale), imageFormat: "png", onBrowserLog });
  console.log("ok", name);
}
