// Robo tahta sunumlarını tarayıcıda denetler: konsol hatası, taşma, oynatıcıların sonucu; istenirse ekran görüntüsü.
// Kullanım: node sunum/robo/kaynak/tara.mjs [hafta...] [--shots=klasör] [--size=1366x768]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const SHOTS = opt('shots', '');
const [VW, VH] = opt('size', '1366x768').split('x').map(Number);
const OUT = path.resolve(import.meta.dirname, '..');
let weeks = args.filter((a) => !a.startsWith('--'));
if (!weeks.length) weeks = fs.readdirSync(OUT).filter((f) => /^hafta-\d+\.html$/.test(f)).map((f) => f.match(/\d+/)[0]);
const exe = ['/usr/bin/brave', '/usr/bin/chromium', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
const b = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let problems = 0;
for (const w of weeks) {
  const p = await b.newPage();
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', (e) => errs.push(e.message));
  await p.setViewport({ width: VW, height: VH });
  const url = 'file://' + path.join(OUT, `hafta-${w}.html`);
  await p.goto(url);
  await sleep(300);
  const n = await p.evaluate(() => document.querySelectorAll('.s').length);
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const results = [];
  for (let i = 0; i < n; i++) {
    await p.evaluate((i) => { location.hash = '#' + (i + 1); }, i);
    await p.reload(); await sleep(250);
    await p.evaluate(() => document.querySelectorAll('.s.on .f').forEach((f) => f.classList.add('vis')));
    await sleep(550);
    const info = await p.evaluate(() => {
      const s = document.querySelector('.s.on'), r = s.getBoundingClientRect(), k = r.height / 900, bad = [];
      s.querySelectorAll('*').forEach((e) => {
        if (e.closest('.sky') || e.closest('.cf') || e.closest('.bub') || e.closest('.gmsg') || e.closest('.where')) return;
        const q = e.getBoundingClientRect();
        if (q.width && (q.right > r.right - 20 * k || q.bottom > r.bottom - 84 * k || q.left < r.left + 10 * k)) bad.push((e.className && String(e.className)) || e.tagName);
      });
      return { bad: [...new Set(bad)].slice(0, 4), title: (s.querySelector('h1,h2,.q') || {}).textContent || s.dataset.where, players: s.querySelectorAll('.player').length };
    });
    if (info.bad.length) { problems++; console.log(`  hafta ${w} slayt ${i + 1} (${info.title.slice(0, 40)}) taşma: ${info.bad.join(', ')}`); }
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `h${w}-${String(i + 1).padStart(2, '0')}.png`) });
    if (info.players) {
      // hızlı modda sonuna kadar oynat
      const res = await p.evaluate(async () => {
        const out = [];
        for (const pl of document.querySelectorAll('.s.on .player')) {
          const tabs = pl.querySelectorAll('.maptabs button');
          const runs = tabs.length || 1;
          for (let t = 0; t < runs; t++) {
            if (tabs.length) tabs[t].click();
            const sl = pl.querySelector('[data-act="slow"]'); if (sl.classList.contains('on')) sl.click();
            pl.querySelector('[data-act="play"]').click();
            for (let k = 0; k < 600; k++) {
              await new Promise((r) => setTimeout(r, 100));
              if (pl.querySelector('[data-act="play"]').textContent.includes('Oynat')) break;
            }
            const m = pl.querySelector('.gmsg'), tx = pl.querySelector('.beat .tx');
            out.push(m ? (m.classList.contains('ok') ? '✔ ' : '✘ ') + m.textContent : tx ? tx.textContent : '(mesaj yok)');
          }
        }
        return out;
      });
      results.push(`  ${i + 1}. ${info.title.slice(0, 38).padEnd(38)} → ${res.join(' | ')}`);
    }
  }
  console.log(`hafta ${w}: ${n} slayt, hatalar: ${errs.length ? errs.join(' / ') : 'yok'}`);
  if (errs.length) problems++;
  results.forEach((r) => console.log(r));
  await p.close();
}
await b.close();
console.log(`sorun: ${problems}`);
