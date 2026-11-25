#!/usr/bin/env node
// Copies the dot-art engine, its example scenes and photos into the site, the same way the skill's
// own gallery does. The skill folder is the source of truth and is never written to.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skill = path.resolve(site, "../skills/dot-art");

// The installer needs the skill's own script dependencies (esbuild). They are gitignored there.
if (!existsSync(path.join(skill, "scripts/node_modules"))) {
  execFileSync("npm", ["ci", "--no-fund", "--no-audit"], { cwd: path.join(skill, "scripts"), stdio: "inherit" });
}

execFileSync("node", [path.join(skill, "scripts/install.mjs"), site, "--reset"], { stdio: ["ignore", "ignore", "inherit"] });

const examples = path.join(site, "lib/dot-art-examples");
rmSync(examples, { recursive: true, force: true });
mkdirSync(examples, { recursive: true });
cpSync(path.join(skill, "examples/scenes"), path.join(examples, "scenes"), { recursive: true });
cpSync(path.join(skill, "examples/photos.ts"), path.join(examples, "photos.ts"));
