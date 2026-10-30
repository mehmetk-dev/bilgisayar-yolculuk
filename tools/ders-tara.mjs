// Bilgisayar dersleri: tarayıcı turu. dist/index.html başsız açılır; her dersin her adımı gezilir.
// Kullanım: node tools/ders-tara.mjs [--size=1280x720] [--only=ders-id[,id2]]
// Önce `node build.mjs` çalıştırılmalı. Adımlar window.DERS.showStep ile açılır (öğrenci işi yapılmaz);
// pageerror / console.error, boş adım başlığı ve yatay taşma bildirilir; sorun varsa çıkış kodu 1.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const [W, H] = opt('size', '1280x720').split('x').map(Number);
const ONLY = opt('only', '').split(',').filter(Boolean);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const file = path.join(ROOT, 'dist/index.html');
const exe = ['/usr/bin/brave', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!exe) { console.error('Brave ya da Chromium bulunamadı.'); process.exit(2); }
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox', `--window-size=${W},${H}`] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });
let where = 'açılış';
const problems = [];
page.on('pageerror', (e) => problems.push(`${where}: pageerror ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') problems.push(`${where}: console.error ${m.text()}`); });
page.on('dialog', (d) => d.accept());
await page.goto('file://' + file);
await page.evaluate(() => localStorage.clear());
await page.reload();
const guest = await page.waitForSelector('.pguest', { timeout: 8000 }).catch(() => null);
if (guest) await guest.click();
await page.waitForSelector('a[href^="#ders/"]', { timeout: 15000 });
let ids = [...new Set(await page.$$eval('a[href^="#ders/"]', (as) => as.map((a) => a.getAttribute('href').slice(6))))];
if (ONLY.length) ids = ids.filter((id) => ONLY.includes(id));

let steps = 0;
for (const id of ids) {
  where = id;
  await page.evaluate((h) => { location.hash = h; }, '#ders/' + id);
  const ok = await page.waitForFunction((i) => window.DERS?.lesson?.id === i, { timeout: 8000 }, id).then(() => true, () => false);
  if (!ok) { problems.push(`${id}: ders açılmadı`); continue; }
  await sleep(300);
  const n = await page.evaluate(() => window.DERS.lesson.steps.length);
  for (let i = 0; i < n; i++) {
    where = `${id} #${i + 1}`;
    try { await page.evaluate((k) => window.DERS.showStep(k), i); } catch (e) { problems.push(`${where}: showStep ${e.message}`); continue; }
    await sleep(120);
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      return { title: document.querySelector('#stepTitle')?.textContent.trim(), over: d.scrollWidth > d.clientWidth ? `${d.scrollWidth}>${d.clientWidth}` : '' };
    });
    if (!r.title) problems.push(`${where}: adım başlığı boş`);
    if (r.over) problems.push(`${where}: yatay taşma ${r.over}`);
    steps++;
  }
}
await browser.close();
console.log(`${ids.length} ders, ${steps} adım gezildi.`);
if (problems.length) { console.log(`${problems.length} sorun:\n` + problems.map((p) => '  - ' + p).join('\n')); process.exit(1); }
console.log('Sorun yok.');
