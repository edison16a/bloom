// Bloom launch film. Every value follows skills/video-editor/.claude/skills/launch-video/references/motion.md.
// The page is driven frame by frame: renderFrame(t) sets every element for film time t, so the render
// is deterministic and can be captured at any frame rate.
import { DotRenderer, type Scene } from "dot-art";
import { aurora } from "../../../site/lib/dot-art-examples/scenes/aurora";
import { eclipse } from "../../../site/components/dot-art/scenes/eclipse";
import { rocket } from "../../../site/lib/dot-art-examples/photos";

// ---------------------------------------------------------------- time grid
const MUSIC_IN = 3.8;              // film time the track starts (track first beat at 0.511 s)
const BEAT = 60 / 110;
const BAR = BEAT * 4;
const B0 = MUSIC_IN + 0.511;
const bar = (n: number) => B0 + n * BAR;
export const DURATION = 35.5;

// ---------------------------------------------------------------- easing
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const out = (x: number) => 1 - Math.pow(1 - x, 3);
const $ = (id: string) => document.getElementById(id) as HTMLElement;

// ---------------------------------------------------------------- text lines
/** Words rise 0.1 s apart, the whole line leaves together in 0.25 s with a small blur. */
function prepLine(el: HTMLElement) {
  const line = el.querySelector(".line") as HTMLElement;
  line.innerHTML = line.textContent!.split(" ").map((w) => `<span>${w}</span>`).join("");
}
function line(id: string, t: number, tin: number, tout: number) {
  const el = $(id);
  if (t < tin - 0.01 || t > tout + 0.26) { el.style.opacity = "0"; return; }
  el.style.opacity = "1";
  const leave = seg(t, tout, tout + 0.25);
  el.style.filter = leave > 0 ? `blur(${leave * 8}px)` : "none";
  el.querySelectorAll<HTMLElement>(".line span").forEach((w, i) => {
    const k = out(seg(t, tin + i * 0.1, tin + i * 0.1 + 0.45));
    w.style.opacity = String(k * (1 - leave));
    w.style.transform = `translateY(${(1 - k) * 22}px)`;
  });
}

// ---------------------------------------------------------------- push up (scene change, motion blur)
let blurAmount = 0;