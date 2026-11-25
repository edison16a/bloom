import type { ReactNode } from "react";
import { LiveScene } from "@/components/art/LiveScene";
import styles from "./PageHero.module.css";

/** A skill page opener: live dot art edge to edge, the words on the calm left side. */
export function PageHero({ scene, children }: { scene: string; children: ReactNode }) {
  return (
    <section className={styles.hero}>
      <div className={styles.art}>
        <LiveScene id={scene} quality={0.8} interactive />
      </div>
      <div className={styles.veil} />
      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>{children}</div>
      </div>
    </section>
  );
}
