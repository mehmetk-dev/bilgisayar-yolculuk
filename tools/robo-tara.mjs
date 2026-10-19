// Robo ile Kodlama: tarayıcı turu. Brave (yoksa Chromium) başsız açılır; her bölümün her adımı ve "son" sayfası gezilir.
// Kullanım: node tools/robo-tara.mjs [--size=1280x720] [--shots=klasör] [--only=NO] [--noflag]
//   --size=GxY    pencere boyutu (varsayılan 1280x720)
//   --shots=KLS   her bölümün ilk sahne adımının ekran görüntüsünü KLS/bNN-ADIM.png olarak kaydeder
//   --only=NO     yalnız o bölüm (13 ya da b13)
//   --noflag      sahne adımlarında 🏁 düğmesine basılmasın (varsayılan: basılır, çalışma hataları yakalansın)
// dist/ dokunulmaz: sayfa node_modules/.cache/robo-test/robo.html olarak derlenir (build.mjs page() mantığı taklit edilir).
// pageerror / console.error ve yatay taşma (scrollWidth > clientWidth) bildirilir; sorun varsa çıkış kodu 1.
import * as esbuild from 'esbuild';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const [W, H] = opt('size', '1280x720').split('x').map(Number);
const SHOTS = opt('shots', '');
const ONLY = opt('only', '').replace(/^b/, '');
const FLAG = !args.includes('--noflag');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- derleme (build.mjs page() ile aynı; yalnız dist yerine önbellek klasörüne yazar) ---
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
const file = path.join(cache, 'robo.html');
fs.writeFileSync(file, html);

// --- tarayıcı ---
const exe = ['/usr/bin/brave', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!exe) { console.error('Brave ya da Chromium bulunamadı.'); process.exit(2); }
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox', `--window-size=${W},${H}`] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });
let where = 'açılış';
const errors = [];
page.on('pageerror', (e) => errors.push(`${where}: pageerror ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${where}: console.error ${m.text()}`); });
page.on('dialog', (d) => d.accept());
await page.goto('file://' + file);
await page.evaluate(() => { try { sessionStorage.setItem('robo-secildi', '1'); localStorage.clear(); } catch { /* yok say */ } });
await page.reload();
await page.waitForSelector('.node a', { timeout: 15000 });
// bölüm listesi haritadan okunur: adres ve adım sayısı ("n/toplam")
const lessons = await page.$$eval('.node', (ns) => ns.map((n) => ({ no: +n.querySelector('a').getAttribute('href').slice(2), title: n.querySelector('.ntxt b').textContent, steps: +n.querySelector('.ncount').textContent.split('/')[1].split(' ')[0] })));
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const overflow = () => page.evaluate(() => {
  const d = document.documentElement;
  const out = [];
  if (d.scrollWidth > d.clientWidth) out.push(`sayfa ${d.scrollWidth}>${d.clientWidth}`);
  const les = document.querySelector('#lesson');
  if (les && !les.hidden && les.scrollWidth > les.clientWidth) out.push(`#lesson ${les.scrollWidth}>${les.clientWidth}`);
  return out.join(', ');
});
const go = async (hash) => {
  where = hash;
  await page.evaluate((h) => { location.hash = h; }, hash);
  await sleep(120);
};

const issues = [];
let visited = 0;
let nLessons = 0;
for (const L of lessons) {
  if (ONLY && String(L.no) !== ONLY) continue;
  nLessons++;
  let shot = false;
  for (let i = 0; i <= L.steps; i++) {
    const hash = i < L.steps ? `#b${L.no}/${i}` : `#b${L.no}/son`;
    try {
      await go(hash);
      const kind = await page.evaluate(() => (document.querySelector('.sact') ? 'scratch' : document.querySelector('.gridact') ? 'grid' : document.querySelector('#lesson')?.children.length ? 'diğer' : 'BOŞ'));
      if (kind === 'BOŞ') issues.push(`${hash}: sayfa boş açıldı`);
      if (kind === 'scratch') {
        if (FLAG) { await page.click('.flag').catch(() => {}); await sleep(400); }
        if (SHOTS && !shot) { shot = true; await page.screenshot({ path: path.join(SHOTS, `b${String(L.no).padStart(2, '0')}-${i}.png`) }); }
      }
      const ov = await overflow();
      if (ov) issues.push(`${hash} (${kind}): yatay taşma ${ov}`);
      visited++;
    } catch (e) { issues.push(`${hash}: ${e.message.split('\n')[0]}`); }
  }
}
await go('');
await browser.close();
const all = [...issues, ...[...new Set(errors)]];
all.forEach((l) => console.log('SORUN ' + l));
console.log(`${nLessons} bölüm, ${visited} sayfa gezildi (${W}x${H}); yatay taşma/boş sayfa: ${issues.length}, konsol/sayfa hatası: ${new Set(errors).size}`);
process.exit(all.length ? 1 : 0);
