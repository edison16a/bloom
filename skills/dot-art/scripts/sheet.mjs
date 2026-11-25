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