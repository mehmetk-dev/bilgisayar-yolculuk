// Sunumların giriş sayfası: node sunum/robo/kaynak/dizin.mjs → sunum/robo/index.html
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '..');
const files = fs.readdirSync(OUT).filter((f) => /^hafta-\d+\.html$/.test(f)).sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6)));
const COL = ['#ff8a3d', '#e0457b', '#ff6680', '#4c97ff', '#ffab19', '#ff8c1a', '#5b6ee1', '#5cb1d6'];
const cards = files.map((f) => {
  const html = fs.readFileSync(path.join(OUT, f), 'utf8');
  const n = parseInt(f.slice(6));
  const title = (html.match(/<title>Robo ile Kodlama · \d+\. hafta: ([^<]+)<\/title>/) || [])[1] || '';
  const lessons = [...html.matchAll(/data-menu="(\d)\. ders: ([^"]+)" data-sub="(\d+)\. bölüm"/g)].map((m) => `<li><b>${m[3]}.</b> ${m[2]}</li>`).join('');
  const count = (html.match(/<section class="s /g) || []).length;
  return `<a class="w" href="${f}" style="--c:${COL[(n - 1) % COL.length]}"><span class="n">${n}. hafta</span><h2>${title}</h2><ul>${lessons}</ul><span class="k">${count} slayt ›</span></a>`;
}).join('\n');
fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Robo ile Kodlama · Tahta sunumları</title>
<style>
body { margin: 0; font-family: "Nunito", "Trebuchet MS", "Ubuntu", "Segoe UI", sans-serif; background: linear-gradient(135deg, #7c4dff, #b04dff 60%, #ff8a00 140%); min-height: 100vh; color: #1d3557; }
header { text-align: center; color: #fff; padding: 40px 20px 10px; }
h1 { font-size: 52px; margin: 0; } header p { font-size: 22px; opacity: .9; }
main { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px; padding: 24px 40px 50px; max-width: 1400px; margin: 0 auto; }
.w { background: #fff; border-radius: 26px; padding: 22px 24px; text-decoration: none; color: inherit; border-top: 12px solid var(--c); box-shadow: 0 10px 30px #0003; transition: transform .2s; display: flex; flex-direction: column; }
.w:hover { transform: translateY(-6px); }
.n { font-weight: 900; color: var(--c); font-size: 20px; } h2 { margin: 6px 0 10px; font-size: 26px; }
ul { margin: 0; padding-left: 0; list-style: none; font-size: 18px; line-height: 1.6; flex: 1; } li b { color: var(--c); }
.k { margin-top: 12px; font-weight: 900; color: var(--c); }
footer { text-align: center; color: #fff; opacity: .85; padding-bottom: 30px; font-size: 18px; }
</style></head><body>
<header><h1>🤖 Robo ile Kodlama</h1><p>Tahta sunumları · 8 hafta · 32 ders</p></header>
<main>
${cards}
</main>
<p style="text-align:center;margin:0 0 24px"><a href="ekstra/ic-ice-donguler.html" style="color:#fff;font-size:22px;font-weight:800">➕ Ekstra: İç içe döngüler (tek konu sunumu) ›</a></p>
<footer>Sunumda: → / Boşluk ileri · ← geri · <b>F</b> tam ekran · <b>M</b> ders menüsü · <b>N</b> öğretmen notu · <b>P</b> oynat · 1-2-3 soru şıkkı</footer>
</body></html>
`);
console.log('index.html:', files.length, 'hafta');
