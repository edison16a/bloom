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

/** Window two: the options sheet arrives, the camera moves to option 1, the pick dissolves to the board. */
function window2(t: number, inAt: number, pushAt: number) {
  const el = $("W2"), win = $("win2");
  if (t < inAt - 0.01 || t > pushAt + 0.51) { el.style.opacity = "0"; return; }
  const arrive = out(seg(t, inAt, inAt + 0.7));
  const push = pushOffset(t, pushAt);
  el.style.opacity = String(seg(t, inAt, inAt + 0.3));
  el.style.transform = `translateY(${(1 - arrive) * 54 - push * 1080}px)`;
  // Option 1's centre on the sheet, in window pixels.
  const px = 371, py = 330, cx = 720, cy = 405, s = 1.35;
  const moveIn = inOut(seg(t, bar(5) + 1.2, bar(5) + 2.4));
  const click = bar(7);
  const back = inOut(seg(t, click + 0.1, click + 1.1));
  const k = moveIn * (1 - back);
  const scale = 1 + (s - 1) * k;
  win.style.transform = `translate(${-(s * (px - cx)) * k}px, ${-(s * (py - cy)) * k}px) scale(${scale})`;
  $("board").style.opacity = String(seg(t, click, click + 0.15));
  $("options").style.opacity = String(1 - seg(t, click + 0.15, click + 0.3));
}

// ---------------------------------------------------------------- montage
function cut(id: string, t: number, a: number, b: number, fadeOut = 0) {
  const el = $(id);
  const on = t >= a && t < b + fadeOut;
  el.style.opacity = on ? String(1 - (fadeOut ? seg(t, b, b + fadeOut) : 0)) : "0";
  return on;
}

// ---------------------------------------------------------------- frame
export async function renderFrame(t: number) {
  blurAmount = 0;
  line("L1", t, 0.5, 2.0);
  line("L2", t, 2.35, 3.5);
  logo(t);
  line("L3", t, bar(1), bar(2) - 0.45);

  const w1 = window1(t, bar(4));
  // Line four pushes up from below as window one leaves.
  const l4 = $("L4");
  const p4 = pushOffset(t, bar(4));
  if (t >= bar(4) && t < bar(5) - 0.0) {
    l4.style.opacity = String(1 - seg(t, bar(5) - 0.25, bar(5)));
    l4.style.transform = `translateY(${(1 - p4) * 1080}px)`;
    l4.style.filter = "none";
  } else l4.style.opacity = "0";

  window2(t, bar(5), bar(8));

  const l5 = $("L5");
  const p5 = pushOffset(t, bar(8));
  if (t >= bar(8) && t < bar(9)) {
    l5.style.opacity = String(1 - seg(t, bar(9) - 0.25, bar(9)));
    l5.style.transform = `translateY(${(1 - p5) * 1080}px)`;
  } else l5.style.opacity = "0";

  // Five cuts, one every two beats.
  const c = bar(9), step = BEAT * 2;
  const r = cut("C0", t, c, c + step);
  cut("C1", t, c + step, c + 2 * step);
  cut("C2", t, c + 2 * step, c + 3 * step);
  const e = cut("C3", t, c + 3 * step, c + 4 * step);
  cut("C4", t, c + 4 * step, c + 5 * step, 0.3);

  const endLine = c + 5 * step + 0.4;
  line("L6", t, endLine, endLine + 2.0);
  const endAt = endLine + 2.5;
  const end = $("end");
  end.style.opacity = String(seg(t, endAt, endAt + 0.4));
  $("url").style.opacity = String(seg(t, endAt + 0.8, endAt + 1.2));

  // Motion blur on whatever is pushing.
  const blur = document.getElementById("mbBlur")!;
  blur.setAttribute("stdDeviation", `0 ${blurAmount.toFixed(1)}`);
  for (const id of ["W1", "W2", "L4", "L5"]) $(id).style.filter = blurAmount > 0.5 ? "url(#mb)" : "none";

  if (w1) art.funnel.renderer.render(Math.max(0, t - bar(2)));
  if (r) art.rocket.renderer.render(t - c + 2);
  if (e) art.eclipse.renderer.render(t - c + 4);
}
