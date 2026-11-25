"use client";

import { useState } from "react";
import { brandFiles, brands } from "@/content/brands";
import styles from "./BrandGallery.module.css";

/** Pick a brand to see the options sheet the skill showed first and the board it built for the pick. */
export function BrandGallery() {
  const [slug, setSlug] = useState(brands[0].slug);
  const brand = brands.find((b) => b.slug === slug)!;
  const files = brandFiles(slug);
  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Brand">
        {brands.map((b) => (
          <button key={b.slug} type="button" role="tab" aria-selected={b.slug === slug} className={styles.tab} onClick={() => setSlug(b.slug)}>
            <span className={styles.dot} style={{ background: b.color.hex }} />
            {b.name}
          </button>
        ))}
      </div>
      <div className={styles.panes} role="tabpanel">
        <figure className={styles.pane} style={{ margin: 0 }}>
          <div className={styles.frame}>
            <img src={files.options} alt={`${brand.name} options sheet with ${brand.options} directions`} />
          </div>
          <figcaption className={styles.cap}>{brand.options} options</figcaption>
        </figure>
        <figure className={styles.pane} style={{ margin: 0 }}>
          <div className={`${styles.frame} ${styles.board}`}>
            <img src={files.board} alt={`${brand.name} brand board`} />
          </div>
          <figcaption className={styles.cap}>The kit for option 1</figcaption>
        </figure>
      </div>
    </div>
  );
}
