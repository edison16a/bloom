import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { setupAllPrompt, setupPrompt } from "@/lib/prompts";

describe("setup prompts", () => {
  for (const skill of skills) {
    describe(skill.name, () => {
      const prompt = setupPrompt(skill.id);

      it("clones this repo and checks out only the skill folder", () => {
        expect(prompt).toContain(site.cloneUrl);
        expect(prompt).toContain(`sparse-checkout set ${skill.path}`);
      });

      it("covers both Claude Code and Codex", () => {
        expect(prompt).toContain("~/.claude/skills");
        expect(prompt).toContain("~/.codex/skills");
      });

      it("asks before replacing anything and cleans up after itself", () => {
        expect(prompt).toMatch(/ask me/);
        expect(prompt).toContain("Delete /tmp/bloom-setup.");
      });

      it("numbers its steps from 1 without gaps", () => {
        const numbers = [...prompt.matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1]));
        expect(numbers).toEqual(numbers.map((_, i) => i + 1));
        expect(numbers.length).toBeGreaterThan(4);
      });
    });
  }

  it("points at the files each skill really has", () => {
    expect(setupPrompt("art")).toContain("dot-art/SKILL.md");
    expect(setupPrompt("launch")).toContain("setup.sh");
    expect(setupPrompt("launch")).toContain(".claude/skills/launch-video");
    expect(setupPrompt("logo")).toContain("requirements.txt");
    expect(setupPrompt("logo")).toContain(".claude/skills/brand-creator");
  });

  it("installs all three in one prompt", () => {
    const all = setupAllPrompt();
    expect(all).toContain(`sparse-checkout set ${skills.map((s) => s.path).join(" ")}`);
    for (const s of skills) expect(all).toContain(`${s.name}:`);
  });
});
