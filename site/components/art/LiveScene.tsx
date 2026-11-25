"use client";

import { DotArt } from "@/components/dot-art/react";
import { sceneById } from "@/lib/scenes";
import { useSceneClock } from "./useSceneClock";

interface LiveSceneProps {
  id: string;
  label?: string;
  className?: string;
  /** Start this many seconds into the loop, for scenes that build up from nothing. */
  start?: number;
  /** Fraction of procedural points. Small tiles look the same at less. */
  quality?: number;
  fps?: number;
  maxDpr?: number;
  interactive?: boolean;
}

/** A live dot art scene by id. Pages are server components, so they pass ids, never scenes. */
export function LiveScene({ id, label, className, start, quality, fps, maxDpr = 1.5, interactive = true }: LiveSceneProps) {
  const scene = sceneById(id);
  const [host, time] = useSceneClock(start, scene?.loop ?? 1, scene?.poster ?? (scene?.loop ?? 0) / 2);
  if (!scene) return null;
  return (
    <div ref={host} style={{ position: "absolute", inset: 0 }}>
      <DotArt
        scene={scene}
        label={label}
        className={className}
        time={time}
        quality={quality}
        fps={fps}
        maxDpr={maxDpr}
        interactive={interactive}
      />
    </div>
  );
}
