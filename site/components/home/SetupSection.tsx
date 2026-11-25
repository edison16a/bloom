import { LiveScene } from "@/components/art/LiveScene";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { skills } from "@/content/skills";
import { setupAllPrompt, setupPrompt } from "@/lib/prompts";
import styles from "./SetupSection.module.css";

export function SetupSection() {
  return (
    <section id="setup" className={styles.section}>
      <div className={styles.art}>
        <LiveScene id="ribbons" quality={0.7} fps={30} interactive={false} />
      </div>
      <div className={styles.veil} />
      <div className="container">
        <div className={styles.head}>
          <SectionIntro
            title="Set it up with one prompt"
            text="Paste it into Claude Code or Codex."
          />
        </div>
        <div className={styles.grid}>
          {skills.map((s) => (
            <div key={s.id} className={styles.card}>
              <h3>{s.name}</h3>
              <SetupPrompt prompt={setupPrompt(s.id)} bare />
            </div>
          ))}
          <div className={styles.card}>
            <h3>All three</h3>
            <SetupPrompt prompt={setupAllPrompt()} bare />
          </div>
        </div>
      </div>
    </section>
  );
}
