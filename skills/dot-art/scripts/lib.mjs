// Shared by render.mjs and sheet.mjs: bundle a scene, open it in headless Chrome, step it deterministically.
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, "..");

process.on("uncaughtException", (e) => { console.error(e?.errors?.length ? e.errors.map((x) => x.text).join("\n") : e?.message ?? e); process.exit(1); });
process.on("unhandledRejection", (e) => { throw e; });

export function args(argv = process.argv.slice(2)) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) { const k = a.slice(2); o[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; }
    else o._.push(a);
  }
  return o;
}

/** A scene is either a bundled id ("bloom") or a path to a .ts file exporting scenes. */
function entryFor(scene, engine) {
  const file = /\.tsx?$/.test(scene) ? path.resolve(scene) : path.join(engine, "scenes/index.ts");
  if (!existsSync(file)) throw new Error(`No such scene file: ${file}`);
  return `import * as S from ${JSON.stringify(file)};
    import { DotRenderer } from ${JSON.stringify(path.join(engine, "core/renderer.ts"))};
    const ok = (v) => v && (v.sources || typeof v.load === "function");
    window.__scenes = Object.values(S).flatMap(v => ok(v) ? [v] : typeof v === "object" && v ? Object.values(v).filter(ok) : []);
    window.__Dot = DotRenderer;`;
}
