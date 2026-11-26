/** Launch films shown on the site. */
export interface Film {
  id: string;
  title: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
}

export const films: Film[] = [
  {
    id: "bloom-launch",
    title: "Bloom launch film",
    src: "/media/films/bloom-launch.mp4",
    poster: "/media/films/bloom-launch.jpg",
    width: 1920,
    height: 1080,
    seconds: 24,
  },
];

export const featuredFilm = films[0];
