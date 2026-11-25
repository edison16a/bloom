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
