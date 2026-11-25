/**
 * What the art pages show. Plain data, so server components can render the words.
 * Each id matches a scene in lib/scenes.ts, which only client components import.
 */
export interface ArtPiece {
  id: string;
  title: string;
  prompt: string;
  /** Seconds into the loop to start, for scenes that build up from nothing. */
  start?: number;
}

export interface ArtGroup {
  id: string;
  name: string;
  note: string;
  pieces: ArtPiece[];
}
