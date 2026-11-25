#!/usr/bin/env node
// Contact sheet: node sheet.mjs <scene id | file.ts> [--id x] [--out sheet.png] [--n 9] [--from 0] [--to loop] [--size 960x600] [--dpr 1] [--cols 3] [--tile 640] [--at t] [--assets public]
// --n 1 gives one full-size frame (poster time, or --at). --assets is the folder that "/photo.jpg" resolves in; default is the scene file's folder.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { args, withScene, frame } from "./lib.mjs";
const a = args(); const scene = a._[0];
if (!scene) { console.error("usage: node sheet.mjs <scene id | file.ts> [--out sheet.png] [--n 9] [--size WxH]"); process.exit(1); }
const [width, height] = (a.size ?? "960x600").split("x").map(Number);
const n = Number(a.n ?? 9), cols = Number(a.cols ?? Math.ceil(Math.sqrt(n))), out = a.out ?? "sheet.png";
mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const isFile = /\.tsx?$/.test(scene);
await withScene({ scene, id: a.id ?? (isFile ? undefined : scene), width, height, dpr: Number(a.dpr ?? 1), assets: a.assets }, async (page, info) => {
  const from = Number(a.from ?? 0), to = Number(a.to ?? info.loop), dir = mkdtempSync(path.join(tmpdir(), "sheet-"));
  let t = from;
  for (let i = 0; i < n; i++) {
    const target = n === 1 ? Number(a.at ?? info.poster) : from + ((to - from) * i) / n;
    // Walk up to the frame so glitch-in history is right.
    if (n > 1) for (; t < target; t += 1 / 30) await page.evaluate((t) => window.__r.render(t), t);
    writeFileSync(path.join(dir, `f_${String(i).padStart(3, "0")}.png`), await frame(page, target)); t = target;
  }
  if (n === 1) execFileSync("cp", [path.join(dir, "f_000.png"), out]);
  else execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(dir, "f_%03d.png"), "-vf", `scale=${Math.round(Number(a.tile ?? 640))}:-1:flags=lanczos,tile=${cols}x${Math.ceil(n / cols)}`, "-frames:v", "1", out]);
  rmSync(dir, { recursive: true });
  console.log(`${info.id}: grid ${info.grid.cols}x${info.grid.rows}, loop ${info.loop}s, ${info.gpu} -> ${out}`);
});
