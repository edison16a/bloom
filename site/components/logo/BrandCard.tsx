import { brandFiles, type Brand } from "@/content/brands";
import styles from "./BrandCard.module.css";

/** A brand at thumbnail size: the logo on ink, the symbol on its own color. */
export function BrandCard({ brand }: { brand: Brand }) {
  const files = brandFiles(brand.slug);
  return (
    <article className={styles.card}>
      <div className={styles.tiles}>
        <div className={styles.logo}>
          <img src={files.logo} alt={`${brand.name} logo`} loading="lazy" />
        </div>
        <div className={styles.color} style={{ background: brand.color.hex }}>
          <img src={brand.darkOnColor ? files.appIcon : files.symbolWhite} alt="" loading="lazy" />
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{brand.name}</h3>
        <span className={styles.meta}>{brand.color.hex}</span>
      </div>
    </article>
  );
}
