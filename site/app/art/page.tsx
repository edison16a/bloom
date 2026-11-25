import type { Metadata } from "next";
import { ArtGroupGrid } from "@/components/art/ArtGroupGrid";
import { SurfaceSwitcher } from "@/components/art/SurfaceSwitcher";
import { PageHero } from "@/components/layout/PageHero";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { artGroups } from "@/content/art";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";

const skill = skillById("art");

export const metadata: Metadata = { title: skill.name, description: skill.summary };
