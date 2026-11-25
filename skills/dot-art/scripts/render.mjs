#!/usr/bin/env node
// Export a seamless loop: node render.mjs <scene id | file.ts> --out x.gif|.mp4|.webm|.webp|.png
//   [--id x] [--size 800x500] [--dpr 1] [--fps 20] [--from 0] [--to loop] [--speed 1] [--colors 128] [--dither none] [--max-mb 8] [--at t] [--frames dir] [--assets public]
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, statSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { args, withScene, frame } from "./lib.mjs";

const a = args(), scene = a._[0];
if (!scene || !a.out && !a.frames) { console.error("usage: node render.mjs <scene id | file.ts> --out loop.gif [--size 800x500] [--fps 20] [--max-mb 8]"); process.exit(1); }
const [width, height] = (a.size ?? "800x500").split("x").map(Number);
const out = a.out && path.resolve(a.out), ext = out ? path.extname(out).slice(1).toLowerCase() : "frames";
const isFile = /\.tsx?$/.test(scene), speed = Number(a.speed ?? 1), dpr = Number(a.dpr ?? (ext === "gif" || ext === "webp" ? 1 : 2));
const fps = Number(a.fps ?? (ext === "mp4" || ext === "webm" ? 60 : 20));
if (out) mkdirSync(path.dirname(out), { recursive: true });
const ff = (...x) => execFileSync("ffmpeg", ["-v", "error", "-y", ...x.map(String)]);

await withScene({ scene, id: a.id ?? (isFile ? undefined : scene), width, height, dpr, assets: a.assets }, async (page, info) => {
  if (ext === "png") { writeFileSync(out, await frame(page, Number(a.at ?? info.poster))); return console.log(`${info.id} -> ${out}`); }
  const from = Number(a.from ?? 0), to = Number(a.to ?? info.loop), n = Math.max(1, Math.round(((to - from) / speed) * fps));
  const dir = a.frames ? path.resolve(a.frames) : mkdtempSync(path.join(tmpdir(), "dot-render-")); mkdirSync(dir, { recursive: true });
  // Pre-roll so letters that scramble in at the loop point have the right history.
  for (let t = from - 1; t < from; t += 1 / 30) await page.evaluate((t) => window.__r.render(t), t);
  for (let i = 0; i < n; i++) writeFileSync(path.join(dir, `f_${String(i).padStart(5, "0")}.png`), await frame(page, from + ((to - from) * i) / n));
  if (!out) return console.log(`${n} frames -> ${dir}`);
  const src = ["-framerate", fps, "-i", path.join(dir, "f_%05d.png")];
  // Frame count must stay a divisor-friendly subset so the loop never hiccups: dropping frames uses a select filter on the same pass.
  const encode = ({ keep = 1, colors = Number(a.colors ?? 160), scale = 1 }) => {
    const pre = [keep > 1 ? `select='not(mod(n,${keep}))',setpts=N/(${fps / keep}*TB)` : "", scale < 1 ? `scale=trunc(iw*${scale}/2)*2:-2:flags=area` : ""].filter(Boolean).join(",");
    const p = pre ? pre + "," : "";
    if (ext === "gif") ff(...src, "-vf", `${p}split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=full[p];[b][p]paletteuse=dither=${a.dither === "none" ? "none" : "bayer:bayer_scale=5"}:diff_mode=rectangle`, "-r", fps / keep, "-loop", 0, out);
    else if (ext === "webp") ff(...src, ...(pre ? ["-vf", pre] : []), "-c:v", "libwebp", "-lossless", 0, "-quality", Number(a.quality ?? 80), "-loop", 0, "-r", fps / keep, out);
    else if (ext === "webm") ff(...src, "-c:v", "libvpx-vp9", "-crf", Number(a.crf ?? 24), "-b:v", 0, "-pix_fmt", "yuv420p", out);
    else ff(...src, "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-c:v", "libx264", "-preset", "slow", "-crf", Number(a.crf ?? 16), "-pix_fmt", "yuv420p", "-movflags", "+faststart", out);
    return statSync(out).size / 1e6;
  };
  let mb = encode({}); const max = Number(a["max-mb"] ?? Infinity);
  // Over budget: fewer colours, then smaller, then half the frames.
  const steps = [{ colors: 96 }, { colors: 64 }, { colors: 48 }, { colors: 32 }, { colors: 48, scale: 0.85 }, { colors: 48, scale: 0.75 }, { colors: 64, keep: 2 }, { colors: 48, keep: 2, scale: 0.8 }];
  const first = Number(a.colors ?? 128);
  for (const s of steps.filter((x) => x.colors < first)) { if (mb <= max || ext !== "gif" && ext !== "webp") break; mb = encode(s); }
  if (!a.frames) rmSync(dir, { recursive: true });
  console.log(`${info.id}: ${n} frames, ${mb.toFixed(1)} MB -> ${out}${mb > max ? "  (still over budget: shorten with --to, or lower --size)" : ""}`);
});
