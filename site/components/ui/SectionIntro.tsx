import type { ReactNode } from "react";
import styles from "./SectionIntro.module.css";

interface SectionIntroProps {
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
}

/** The text block that opens a section: a headline and one short line. */
export function SectionIntro({ title, text, actions, as: Heading = "h2" }: SectionIntroProps) {
  return (
    <div className={styles.intro}>
      <Heading className={styles.title}>{title}</Heading>
      {text ? <p className={styles.text}>{text}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
