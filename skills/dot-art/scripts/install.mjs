#!/usr/bin/env node
// Copy the engine into a Next.js (or any React + TypeScript) project: node install.mjs <project> [--dir components/dot-art] [--scenes bloom,knot] [--force] [--reset]
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { args, root } from "./lib.mjs";
// --force updates the engine and keeps scenes already there. --reset also overwrites the shipped scenes.
const a = args(), project = path.resolve(a._[0] ?? ".");
const pkgFile = path.join(project, "package.json");
if (!existsSync(pkgFile)) { console.error(`No package.json in ${project}`); process.exit(1); }
const pkg = JSON.parse(readFileSync(pkgFile, "utf8")), deps = { ...pkg.dependencies, ...pkg.devDependencies };
if (!deps.react) console.warn("! react is not a dependency here");
if (!deps.typescript) console.warn("! typescript is not a dependency here; the engine ships as .ts source");
const base = existsSync(path.join(project, "src")) && !existsSync(path.join(project, "app")) ? "src" : "";
const dest = path.join(project, base, a.dir ?? "components/dot-art");
if (existsSync(dest) && !a.force && !a.reset) { console.error(`${dest} exists. Pass --force to update the engine (scenes already there are kept; --reset overwrites the shipped ones).`); process.exit(1); }
const own = existsSync(path.join(dest, "scenes")) ? readdirSync(path.join(dest, "scenes")) : [];
for (const d of ["core", "geometry", "react"]) if (existsSync(path.join(dest, d))) rmSync(path.join(dest, d), { recursive: true });
for (const d of ["core", "geometry", "react", "looks.ts"]) cpSync(path.join(root, "engine", d), path.join(dest, d), { recursive: true });
const all = readdirSync(path.join(root, "engine/scenes")).filter((f) => f !== "index.ts").map((f) => f.replace(".ts", ""));
const want = a.scenes ? String(a.scenes).split(",").map((s) => s.replace(/(Octagon|Hex)$/, "")) : own.length ? all.filter((s) => own.includes(`${s}.ts`)) : all;   // an update refreshes only what is installed
const bad = want.filter((s) => !all.includes(s)); if (bad.length) { console.error(`Unknown scene: ${bad.join(", ")}. Available: ${all.join(", ")}`); process.exit(1); }
for (const s of want) if (a.reset || !own.includes(`${s}.ts`)) cpSync(path.join(root, "engine/scenes", `${s}.ts`), path.join(dest, "scenes", `${s}.ts`));
// Index lists whatever is there, so hand-written scenes show up too.
const files = readdirSync(path.join(dest, "scenes")).filter((f) => f.endsWith(".ts") && f !== "index.ts").sort();
writeFileSync(path.join(dest, "scenes/index.ts"), files.map((f) => `export * from "./${f.replace(".ts", "")}";`).join("\n") + "\n");
let idx = readFileSync(path.join(root, "engine/index.ts"), "utf8");
if (!files.includes("emblems.ts")) idx = idx.replace(/^.*scenes\/emblems.*\n/m, "");
writeFileSync(path.join(dest, "index.ts"), idx);
const tsFile = path.join(project, "tsconfig.json");
const alias = existsSync(tsFile) && /"@\/\*"/.test(readFileSync(tsFile, "utf8"));
const p = path.relative(path.join(project, base), dest).split(path.sep).join("/"), imp = alias ? `@/${p}` : `./${p}`;
const first = want[0] ?? files[0]?.replace(".ts", "") ?? "yourScene";
console.log(`dot-art -> ${path.relative(process.cwd(), dest) || dest}  (${want.length} scenes)\n\nimport { DotArt } from "${imp}/react";\nimport { ${first} } from "${imp}/scenes/${first}";\n\n<div style={{ height: 520 }}><DotArt scene={${first}} /></div>`);
