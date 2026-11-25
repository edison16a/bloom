import { Icon } from "@/components/ui/Icon";
import { brandFiles, type Brand } from "@/content/brands";
import styles from "./FeaturedBrand.module.css";

/** One brand shown large: the lockup, the symbol on its color and the app icon. */
export function FeaturedBrand({ brand }: { brand: Brand }) {
  const files = brandFiles(brand.slug);
  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <img src={files.logo} alt={`${brand.name} logo`} />
      </div>
      <div className={styles.side}>
        <div className={styles.pair}>
          <div className={styles.tile} style={{ background: brand.color.hex }}>
            <img src={files.symbolWhite} alt={`${brand.name} symbol`} />
          </div>
          <div className={`${styles.tile} ${styles.icon}`} style={{ background: "#09090c" }}>
            <img src={files.appIcon} alt={`${brand.name} app icon`} />
          </div>
        </div>
        <div className={styles.facts}>
          <h3>{brand.name}</h3>
          <p>{brand.tagline}</p>
          <ul className={styles.dl}>
            <li><span>Color</span><span><i className={styles.swatch} style={{ background: brand.color.hex }} />{brand.color.name} {brand.color.hex}</span></li>
          </ul>
          {brand.kit ? (
            <a className={styles.download} href={brand.kit} download>
              <Icon name="download" /> Download the {brand.name} kit
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
