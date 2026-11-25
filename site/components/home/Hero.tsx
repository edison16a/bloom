import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { LinkButton } from "@/components/ui/LinkButton";
import { setupAllPrompt } from "@/lib/prompts";
import { HeroArt } from "./HeroArt";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.art}>
        <HeroArt />
      </div>
      <div className={styles.fade} />
      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            <span className={styles.bloom}>Bloom</span> your idea into success
          </h1>
          <p className={styles.sub}>
            Three AI agents that help you make your site art, your launch film and your logo.
          </p>
          <div className={styles.actions}>
            <SetupPrompt prompt={setupAllPrompt()} label="Copy setup prompt" showPrompt={false} bare />
            <LinkButton href="#art">See the work</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
