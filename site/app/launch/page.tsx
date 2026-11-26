import type { Metadata } from "next";
import { LaunchHero } from "@/components/launch/LaunchHero";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { Figures } from "@/components/ui/Figures";
import { Section } from "@/components/ui/Section";
import { featuredFilm } from "@/content/films";
import { launchFigures } from "@/content/launch";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";

const skill = skillById("launch");

export const metadata: Metadata = { title: skill.name, description: skill.summary };

export default function LaunchPage() {
  return (
    <>
      <LaunchHero
        title={skill.headline}
        text={`${skill.summary} Trained on 250 launch videos, built in EffectCraft.`}
        prompt={setupPrompt("launch")}
        film={featuredFilm}
      />

      <Section title="Trained on hundreds of launch videos">
        <Figures items={launchFigures} />
      </Section>

      <Section title="Set it up">
        <SetupPrompt prompt={setupPrompt("launch")} />
      </Section>
    </>
  );
}
