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
