import type { ArtGroup } from "@/content/art";
import { ArtTile } from "./ArtTile";
import styles from "./ArtGroupGrid.module.css";

/** Every piece in a group, live, two to a row. */
export function ArtGroupGrid({ group }: { group: ArtGroup }) {
  return (
    <div className={styles.grid}>
      {group.pieces.map((p) => <ArtTile key={p.id} piece={p} wide quality={0.75} />)}
    </div>
  );
}
