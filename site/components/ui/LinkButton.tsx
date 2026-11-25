import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./LinkButton.module.css";

/** The secondary action: a raised surface with a hairline. */
export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return external ? (
    <a className={styles.link} href={href}>{children}</a>
  ) : (
    <Link className={styles.link} href={href}>{children}</Link>
  );
}
