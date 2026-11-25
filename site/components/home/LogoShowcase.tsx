import { BrandCard } from "@/components/logo/BrandCard";
import { FeaturedBrand } from "@/components/logo/FeaturedBrand";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { brands, featuredBrand } from "@/content/brands";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";
import styles from "./LogoShowcase.module.css";

export function LogoShowcase() {
  const skill = skillById("logo");
  const others = brands.filter((b) => b.slug !== featuredBrand.slug);
  return (
    <section id="logo" className={`container ${styles.section}`}>
      <div className={styles.head}>
        <SectionIntro title={skill.headline} text={skill.summary} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <SetupPrompt prompt={setupPrompt("logo")} showPrompt={false} bare />
          <LinkButton href={skill.route}>See every brand</LinkButton>
        </div>
      </div>
      <FeaturedBrand brand={featuredBrand} />
      <div className={styles.grid}>
        {others.map((b) => <BrandCard key={b.slug} brand={b} />)}
      </div>
    </section>
  );
}
