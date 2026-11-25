import { LiveScene } from "@/components/art/LiveScene";
import { FilmPlayer } from "@/components/launch/FilmPlayer";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { featuredFilm } from "@/content/films";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";
import styles from "./LaunchShowcase.module.css";

export function LaunchShowcase() {
  const skill = skillById("launch");
  return (
    <section id="launch" className={styles.section}>
      <div className={styles.art}>
        <LiveScene id="funnel" quality={0.7} fps={30} interactive={false} />
      </div>
      <div className={styles.veil} />
      <div className="container">
        <div className={styles.layout}>
          <SectionIntro
            number={skill.number}
            name={skill.name}
            title={skill.headline}
            text={`${skill.summary} Trained on 250 launch videos, built in EffectCraft.`}
            actions={
              <>
                <SetupPrompt prompt={setupPrompt("launch")} showPrompt={false} bare />
                <LinkButton href={skill.route}>How it works</LinkButton>
              </>
            }
          />
          <FilmPlayer film={featuredFilm} />
        </div>
      </div>
    </section>
  );
}
