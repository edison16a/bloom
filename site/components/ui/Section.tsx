import type { ReactNode } from "react";
import styles from "./Section.module.css";

/** A page section with a title and an optional note beside it. */
export function Section({ id, title, note, children }: { id?: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className={`container ${styles.section}`}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
      {children}
    </section>
  );
}
