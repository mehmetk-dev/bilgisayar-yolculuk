// Bütün derslerin hafta hafta, adım adım Markdown dökümünü ders verisinden otomatik üretir.
// Kullanım: node tools/ders-dokumu.mjs [çıktı.md]
//   Varsayılan çıktı: ~/Masaüstü/obsidyen/Ders Notları/Bilişim/BUTUN_DERSLER_ADIM_ADIM.md (üzerine yazılır)
// src/dersler/lessons/index.js esbuild ile geçici bir pakete çevrilir (os.tmpdir()), WEEKS okunur, paket silinir.
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(os.homedir(), 'Masaüstü/obsidyen/Ders Notları/Bilişim/BUTUN_DERSLER_ADIM_ADIM.md'));

// Dersleri geçici pakete çevirip yükle
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ders-dokumu-'));
let WEEKS;
try {
  const file = path.join(tmp, 'lessons.mjs');
  await build({ entryPoints: [path.join(ROOT, 'src/dersler/lessons/index.js')], bundle: true, format: 'esm', platform: 'node', outfile: file, logLevel: 'silent' });
  ({ WEEKS } = await import(pathToFileURL(file).href));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", hellip: '…', ndash: '–', mdash: '—', rarr: '→', larr: '←' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e.toLowerCase()] ?? m;
});
const strip = (h) => decode(String(h)
  .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<\/(li|p|div|tr|h\d)>|<br\s*\/?>/gi, ' · ')
  .replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ')
  .replace(/(?:\s*·)+\s*(?=·|$)/g, '').replace(/^\s*·\s*/, '').replace(/([.!?…:;]) ·/g, '$1')
  .replace(/ ([.,;:!?…)”])/g, '$1').replace(/([(“]) /g, '$1').replace(/ (['’]\p{L})/gu, '$1').trim();

// Tam metin; 320 karakteri aşarsa 320 öncesindeki son cümle sonunda keser
function kisalt(t, max = 320) {
  if (t.length <= max) return t;
  const m = t.slice(0, max).match(/^[\s\S]*[^\d\s][.!?…](?=\s|$)/);
  if (m) return m[0];
  const k = t.slice(0, max);
  return k.slice(0, Math.max(k.lastIndexOf(' '), 1)).replace(/[\s,;:·]+$/, '') + '…';
}

let etkilesimli = 0;
const bos = () => {};
const baglam = () => ({ L: {}, s: {}, d: {}, store: { lessons: {} }, resumed: false, warn: bos, note: bos, complete: bos, emit: bos, put: bos, set: bos, get: () => undefined });
function talimat(step) {
  let h = step.html;
  if (typeof h === 'function') {
    try { h = h(baglam()); } catch { h = null; }
    if (typeof h !== 'string') { etkilesimli++; return '(etkileşimli)'; }
  }
  let t = kisalt(strip(h || ''));
  if (typeof step.hint === 'string') {
    const ip = strip(step.hint);
    const norm = (x) => x.toLowerCase().replace(/[^\p{L}\d]+/gu, ' ').trim();
    if (ip && !norm(strip(h || '')).includes(norm(ip))) t += (t ? ' ' : '') + 'İpucu: ' + kisalt(ip, 140);
  }
  return t;
}

const tur = (l) => l.test ? 'test' : /^odev/.test(l.id || '') ? 'ödev' : /parkur/i.test(l.id || '') ? 'parkur' : 'ders';
const soruSayisi = (l) => l.steps.filter((s) => !s.final && s.title !== 'Nasıl çözülür?').length;

const out = [];
const sat = [];
let tDers = 0, tDk = 0;
for (const w of WEEKS) {
  const dk = w.lessons.reduce((a, l) => a + (l.minutes || 0), 0);
  tDers += w.lessons.length; tDk += dk;
  const say = { ders: 0, ödev: 0, test: 0, parkur: 0 };
  out.push(`## Hafta ${w.no}: ${w.title}`, '', `${w.lessons.length} ders, toplam ${dk} dk`, '');
  for (const l of w.lessons) {
    const t = tur(l);
    say[t]++;
    out.push(`### ${l.icon || ''} ${l.title} (\`${l.id || l.link}\`)${l.minutes != null ? ` · ${l.minutes} dk` : ''} · ${t}`.replace('###  ', '### '), '');
    if (l.desc) out.push(`*${strip(l.desc)}*`, '');
    if (!l.steps) { out.push(`Ayrı sayfada açılır: \`${l.link}\``, ''); continue; }
    if (l.test) { out.push(`${soruSayisi(l)} soru`, ''); continue; }
    l.steps.forEach((s, i) => {
      const bsl = strip(s.title || '');
      let x = talimat(s);
      if (x.toLowerCase() === bsl.toLowerCase()) x = '';
      const bit = s.final ? ' (Bitiş)' : '';
      out.push(`${i + 1}. **${bsl}**${bit}${x ? ': ' + x : ''}`);
    });
    out.push('');
  }
  sat.push(`| Hafta ${w.no} | ${say.ders} | ${say['ödev']} | ${say.test} | ${say.parkur} | ${dk} |`);
}

const tarih = new Date().toISOString().slice(0, 10);
const bas = [
  '# Bilgisayar Dersleri: Bütün Haftalar Adım Adım', '',
  `Bu belge kurs uygulamasının ders verisinden otomatik üretildi (${tarih}); elle düzenlemeyin, değişiklik için \`tools/ders-dokumu.mjs\` betiğini yeniden çalıştırın. Toplam ${WEEKS.length} hafta, ${tDers} ders, ${tDk} dakika (yaklaşık ${(tDk / 60).toFixed(1)} saat) içerir.`, '',
  'Her adımda yalnızca talimatın ilk cümlesi verilir. Test derslerinde soru sayısı yazılır.', '',
];
const son = ['## Özet tablosu', '', '| Hafta | Ders | Ödev | Test | Parkur | Toplam dk |', '|---|---|---|---|---|---|', ...sat, ''];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, [...bas, ...out, ...son].join('\n'));
console.log(`${OUT}\n${WEEKS.length} hafta, ${tDers} ders, ${tDk} dk; ${etkilesimli} adım "(etkileşimli)" kaldı.`);
