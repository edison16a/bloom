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
function pushOffset(t: number, at: number): number {
  const k = seg(t, at, at + 0.5);
  if (k > 0 && k < 1) blurAmount = Math.max(blurAmount, Math.sin(k * Math.PI) * 28);
  return inOut(k);
}

// ---------------------------------------------------------------- dot art renderers
interface Live { renderer: DotRenderer; canvas: HTMLCanvasElement; scene: Scene }
async function live(id: string, scene: Scene, w: number, h: number): Promise<Live> {
  const canvas = $(id) as unknown as HTMLCanvasElement;
  const renderer = new DotRenderer(canvas, scene, { quality: 1 });
  renderer.resize(w, h, 1);
  await renderer.ready;
  return { renderer, canvas, scene };
}

let art: { funnel: Live; rocket: Live; eclipse: Live };

// ---------------------------------------------------------------- logo
let stem: SVGRectElement, petal: SVGGElement, word: SVGGElement, wordBase = "";
async function buildLogo(host: HTMLElement, animated: boolean) {
  const svg = await (await fetch("assets/bloom-logo.svg")).text();
  host.innerHTML = svg;
  if (!animated) return;
  const groups = host.querySelectorAll("svg > g");
  stem = host.querySelector("rect")!;
  const p = host.querySelector("path")!;
  // Rebuild the petal so it can scale from its own base.
  const holder = document.createElementNS("http://www.w3.org/2000/svg", "g");
  p.setAttribute("transform", "rotate(48)");
  holder.appendChild(p);
  stem.parentNode!.appendChild(holder);
  petal = holder;
  word = groups[1] as SVGGElement;
  wordBase = word.getAttribute("transform") ?? "";
}

function logo(t: number) {
  const el = $("logo");
  const a = bar(0), end = bar(1) - 0.25;
  if (t < a - 0.01 || t > end + 0.26) { el.style.opacity = "0"; return; }
  el.style.opacity = String(1 - seg(t, end, end + 0.25));
  const s = out(seg(t, a, a + 0.45));
  stem.setAttribute("transform", `translate(0 34) scale(1 ${Math.max(0.001, s)}) translate(0 -34)`);
  const p = out(seg(t, a + 0.3, a + 0.85));
  petal.setAttribute("transform", `translate(-14 34) scale(${Math.max(0.001, p)})`);
  const w = out(seg(t, a + 0.6, a + 1.2));
  word.style.opacity = String(w);
  word.setAttribute("transform", `translate(${((1 - w) * 24).toFixed(2)} 0) ${wordBase}`);
}

// ---------------------------------------------------------------- windows
/** Window one: first arrival leans back 26 degrees and lies flat in 1.4 s, once per film. */
function window1(t: number, pushAt: number) {
  const el = $("W1"), win = $("win1");
  const start = bar(2) - 0.23;
  if (t < start - 0.01 || t > pushAt + 0.51) { el.style.opacity = "0"; return false; }
  const settle = inOut(seg(t, start, start + 1.4));
  const fade = seg(t, start, start + 0.3);
  // Camera: rest 1.2 s, then move in to the headline in 1.2 s, slow in and slow out.
  const cam = inOut(seg(t, bar(3), bar(3) + 1.2));
  const scale = 1 + 0.3 * cam;
  const push = pushOffset(t, pushAt);
  el.style.opacity = String(fade);
  el.style.transform = `translateY(${-push * 1080}px)`;
  // Move toward the headline at the left: its centre sits near x 470 in window pixels.
  const tx = -(scale - 1) * (470 - 720) * cam / Math.max(cam, 1e-6) * (cam > 0 ? 1 : 0);
  win.style.transform = `translateX(${tx}px) rotateX(${(1 - settle) * 26}deg) translateY(${(1 - settle) * 60}px) scale(${scale})`;
  return true;
}
