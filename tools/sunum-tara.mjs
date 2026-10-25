// Robo haftalık sunumlarını tarayıcıda gezer: veri denetimi, konsol hatası ve slaytın ekrana sığması (taşma) denetlenir.
// Kullanım: node tools/sunum-tara.mjs [--week=N] [--shots=klasör]   (varsayılan: bütün haftalar; 1366x768 ve 1024x768)
// Sayfa robo-tara.mjs gibi node_modules/.cache/robo-test/ altına derlenir; dist/ dokunulmaz.
import * as esbuild from 'esbuild';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const WEEK = opt('week', '');
const SHOTS = opt('shots', '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SYMBOL_FONTS = [['UISymC', 'ui-color.woff2'], ['UISymM', 'ui-mono.woff2'], ['UISymD', 'ui-dv.woff2']];
const symbolFontCss = SYMBOL_FONTS.map(([family, file]) =>
  `@font-face { font-family: ${family}; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'src/fonts', file)).toString('base64')}) format("woff2"); }`).join('\n');
const res = await esbuild.build({ absWorkingDir: ROOT, entryPoints: ['src/robot/app.js'], bundle: true, format: 'iife', minify: true, write: false, target: ['es2020'], legalComments: 'none', charset: 'utf8', logLevel: 'error' });
const js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const cssDir = path.join(ROOT, 'src/robot/css');
const css = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css')).sort().map((f) => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n');
let html = fs.readFileSync(path.join(ROOT, 'src/robot/index.html'), 'utf8');
html = html.replace('<!--CSS-->', () => css).replace('<style>', () => `<style>\n${symbolFontCss}`).replace('<!--APP-->', () => `<script>\n${js}\n</script>`);
const cache = path.join(ROOT, 'node_modules/.cache/robo-test');
fs.mkdirSync(cache, { recursive: true });
const file = path.join(cache, `sunum-${process.pid}.html`);
fs.writeFileSync(file, html);

const exe = ['/usr/bin/brave', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
let where = 'açılış';
page.on('pageerror', (e) => errors.push(`${where}: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${where}: ${m.text()}`); });
await page.setViewport({ width: 1366, height: 768 });
await page.goto('file://' + file);
await page.evaluate(() => { try { sessionStorage.setItem('robo-secildi', '1'); localStorage.clear(); } catch { /* yok say */ } });
await page.reload();
await sleep(500);
const weeks = await page.$$eval('.wsun', (as) => as.map((a) => +a.getAttribute('href').split('/')[1]));
const issues = [];
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
let n = 0;
for (const w of weeks) {
  if (WEEK && String(w) !== WEEK) continue;
  for (const [W, H] of [[1366, 768], [1024, 768]]) {
    await page.setViewport({ width: W, height: H });
    for (let k = 0; ; k++) {
      where = `#sunum/${w}/${k} (${W}x${H})`;
      await page.evaluate((h) => { location.hash = h; }, `#sunum/${w}/${k}`);
      await sleep(150);
      const info = await page.evaluate(() => {
        const s = document.querySelector('.slide');
        const n = document.querySelector('.sl-n')?.textContent || '';
        const show = document.querySelector('.sl-show');
        return { over: s ? s.scrollHeight - s.clientHeight : -1, page: document.documentElement.scrollWidth - document.documentElement.clientWidth, n, q: !!show };
      });
      if (info.over > 2) issues.push(`${where}: slayt taşıyor (${info.over}px)`);
      if (info.page > 0) issues.push(`${where}: yatay taşma`);
      if (info.q) {
        await page.click('.sl-show');
        await sleep(120);
        const o2 = await page.evaluate(() => { const s = document.querySelector('.slide'); return s.scrollHeight - s.clientHeight; });
        if (o2 > 2) issues.push(`${where}: cevap açılınca taşıyor (${o2}px)`);
      }
      if (SHOTS && W === 1366) await page.screenshot({ path: path.join(SHOTS, `h${w}-${String(k).padStart(2, '0')}.png`) });
      n++;
      const [a, b] = info.n.split(' / ').map(Number);
      if (!b || a >= b) break;
    }
  }
}
await browser.close();
fs.rmSync(file, { force: true });
const all = [...issues, ...new Set(errors)];
all.forEach((l) => console.log('SORUN ' + l));
console.log(`${weeks.length} haftalık sunum bulundu, ${n} slayt gezildi; sorun: ${all.length}`);
process.exit(all.length ? 1 : 0);
