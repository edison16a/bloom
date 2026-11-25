import type { ReactNode } from "react";
import styles from "./SectionIntro.module.css";

interface SectionIntroProps {
  number?: number;
  name?: string;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
}

/** The text block that opens a section: which skill, a headline and one short line. */
export function SectionIntro({ number, name, title, text, actions, as: Heading = "h2" }: SectionIntroProps) {
  return (
    <div className={styles.intro}>
      {name ? (
        <p className={styles.kicker}>
          {number ? <span className={styles.num}>{number}</span> : null}
          {name}
        </p>
      ) : null}
      <Heading className={styles.title}>{title}</Heading>
      {text ? <p className={styles.text}>{text}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
