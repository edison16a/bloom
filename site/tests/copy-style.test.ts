import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { skills } from "@/content/skills";
import { setupAllPrompt, setupPrompt } from "@/lib/prompts";

/**
 * The writing rules for the site: no dashes used as punctuation, no midline dots or bullet characters,
 * no arrows standing in for words, no exclamation marks.
 */
const root = path.resolve(__dirname, "..");
