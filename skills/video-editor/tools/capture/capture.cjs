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
