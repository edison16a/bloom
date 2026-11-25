import type { ArtPiece } from "@/content/art";
import { LiveScene } from "./LiveScene";
import styles from "./ArtTile.module.css";

/** A live scene and its name. The prompt that made it is the tooltip. */
export function ArtTile({ piece, wide = false, quality = 0.7 }: { piece: ArtPiece; wide?: boolean; quality?: number }) {
  return (
    <figure className={`${styles.tile} ${wide ? styles.wide : ""}`} style={{ margin: 0 }}>
      <div className={styles.frame}>
        <LiveScene id={piece.id} label={piece.title} start={piece.start} quality={quality} fps={30} />
      </div>
      <figcaption className={styles.title} title={piece.prompt}>{piece.title}</figcaption>
    </figure>
  );
}
