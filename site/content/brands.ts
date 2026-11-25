/**
 * Brands made with the Brand Creator skill for this site. Each one went through the skill's own
 * workflow: candidates, an options sheet, then the full kit for option 1. The specs the builder read
 * sit next to the media as brand.json.
 */
export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  why: string;
  color: { name: string; hex: string };
  type: string;
  /** How many finished directions the options sheet showed. */
  options: number;
  /** Light colors carry dark marks on their tiles. */
  darkOnColor?: boolean;
  kit?: string;
}

const media = (slug: string, file: string) => `/media/brands/${slug}/${file}`;
