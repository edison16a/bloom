#!/usr/bin/env node
// Scaffold a scene: node new.mjs <id> --kind object|background|text-object|text-background|image|model|logo [--out file.ts] [--import dot-art]
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { args } from "./lib.mjs";
const a = args(), id = String(a._[0] ?? "").replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^\d/, "_$&"), kind = a.kind ?? "object", from = a.import ?? "dot-art";