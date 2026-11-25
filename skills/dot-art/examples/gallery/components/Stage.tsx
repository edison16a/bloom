"use client";
import { DotArt } from "@/components/dot-art/react";
import { byId } from "@/lib/catalog";

/** Scenes hold GLSL and functions, so pages pass an id and the client looks it up. */
export function Stage({ id, label }: { id: string; label?: string }) {
  const e = byId(id); return e ? <DotArt scene={e.scene} label={label} /> : null;
}
