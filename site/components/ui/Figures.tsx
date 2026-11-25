import styles from "./Figures.module.css";

/** A row of figures with what each one counts. */
export function Figures({ items }: { items: { figure: string; label: string }[] }) {
  return (
    <div className={styles.grid}>
      {items.map((i) => (
        <div key={i.label} className={styles.item}>
          <p className={styles.figure}>{i.figure}</p>
          <p className={styles.label}>{i.label}</p>
        </div>
      ))}
    </div>
  );
}
