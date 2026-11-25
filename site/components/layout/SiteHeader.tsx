import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { nav, site } from "@/content/site";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Bloom home">
          <img src="/media/bloom-logo.svg" alt="Bloom" width={90} height={24} />
        </Link>
        <nav className={styles.nav} aria-label="Skills">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
          <a href={site.repoUrl} className={styles.github}>
            <Icon name="github" />
            <span className={styles.githubLabel}>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
