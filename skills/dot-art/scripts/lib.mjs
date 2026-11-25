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

async function launch() {
  const gpu = process.platform === "darwin" ? ["--use-angle=metal"] : ["--use-angle=gl", "--use-gl=angle"];
  const opts = { headless: true, args: [...gpu, "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] };
  try { return await chromium.launch({ ...opts, channel: "chrome" }); } catch {}
  try { return await chromium.launch(opts); } catch (e) {
    throw new Error("Needs Google Chrome, or Playwright's Chromium (npx playwright-core install chromium).\n" + e.message);
  }
}

/** Opens a page with `window.__r` ready. `fn(page, scene)` does the work. */
export async function withScene({ scene, id, width = 960, height = 600, dpr = 1, engine = path.join(root, "engine"), assets, quality = 1 }, fn) {
  const dir = mkdtempSync(path.join(tmpdir(), "dot-art-"));
  const out = path.join(dir, "b.js");
  await build({ stdin: { contents: entryFor(scene, engine), resolveDir: engine, loader: "ts" }, alias: { "dot-art": path.join(engine, "index.ts") }, bundle: true, format: "iife", outfile: out, logLevel: "error", target: "es2022" });
  const js = readFileSync(out);
  const base = assets ? path.resolve(assets) : /\.tsx?$/.test(scene) ? path.dirname(path.resolve(scene)) : path.join(root, "examples");
  const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".glb": "model/gltf-binary", ".mp4": "video/mp4" };
  const srv = createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    if (u === "/") { r.setHeader("content-type", "text/html"); return r.end(`<!doctype html><meta charset=utf-8><style>*{margin:0}body{background:#000}</style><canvas id=c style="width:${width}px;height:${height}px;display:block"></canvas><script src=/b.js></script>`); }
    if (u === "/b.js") { r.setHeader("content-type", "text/javascript"); return r.end(js); }
    const f = path.join(base, u);
    if (f.startsWith(base) && existsSync(f)) { r.setHeader("content-type", types[path.extname(f)] ?? "application/octet-stream"); return r.end(readFileSync(f)); }
    r.statusCode = 404; r.end();
  });
  await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
  const browser = await launch();
  try {
    const page = await (await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr })).newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && !/favicon|404/.test(m.text()) && errs.push(m.text()));
    await page.goto(`http://127.0.0.1:${srv.address().port}/`);
    const info = await page.evaluate(async ({ id, width, height, dpr, quality }) => {
      let s = id ? window.__scenes.find((x) => x.id === id) : window.__scenes[0];
      if (!s) return { error: `scene "${id}" not found. Available: ${window.__scenes.map((x) => x.id).join(", ")}` };
      try { if (s.load) s = await s.load(); } catch (e) { return { error: e.message }; }
      const fs = s.style.glyph?.font; if (fs) { try { await document.fonts.load(`16px ${fs}`); } catch {} }
      try {
        const t0 = performance.now();
        const r = new window.__Dot(document.getElementById("c"), s, { quality, onError: (e) => console.error(e.message) });
        r.resize(width, height, dpr); await r.ready; window.__r = r;
        r.render(s.poster ?? s.loop / 2);
        const px = new Uint8Array(4); r.gl.readPixels(0, 0, 1, 1, r.gl.RGBA, r.gl.UNSIGNED_BYTE, px);
        return { id: s.id, loop: s.loop, poster: s.poster ?? s.loop / 2, grid: r.grid, setup: Math.round(performance.now() - t0), gpu: r.gl.getParameter(r.gl.getExtension("WEBGL_debug_renderer_info")?.UNMASKED_RENDERER_WEBGL ?? r.gl.RENDERER) };
      } catch (e) { return { error: e.message }; }
    }, { id, width, height, dpr, quality });
    if (info.error) throw new Error(info.error + (errs.length ? "\n" + errs.join("\n") : ""));
    const missing = errs.filter((e) => /could not load/.test(e));
    if (missing.length) throw new Error(missing.join("\n") + `\nLooked in ${base}. Pass --assets <folder> to serve from somewhere else (for example your project's public folder).`);
    if (errs.length) console.warn(errs.join("\n"));
    return await fn(page, info);
  } finally { await browser.close(); srv.close(); rmSync(dir, { recursive: true, force: true }); }
}
