import { LiveScene } from "@/components/art/LiveScene";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import type { Film } from "@/content/films";
import { FilmPlayer } from "./FilmPlayer";
import styles from "./LaunchHero.module.css";

interface LaunchHeroProps {
  title: string;
  text: string;
  prompt: string;
  film: Film;
}

/** The launch page opener: the headline over live light, then the film at full width right under it. */
export function LaunchHero({ title, text, prompt, film }: LaunchHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.art}>
        <LiveScene id="funnel" quality={0.8} fps={30} interactive={false} />
      </div>
      <div className={styles.veil} />
      <div className="container">
        <div className={styles.top}>
          <div className={styles.copy}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.text}>{text}</p>
          </div>
          <SetupPrompt prompt={prompt} showPrompt={false} bare />
        </div>
        <div className={styles.film}>
          <FilmPlayer film={film} />
        </div>
      </div>
    </section>
  );
}
