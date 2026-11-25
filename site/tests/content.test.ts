import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allPieces, homeArt, surfaces } from "@/content/art";
import { brandFiles, brands, featuredBrand, testRuns } from "@/content/brands";
import { films } from "@/content/films";
import { skills } from "@/content/skills";

const root = path.resolve(__dirname, "..");
const publicFile = (url: string) => path.join(root, "public", url);