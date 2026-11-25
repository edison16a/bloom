import Link from "next/link";
import { films } from "@/content/films";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/media/bloom-logo.svg" alt="Bloom" width={90} height={24} />
        </div>
        <div className={styles.col}>
          <h2>Skills</h2>
          <ul>
            {skills.map((s) => (
              <li key={s.id}>
                <Link href={s.route}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <h2>Source</h2>
          <ul>
            <li><a href={site.repoUrl}>GitHub repository</a></li>
            {skills.map((s) => (
              <li key={s.id}><a href={`${site.repoUrl}/tree/${site.branch}/${s.path}`}>{s.path}</a></li>
            ))}
          </ul>
        </div>
        <div className={styles.credits}>
          {films.map((f) => (
            <p key={f.id}>Music in the {f.title}: {f.music.credit}.</p>
          ))}
          <p>
            Interface direction follows <a href="https://github.com/heydamir/unslop">unslop</a> by Damir Sokolovsky, CC BY 4.0.
          </p>
        </div>
      </div>
    </footer>
  );
}
