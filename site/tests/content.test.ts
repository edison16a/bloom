import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allPieces, homeArt, surfaces } from "@/content/art";
import { brandFiles, brands, featuredBrand, testRuns } from "@/content/brands";
import { films } from "@/content/films";
import { skills } from "@/content/skills";

const root = path.resolve(__dirname, "..");
const publicFile = (url: string) => path.join(root, "public", url);
const repo = path.resolve(root, "..");

describe("content", () => {
  it("every skill folder exists in the monorepo", () => {
    for (const s of skills) expect(existsSync(path.join(repo, s.path)), s.path).toBe(true);
  });

  it("every art id has a scene in the engine or the examples", () => {
    const engine = readdirSync(path.join(repo, "skills/dot-art/engine/scenes")).join(" ");
    const examples = readdirSync(path.join(repo, "skills/dot-art/examples/scenes")).join(" ");
    const photos = ["pagoda", "dahlia", "rocket"];
    const known = (id: string) => engine.includes(`${id}.ts`) || examples.includes(`${id}.ts`) || photos.includes(id);
    for (const p of allPieces()) expect(known(p.id), p.id).toBe(true);
  });

  it("home art and surfaces only use known pieces", () => {
    const ids = new Set(allPieces().map((p) => p.id));
    for (const id of homeArt) expect(ids.has(id), id).toBe(true);
    const variants = ["bloomHex", "bloomOctagon", "bloomLed", "bloomDither", "bloomPlus"];
    for (const s of surfaces) expect(ids.has(s.id) || variants.includes(s.id), s.id).toBe(true);
  });

  it("art ids are unique", () => {
    const ids = allPieces().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every brand file the site links to is there", () => {
    for (const b of brands) {
      for (const url of Object.values(brandFiles(b.slug))) expect(existsSync(publicFile(url)), url).toBe(true);
      if (b.kit) expect(existsSync(publicFile(b.kit)), b.kit).toBe(true);
      expect(b.color.hex).toMatch(/^#[0-9A-F]{6}$/);
    }
    for (const t of testRuns) expect(existsSync(publicFile(t.image)), t.image).toBe(true);
    expect(featuredBrand.kit).toBeDefined();
  });

  it("every film and poster is there", () => {
    for (const f of films) {
      expect(existsSync(publicFile(f.src)), f.src).toBe(true);
      expect(existsSync(publicFile(f.poster)), f.poster).toBe(true);
      expect(f.seconds).toBeGreaterThan(0);
    }
  });
});
