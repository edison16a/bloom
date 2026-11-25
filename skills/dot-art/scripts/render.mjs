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