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

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (name === "dot-art" || name === "dot-art-examples") return [];
    return statSync(full).isDirectory() ? files(full) : /\.(ts|tsx)$/.test(name) ? [full] : [];
  });

const sources = ["app", "components", "content", "lib"].flatMap((d) => files(path.join(root, d)));

const banned: [RegExp, string][] = [
  [/—/, "em dash"],
  [/–/, "en dash"],
  [/·/, "middle dot"],
  [/•/, "bullet"],
  [/[←-⇿]/, "arrow"],
];

describe("copy style", () => {
  for (const file of sources) {
    it(path.relative(root, file), () => {
      const text = readFileSync(file, "utf8");
      for (const [re, name] of banned) expect(re.test(text), `${name} in ${file}`).toBe(false);
    });
  }

  it("content has no double hyphens or spaced hyphens used as dashes", () => {
    for (const file of sources.filter((f) => f.includes(`${path.sep}content${path.sep}`))) {
      const text = readFileSync(file, "utf8");
      expect(/\s--\s|\s-\s/.test(text), file).toBe(false);
    }
  });

  it("prompts read cleanly", () => {
    for (const prompt of [...skills.map((s) => setupPrompt(s.id)), setupAllPrompt()]) {
      expect(/[—–·•←-⇿]/.test(prompt)).toBe(false);
      expect(prompt).not.toContain("!");
    }
  });
});
