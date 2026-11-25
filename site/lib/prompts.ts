import { site } from "@/content/site";
import { skillById, skills, type Skill, type SkillId } from "@/content/skills";

/**
 * Setup prompts people paste into Claude Code or Codex. One prompt works in both: it tells the agent
 * where each of them keeps skills and lets the agent pick. Every step is a command the agent can run
 * and check, so the result is the same on any machine.
 */

const TMP = "/tmp/bloom-setup";
const WORKSPACE = "~/bloom";

const fetchStep = (paths: string[]) =>
  [
    "Get only the folders you need from the Bloom repo:",
    `   git clone --depth 1 --filter=blob:none --sparse ${site.cloneUrl} ${TMP}`,
    `   git -C ${TMP} sparse-checkout set ${paths.join(" ")}`,
  ].join("\n");

const skillsFolderStep = [
  "Work out which agent you are and use its skills folder:",
  "   Claude Code: ~/.claude/skills",
  "   Codex: ~/.codex/skills",
  "   Create the folder if it does not exist.",
].join("\n");

/** Steps for one skill, numbered from `start`. Shared by the single and the full setup prompt. */
function skillSteps(skill: Skill): string[] {
  const src = `${TMP}/${skill.path}`;
  switch (skill.id) {
    case "art":
      return [
        `Copy the skill in: cp -R ${src} <skills folder>/dot-art. If a dot-art folder is already there, stop and ask me before replacing it.`,
        "Install its render tools: cd <skills folder>/dot-art/scripts && npm install. It needs Node 20 or newer.",
        "Check that Chrome (or Chromium) and ffmpeg are installed. They are only needed to export GIF and MP4. Tell me what is missing, and do not install system software without asking.",
        "Read <skills folder>/dot-art/SKILL.md so you know how the skill works.",
      ];
    case "launch":
      return [
        `Copy the workspace to ${WORKSPACE}/video-editor: mkdir -p ${WORKSPACE} && cp -R ${src} ${WORKSPACE}/video-editor. If it already exists, stop and ask me first.`,
        `Link its two skills into the skills folder so they work from any project: ln -s ${WORKSPACE}/video-editor/.claude/skills/launch-video <skills folder>/launch-video, and the same for production-video-editing.`,
        `If you are Codex, also run: ln -s CLAUDE.md ${WORKSPACE}/video-editor/AGENTS.md, so the workspace rules load for you too.`,
        `Run ${WORKSPACE}/video-editor/setup.sh and read what it reports. It checks ffmpeg, Python with numpy and OpenCV, and the capture tool.`,
        "The films are built in EffectCraft (part of ArtCraft, macOS). If it is not installed, tell me to install it and to connect its MCP server, using .mcp.json.example in the workspace as the guide. Do not try to install it yourself.",
        `Read ${WORKSPACE}/video-editor/CLAUDE.md and the launch-video SKILL.md so you know the workflow.`,
      ];
    case "logo":
      return [
        `Copy the skill to ${WORKSPACE}/brand-creator: mkdir -p ${WORKSPACE} && cp -R ${src} ${WORKSPACE}/brand-creator. If it already exists, stop and ask me first.`,
        `Install its Python package: python3 -m pip install -r ${WORKSPACE}/brand-creator/requirements.txt`,
        `Link the skill into the skills folder: ln -s ${WORKSPACE}/brand-creator/.claude/skills/brand-creator <skills folder>/brand-creator. Its scripts run from ${WORKSPACE}/brand-creator, so always work in that folder when you make a brand.`,
        "Check that Google Chrome or Chromium is installed. If it lives somewhere unusual, set CHROME=/path/to/chrome. Tell me if it is missing.",
        `Read ${WORKSPACE}/brand-creator/.claude/skills/brand-creator/SKILL.md so you know the workflow.`,
      ];
  }
}

const tryLine: Record<SkillId, string> = {
  art: '"Put a pink flower made of letters behind my hero"',
  launch: '"Make a 35 second launch film for my site"',
  logo: '"Create a brand for Acme, we make payroll software"',
};

const number = (lines: string[]) => lines.map((line, i) => `${i + 1}. ${line}`).join("\n");

/** The prompt behind "Copy setup prompt" on a skill. */
export function setupPrompt(id: SkillId): string {
  const skill = skillById(id);
  const steps = [fetchStep([skill.path]), skillsFolderStep, ...skillSteps(skill), `Delete ${TMP}.`];
  return [
    `Set up the ${skill.name} skill from Bloom (${site.repoUrl}) on this machine.`,
    "",
    number(steps),
    "",
    `When you are done, tell me in two lines what you installed and anything I still need to do. Then suggest one thing to try, like ${tryLine[id]}.`,
  ].join("\n");
}
