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

export default function LaunchPage() {
  return (
    <>
      <PageHero scene="tunnel">
        <SectionIntro
          as="h1"
          number={skill.number}
          name={skill.name}
          title={skill.headline}
          text={skill.summary}
          actions={<SetupPrompt prompt={setupPrompt("launch")} showPrompt={false} bare />}
        />
      </PageHero>

      <Section title="The Bloom launch film">
        <FilmPlayer film={featuredFilm} />
      </Section>

      <Section title="Trained on hundreds of launch videos">
        <Figures items={launchFigures} />
      </Section>

      <Section title="Set it up">
        <SetupPrompt prompt={setupPrompt("launch")} />
      </Section>
    </>
  );
}
