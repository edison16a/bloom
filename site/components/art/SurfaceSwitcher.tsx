"use client";

import { useState } from "react";
import { surfaces } from "@/content/art";
import { LiveScene } from "./LiveScene";
import styles from "./SurfaceSwitcher.module.css";

const snippet: Record<string, string> = {
  bloom: "bloom",
  bloomHex: "withLook(bloom, looks.hex())",
  bloomOctagon: "withLook(bloom, looks.octagon())",
  bloomLed: "withLook(bloom, looks.led())",
  bloomDither: "withLook(bloom, looks.dither(pinks))",
  bloomPlus: 'withLook(bloom, looks.marks("plus"))',
};

/** One scene, six surfaces. Switching mounts a new canvas, so only one runs at a time. */
export function SurfaceSwitcher() {
  const [active, setActive] = useState<string>(surfaces[0].id);
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <LiveScene key={active} id={active} start={4.6} label={`The flower drawn in ${active}`} />
      </div>
      <div className={styles.side}>
        <div className={styles.tabs} role="tablist" aria-label="Surface">
          {surfaces.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === s.id}
              className={styles.tab}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <code className={styles.code}>{snippet[active]}</code>
      </div>
    </div>
  );
}
