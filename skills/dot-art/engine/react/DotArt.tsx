"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DotRenderer } from "../core/renderer";
import type { LazyScene, Scene, Style } from "../core/types";

export interface DotArtProps {
  /** A scene, or a lazy one (3D models). Define it outside the component, or memoise it: a new object means a full rebuild. */
  scene: Scene | LazyScene;
  /** Patch the style without writing a new scene, e.g. `{ cell: 8 }`. Keep the object stable between renders. */
  style?: Partial<Style>;
  className?: string;
  css?: CSSProperties;
  /** Playback speed. Default 1. */
  speed?: number;
  /** Hold a single moment, in scene seconds. Use it to scrub with scroll. */
  time?: number;
  paused?: boolean;
  /** Upper bound on device pixel ratio. Default 2. */
  maxDpr?: number;
  /** 0.3–1. Fraction of procedural points drawn. Default: 1, or 0.6 on small touch screens. */
  quality?: number;
  /** Respond to the pointer. Default true. Tracks the window, so it works behind other content. */
  interactive?: boolean;
  /** Frames per second cap. Default: display rate. */
  fps?: number;
  /** Accessible description. Without it the canvas is treated as decoration. */
  label?: string;
  /** Shown if WebGL2 is missing. */
  fallback?: ReactNode;
  onReady?: () => void;
  onError?: (e: Error) => void;
}
