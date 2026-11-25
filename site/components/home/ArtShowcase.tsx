import { ArtTile } from "@/components/art/ArtTile";
import { LiveScene } from "@/components/art/LiveScene";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { allPieces, homeArt } from "@/content/art";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";
import styles from "./ArtShowcase.module.css";

export function ArtShowcase() {
  const skill = skillById("art");
  const pieces = homeArt.map((id) => allPieces().find((p) => p.id === id)!);
  const [first, ...rest] = pieces;
  return (
    <section id="art" className={`container ${styles.section}`}>
      <div className={styles.top}>
        <SectionIntro
          number={skill.number}
          name={skill.name}
          title={skill.headline}
          text={skill.summary}
          actions={
            <>
              <SetupPrompt prompt={setupPrompt("art")} showPrompt={false} bare />
              <LinkButton href={skill.route}>See all the art</LinkButton>
            </>
          }
        />
        <div className={styles.feature}>
          <LiveScene id={first.id} label={first.title} />
        </div>
      </div>
      <div className={styles.grid}>
        {rest.map((piece) => <ArtTile key={piece.id} piece={piece} quality={0.6} />)}
      </div>
    </section>
  );
}
