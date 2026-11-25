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

export default function ArtPage() {
  return (
    <>
      <PageHero scene="keys">
        <SectionIntro
          as="h1"
          number={skill.number}
          name={skill.name}
          title={skill.headline}
          text={skill.summary}
          actions={<SetupPrompt prompt={setupPrompt("art")} showPrompt={false} bare />}
        />
      </PageHero>

      <Section title="One scene, any surface">
        <SurfaceSwitcher />
      </Section>

      {artGroups.map((group) => (
        <Section key={group.id} id={group.id} title={group.name}>
          <ArtGroupGrid group={group} />
        </Section>
      ))}

      <Section title="Set it up">
        <SetupPrompt prompt={setupPrompt("art")} />
      </Section>
    </>
  );
}
