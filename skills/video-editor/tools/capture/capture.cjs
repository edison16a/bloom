#!/usr/bin/env node
/* Capture a real product for video. Uses the installed Google Chrome. Nothing is ever submitted unless a plan step does it.

  node tools/capture/capture.cjs survey --url URL --out DIR [--scheme light|dark] [--w 1440 --h 900]
      Opens the site and writes: full page and first screen at 3x, brand.json (name, copy, colours, fonts, logo files),
      elements.json (every button, input, card and section with its selector and box) and links.json.
  node tools/capture/capture.cjs run --plan plan.json --out DIR
      Records the steps of a plan as clips (2x, 30 fps) plus a still before and after every click,
      and NAME.events.json: the time and position of each click, hover and key, so the cursor and sounds are placed exactly.
  node tools/capture/capture.cjs element --url URL --sel "CSS" --out FILE.png [--scale 4]
      One element alone on a transparent background, sharp enough to sit large beside a person.

 plan.json: {"viewport":[1440,900],"scheme":"light","storage":"state.json"?,"css":"extra css"?,"init":"js run before load"?,
   "clips":[{"name":"create","url":"http://localhost:3000/","settle":2500,
     "steps":[{"do":"wait","ms":600},{"do":"click","sel":"text=New project"},{"do":"type","sel":"#title","text":"Launch","delay":70},
              {"do":"hover","sel":".card"},{"do":"press","key":"Enter"},{"do":"scroll","y":600,"ms":1400,"sel":null},{"do":"still","name":"done"}],
     "tail":1200}]}
*/
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const { chromium } = require("playwright-core");
const A = {}; const argv = process.argv.slice(3);
for (let i = 0; i < argv.length; i += 2) A[argv[i].replace(/^--/, "")] = argv[i + 1];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HIDE = "*{cursor:none!important;caret-color:auto}::-webkit-scrollbar{display:none!important}html{scrollbar-width:none!important;scroll-behavior:auto!important}";
const BANNERS = ["#onetrust-banner-sdk", "#CybotCookiebotDialog", "[id*=cookie-banner]", "[class*=cookie-banner]", "[class*=CookieBanner]", "[aria-label*=cookie i][role=dialog]", "#intercom-container", ".intercom-lightweight-app", "nextjs-portal", "[data-nextjs-toast]"];

async function open(o = {}) {
  const b = await chromium.launch({ channel: "chrome", headless: !o.headed, args: ["--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"] });
  const [w, h] = o.viewport || [1440, 900];
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: o.scale || 2, colorScheme: o.scheme || "light", isMobile: w < 600, hasTouch: w < 600, storageState: o.storage && fs.existsSync(o.storage) ? o.storage : undefined });
  if (o.init) await c.addInitScript(o.init);
  const p = await c.newPage(); p.on("pageerror", (e) => console.error("  page error:", e.message.slice(0, 160)));
  return { b, c, p };
}
async function go(p, url, settle = 2500, css = "") {
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await p.addStyleTag({ content: HIDE + BANNERS.join(",") + "{display:none!important}" + css }).catch(() => {});
  await p.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await sleep(settle);
}

async function survey() {
  const out = A.out; fs.mkdirSync(out, { recursive: true });
  const { b, p } = await open({ scale: 3, scheme: A.scheme, viewport: [+(A.w || 1440), +(A.h || 900)] });
  await go(p, A.url);
  await p.screenshot({ path: path.join(out, "first-screen.png") });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(H, 12000); y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await sleep(180); }
  await p.evaluate(() => window.scrollTo(0, 0)); await sleep(500);
  await p.screenshot({ path: path.join(out, "full-page.jpg"), fullPage: H < 14000, type: "jpeg", quality: 80, scale: "css" });
  const d = await p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 8 && r.height > 8 && s.visibility !== "hidden" && s.opacity !== "0"; };
    const sel = (e) => { if (e.id && /^[a-z][\w-]*$/i.test(e.id)) return "#" + e.id; const t = e.getAttribute("data-testid"); if (t) return `[data-testid="${t}"]`; const a = e.getAttribute("aria-label"); if (a) return `${e.tagName.toLowerCase()}[aria-label="${a}"]`; const x = (e.innerText || "").trim().split("\n")[0]; if (x && x.length < 40 && /^(BUTTON|A)$/.test(e.tagName)) return `${e.tagName.toLowerCase()}:has-text("${x}")`; const c = [...e.classList].find((k) => /^[a-z][\w-]{2,30}$/i.test(k)); return e.tagName.toLowerCase() + (c ? "." + c : ""); };
    const box = (e) => { const r = e.getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height].map(Math.round); };
    const els = [...document.querySelectorAll("button,a,input,textarea,select,[role=button],[role=dialog],section,article,form,table,[class*=card i],img,video")].filter(vis).slice(0, 260)
      .map((e) => ({ tag: e.tagName.toLowerCase(), sel: sel(e), text: (e.innerText || e.alt || e.placeholder || "").trim().replace(/\s+/g, " ").slice(0, 90), box: box(e) }));
    const count = {}, add = (c, n) => { if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) count[c] = (count[c] || 0) + n; };
    const fonts = {};
    for (const e of [...document.querySelectorAll("body *")].slice(0, 2500)) { if (!vis(e)) continue; const s = getComputedStyle(e), r = e.getBoundingClientRect(); add(s.backgroundColor, Math.sqrt(r.width * r.height)); if (e.innerText && !e.children.length) { add(s.color, 20); const f = s.fontFamily.split(",")[0].replace(/["']/g, ""); fonts[f + " " + s.fontWeight] = (fonts[f + " " + s.fontWeight] || 0) + 1; } }
    const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map((x) => x[0]);
    const meta = (n) => (document.querySelector(`meta[property="${n}"],meta[name="${n}"]`) || {}).content || null;
    const logo = document.querySelector("header svg, nav svg, a[href='/'] svg"), limg = document.querySelector("header img, nav img, a[href='/'] img");
    return { els, links: [...new Set([...document.links].map((l) => l.href))].filter((h) => h.startsWith(location.origin)).slice(0, 80),
      brand: { url: location.href, title: document.title, description: meta("description") || meta("og:description"), og: meta("og:image"), theme: meta("theme-color"), headings: [...document.querySelectorAll("h1,h2,h3")].map((h) => h.innerText.trim().replace(/\s+/g, " ")).filter(Boolean).slice(0, 40),
        colors: top(count, 12), fonts: top(fonts, 8), logoSvg: logo ? logo.outerHTML : null, logoImg: limg ? limg.src : null, icon: (document.querySelector("link[rel~=icon]") || {}).href || null } };
  });
  if (d.brand.logoSvg) fs.writeFileSync(path.join(out, "logo.svg"), d.brand.logoSvg);
  fs.writeFileSync(path.join(out, "brand.json"), JSON.stringify(d.brand, null, 1)); fs.writeFileSync(path.join(out, "elements.json"), JSON.stringify(d.els, null, 1)); fs.writeFileSync(path.join(out, "links.json"), JSON.stringify(d.links, null, 1));
  console.log(d.brand.title, "|", d.els.length, "elements |", d.links.length, "links | page", H, "px"); await b.close();
}

async function recordClip(p, plan, clip, out) {
  const dir = fs.mkdtempSync(path.join(out, clip.name + "-")), cdp = await p.context().newCDPSession(p), vp = p.viewportSize(), frames = [], events = [];
  cdp.on("Page.screencastFrame", async (f) => { frames.push({ ts: f.metadata.timestamp, data: f.data }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 94, maxWidth: vp.width * 2, maxHeight: vp.height * 2, everyNthFrame: 1 });
  await sleep(300); const t0 = Date.now() / 1000; const now = () => +(Date.now() / 1000 - t0).toFixed(3);
  const still = async (n) => { await p.screenshot({ path: path.join(out, `${clip.name}-${n}.png`) }); };
  for (const [i, s] of (clip.steps || []).entries()) {
    const L = s.sel ? p.locator(s.sel).first() : null;
    try {
      if (s.do === "wait") await sleep(s.ms || 500);
      else if (s.do === "scroll") { const y0 = await p.evaluate((q) => (q ? document.querySelector(q).scrollTop : scrollY), s.sel || null); const n = Math.max(2, Math.round((s.ms || 1200) / 16)); const st = Date.now(); events.push({ t: now(), type: "scroll", to: s.y });
        for (;;) { const k = Math.min(1, (Date.now() - st) / (s.ms || 1200)), e = k < .5 ? 4 * k ** 3 : 1 - Math.pow(-2 * k + 2, 3) / 2; await p.evaluate(({ q, y }) => { if (q) document.querySelector(q).scrollTop = y; else window.scrollTo(0, y); }, { q: s.sel || null, y: y0 + (s.y - y0) * e }); if (k >= 1) break; await sleep(12); } }
      else if (s.do === "press") { events.push({ t: now(), type: "key", key: s.key }); await p.keyboard.press(s.key); }
      else if (s.do === "still") await still(s.name || i);
      else if (s.do === "eval") await p.evaluate(s.js);
      else { await L.waitFor({ timeout: s.timeout || 15000 }); await L.scrollIntoViewIfNeeded(); const r = await L.boundingBox(), x = r.x + r.width * (s.fx ?? .5), y = r.y + r.height * (s.fy ?? .5);
        if (s.do === "hover") { events.push({ t: now(), type: "hover", x, y, box: r }); await p.mouse.move(x, y, { steps: 18 }); }
        else if (s.do === "click") { await p.mouse.move(x, y, { steps: 18 }); await sleep(s.lead ?? 450); if (s.stills !== false) await still(i + "-before"); events.push({ t: now(), type: "click", x, y, box: r, sel: s.sel }); await p.mouse.click(x, y, { delay: 60 }); if (s.stills !== false) { await sleep(s.after ?? 900); await still(i + "-after"); } }
        else if (s.do === "type") { await p.mouse.click(x, y); for (const ch of s.text) { events.push({ t: now(), type: "key", key: ch, x, y }); await p.keyboard.type(ch); await sleep((s.delay || 70) * (0.75 + Math.random() * 0.5)); } } }
    } catch (e) { console.error(`  step ${i} (${s.do} ${s.sel || ""}) failed: ${e.message.split("\n")[0]}`); events.push({ t: now(), type: "failed", step: i }); }
  }
  await sleep(clip.tail ?? 1000); const T = now(); await cdp.send("Page.stopScreencast"); if (!frames.length) throw new Error("no frames");
  const n = Math.round(T * 30); let j = 0; for (let i = 0; i < n; i++) { while (j + 1 < frames.length && frames[j + 1].ts <= t0 + i / 30) j++; fs.writeFileSync(path.join(dir, `f${String(i).padStart(5, "0")}.jpg`), Buffer.from(frames[j].data, "base64")); }
  const f = path.join(out, clip.name + ".mp4"); execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "30", "-i", path.join(dir, "f%05d.jpg"), "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", "-c:v", "libx264", "-crf", "10", "-pix_fmt", "yuv420p", f]);
  fs.rmSync(dir, { recursive: true }); fs.writeFileSync(path.join(out, clip.name + ".events.json"), JSON.stringify({ viewport: vp, scale: 2, dur: T, events }, null, 1));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-vf", `fps=${(20 / Math.max(T, 1)).toFixed(3)},scale=400:-2,tile=5x4`, "-frames:v", "1", path.join(out, clip.name + ".sheet.jpg")]);
  console.log("  ", clip.name, T.toFixed(1) + "s", frames.length, "frames", events.filter((e) => e.type === "failed").length ? "SOME STEPS FAILED" : "");
}

(async () => {
  const cmd = process.argv[2];
  if (cmd === "survey") return survey();
  if (cmd === "element") { const { b, p } = await open({ scale: +(A.scale || 4), scheme: A.scheme }); await go(p, A.url); const L = p.locator(A.sel).first(); await L.scrollIntoViewIfNeeded(); await p.addStyleTag({ content: "html,body{background:transparent!important}" }); await sleep(300); await L.screenshot({ path: A.out, omitBackground: true }); console.log(A.out); return b.close(); }
  if (cmd === "run") { const plan = JSON.parse(fs.readFileSync(A.plan, "utf8")); fs.mkdirSync(A.out, { recursive: true }); const { b, p } = await open(plan);
    for (const c of plan.clips) { if (A.only && !A.only.split(",").includes(c.name)) continue; if (c.url) await go(p, c.url, c.settle ?? 2500, plan.css); try { await recordClip(p, plan, c, A.out); } catch (e) { console.error(c.name, e.message); } }
    return b.close(); }
  console.log(fs.readFileSync(__filename, "utf8").split("*/")[0]);
})().catch((e) => { console.error(e); process.exit(1); });
