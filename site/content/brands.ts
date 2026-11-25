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

export const brandFiles = (slug: string) => ({
  logo: media(slug, "logo-horizontal-reverse.svg"),
  logoColor: media(slug, "logo-horizontal-color.svg"),
  stacked: media(slug, "logo-stacked-reverse.svg"),
  symbol: media(slug, "symbol-color.svg"),
  symbolWhite: media(slug, "symbol-white.svg"),
  wordmark: media(slug, "wordmark-reverse.svg"),
  appIcon: media(slug, "app-icon.svg"),
  options: media(slug, "options.webp"),
  board: media(slug, "board.webp"),
});

export const brands: Brand[] = [
  {
    slug: "vela",
    name: "Vela",
    tagline: "Reusable launch for small satellites",
    why: "Vela is Latin for sail, so the mark is one sail cut by the line of an orbit. The A in the wordmark is drawn open, like a nose cone.",
    color: { name: "Ignition Orange", hex: "#FF4F1A" },
    type: "Archivo 800, capitals",
    options: 4,
    kit: media("vela", "vela-brand-kit.zip"),
  },
  {
    slug: "bloom",
    name: "Bloom",
    tagline: "Art, a launch film and a logo for your idea",
    why: "A lowercase b whose bowl is one petal, so the initial and the name say the same thing. It is the logo on this site.",
    color: { name: "Bloom Pink", hex: "#FF3D9A" },
    type: "Geist 800, lowercase",
    options: 4,
  },
  {
    slug: "kite",
    name: "Kite",
    tagline: "Payments for independent shops",
    why: "A k made from one diamond folded along its spine, the way a paper kite is built.",
    color: { name: "Till Green", hex: "#00B86B" },
    type: "Plus Jakarta Sans 800, lowercase",
    options: 3,
  },
  {
    slug: "halo",
    name: "Halo",
    tagline: "Agents that answer support tickets",
    why: "Two discs overlapping, so the halo is the light left around a shadow.",
    color: { name: "Ember", hex: "#FF6A00" },
    type: "Geist 800, lowercase",
    options: 2,
  },
  {
    slug: "tessel",
    name: "Tessel",
    tagline: "Build caching for monorepos",
    why: "A T cut out of a square tile, the initial set into the grid it builds.",
    color: { name: "Volt", hex: "#C6F432" },
    type: "Space Grotesk 700, lowercase",
    options: 3,
    darkOnColor: true,
  },
];
