/** The three skills Bloom ships. Order is the order they appear everywhere. */
export type SkillId = "art" | "launch" | "logo";

export interface Skill {
  id: SkillId;
  number: number;
  name: string;
  /** Folder inside the monorepo. */
  path: string;
  /** Folder name the agent installs it under. */
  installName: string;
  route: string;
  headline: string;
  summary: string;
}
