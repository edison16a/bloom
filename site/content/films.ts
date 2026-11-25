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
