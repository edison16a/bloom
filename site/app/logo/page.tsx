import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BrandCard } from "@/components/logo/BrandCard";
import { BrandGallery } from "@/components/logo/BrandGallery";
import { FeaturedBrand } from "@/components/logo/FeaturedBrand";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { Figures } from "@/components/ui/Figures";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { brandFigures, brands, featuredBrand, testRuns } from "@/content/brands";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";
import styles from "./logo.module.css";

const skill = skillById("logo");

export const metadata: Metadata = { title: skill.name, description: skill.summary };

export default function LogoPage() {
  return (
    <>
      <PageHero scene="eclipse">
        <SectionIntro
          as="h1"
          title={skill.headline}
          text={skill.summary}
          actions={<SetupPrompt prompt={setupPrompt("logo")} showPrompt={false} bare />}
        />
      </PageHero>

      <Section title="Vela">
        <FeaturedBrand brand={featuredBrand} />
      </Section>

      <Section title="Options first, then the kit">
        <BrandGallery />
      </Section>

      <Section title="Every brand">
        <div className={styles.grid}>
          {brands.map((b) => <BrandCard key={b.slug} brand={b} />)}
        </div>
      </Section>

      <Section title="Built on real logos">
        <Figures items={brandFigures} />
      </Section>

      <Section title="From the agent's test runs">
        <div className={styles.tests}>
          {testRuns.map((t) => (
            <figure key={t.name} className={styles.test}>
              <img src={t.image} alt={`${t.name} logo, for ${t.note}`} loading="lazy" width={1200} height={520} />
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Set it up">
        <SetupPrompt prompt={setupPrompt("logo")} />
      </Section>
    </>
  );
}
