#!/usr/bin/env node
// Copies the dot-art engine, its example scenes and photos into the site, the same way the skill's
// own gallery does. The skill folder is the source of truth and is never written to.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");