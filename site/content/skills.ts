/** The three skills Bloom ships. Order is the order they appear everywhere. */
export type SkillId = "art" | "launch" | "logo";

export interface Skill {
  id: SkillId;
  name: string;
  /** Folder inside the monorepo. */
  path: string;
  /** Folder name the agent installs it under. */
  installName: string;
  route: string;
  headline: string;
  summary: string;
}

export const skills: Skill[] = [
  {
    id: "art",
    name: "Dot Art",
    path: "skills/dot-art",
    installName: "dot-art",
    route: "/art/",
    headline: "Art that moves",
    summary: "Animated art for your site, drawn by your agent.",
  },
  {
    id: "launch",
    name: "Launch Video",
    path: "skills/video-editor",
    installName: "video-editor",
    route: "/launch/",
    headline: "Accelerate your video creation",
    summary: "A launch film from a link, cut to real music.",
  },
  {
    id: "logo",
    name: "Brand Creator",
    path: "skills/brand-creator",
    installName: "brand-creator",
    route: "/logo/",
    headline: "A name in, a brand out",
    summary: "Pick a logo, get every file you need.",
  },
];

export const skillById = (id: SkillId): Skill => {
  const skill = skills.find((s) => s.id === id);
  if (!skill) throw new Error(`Unknown skill: ${id}`);
  return skill;
};
