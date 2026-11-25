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
              <h3><span>{s.number}</span>{s.name}</h3>
              <SetupPrompt prompt={setupPrompt(s.id)} bare />
            </div>
          ))}
        </div>
        <div className={styles.all}>
          <SetupPrompt prompt={setupAllPrompt()} label="Copy setup prompt for all three" />
        </div>
      </div>
    </section>
  );
}
