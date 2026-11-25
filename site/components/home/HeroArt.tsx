"use client";

import { LiveScene } from "@/components/art/LiveScene";

/** The flower types itself from nothing for the first seconds. The hero starts where it is open. */
export function HeroArt() {
  return <LiveScene id="bloom" start={4.6} label="A pink flower made of letters that blossoms, then blows away" />;
}
