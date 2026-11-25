import type { Metadata } from "next";
import { FilmPlayer } from "@/components/launch/FilmPlayer";
import { PageHero } from "@/components/layout/PageHero";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { Figures } from "@/components/ui/Figures";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { featuredFilm } from "@/content/films";
import { launchFigures } from "@/content/launch";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";

const skill = skillById("launch");

export const metadata: Metadata = { title: skill.name, description: skill.summary };
