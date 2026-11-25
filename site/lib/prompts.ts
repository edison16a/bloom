import { site } from "@/content/site";
import { skillById, skills, type Skill, type SkillId } from "@/content/skills";

/**
 * Setup prompts people paste into Claude Code or Codex. One prompt works in both: it tells the agent
 * where each of them keeps skills and lets the agent pick. Every step is a command the agent can run
 * and check, so the result is the same on any machine.
 */

const TMP = "/tmp/bloom-setup";
const WORKSPACE = "~/bloom";
