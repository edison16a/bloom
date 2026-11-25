/** Films made with the Launch Video skill. */
export interface Film {
  id: string;
  title: string;
  summary: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  shape: string;
  music: { title: string; by: string; licence: string; credit: string };
  lines: string[];
}

export const films: Film[] = [
  {
    id: "bloom-launch",
    title: "Bloom launch film",
    summary: "The launch film for this site. Real pages, a real brand kit and live dot art, cut to the bar of the track.",
    src: "/media/films/bloom-launch.mp4",
    poster: "/media/films/bloom-launch.jpg",
    width: 1280,
    height: 720,
    seconds: 35.5,
    shape: "Plain product: a sentence, the logo, then the product in use",
    music: {
      title: "Newer Wave",
      by: "Kevin MacLeod",
      licence: "CC BY 4.0",
      credit: '"Newer Wave" by Kevin MacLeod (incompetech.com), licensed under CC BY 4.0',
    },
    lines: [
      "You have an idea.",
      "Bloom does the rest.",
      "Art for your site.",
      "A logo for your name.",
      "A film for launch day.",
      "Bloom your idea into success.",
    ],
  },
];

export const featuredFilm = films[0];
