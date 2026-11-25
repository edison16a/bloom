// node capture.cjs <outDir> <fps> <from> <to>   renders film frames to JPEG through a local server
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [out, fps = '30', from = '0', to = '-1'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.error('pageerror', e.message));
  p.on('console', (m) => m.type() === 'error' && console.error('console', m.text()));
  await p.goto('http://localhost:8077/index.html');
  await p.waitForFunction(() => window.filmReady === true, null, { timeout: 120000 });
  const dur = await p.evaluate(() => window.DURATION);
  const f0 = Math.round(+from * +fps), f1 = +to < 0 ? Math.ceil(dur * +fps) : Math.round(+to * +fps);
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const file = `${out}/f${String(f).padStart(5, '0')}.jpg`;
    if (fs.existsSync(file)) continue;
    await p.evaluate((t) => window.renderFrame(t), f / +fps);
    await p.screenshot({ path: file, type: 'jpeg', quality: 94 });
    if (f % 30 === 0) console.log(`frame ${f}/${f1}  ${((Date.now() - t0) / (f - f0 + 1)).toFixed(0)} ms/frame`);
  }
  await b.close();
})();
