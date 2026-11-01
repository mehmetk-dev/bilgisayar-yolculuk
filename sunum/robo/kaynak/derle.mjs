// Robo tahta sunumlarını derler: node sunum/robo/kaynak/derle.mjs [hafta...]
// Çıktı: sunum/robo/hafta-N.html (tek dosya, internetsiz; simge yazı tipleri gömülü)
import fs from 'node:fs';
import path from 'node:path';

const DIR = import.meta.dirname;
const ROOT = path.resolve(DIR, '../../..');
const OUT = path.resolve(DIR, '..');
const FONTS = [['UISymC', 'ui-color.woff2'], ['UISymM', 'ui-mono.woff2'], ['UISymD', 'ui-dv.woff2']];
const fontCss = FONTS.map(([n, f]) => `@font-face { font-family: ${n}; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'src/fonts', f)).toString('base64')}) format("woff2"); }`).join('\n');
const css = fs.readFileSync(path.join(DIR, 'motor.css'), 'utf8');
const js = fs.readFileSync(path.join(DIR, 'motor.js'), 'utf8');
// Scratch sahnesi: sitenin sahne motoru paketlenir, sahne CSS'inden yalnız sahne kuralları alınır
const esbuild = await import('esbuild');
const sahneJs = (await esbuild.build({ absWorkingDir: ROOT, entryPoints: [path.join(DIR, 'sahne-giris.js')], bundle: true, format: 'iife', minify: true, write: false, target: ['es2020'], legalComments: 'none', charset: 'utf8', logLevel: 'error' })).outputFiles[0].text;
const sahneCss = fs.readFileSync(path.join(ROOT, 'src/robot/css/20-sahne.css'), 'utf8').split('\n').filter((l) => /^\.(stg|spr|bub|mon|thumb)/.test(l)).join('\n');

// Yazı tipinde olmayan simgeleri bul (fontTools varsa)
let cmap = null;
try {
  const { execFileSync } = await import('node:child_process');
  const out = execFileSync('python3', ['-I', '-c', `
import sys,json
from fontTools.ttLib import TTFont
s=set()
for f in sys.argv[1:]: s|=set(TTFont(f).getBestCmap().keys())
print(json.dumps(sorted(s)))`, ...FONTS.map(([, f]) => path.join(ROOT, 'src/fonts', f))], { encoding: 'utf8' });
  cmap = new Set(JSON.parse(out));
} catch { /* denetim atlanır */ }
const OKCH = new Set([0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2026, 0xfe0f, 0x200d, 0x20e3, 0x2192, 0x00d7]);

const weeks = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(DIR).filter((f) => /^h\d+\.mjs$/.test(f)).map((f) => f.match(/\d+/)[0]);
for (const w of weeks) {
  const mod = await import(path.join(DIR, `h${w}.mjs`) + `?t=${Date.now()}`);
  const { title, slides } = mod.default;
  const body = slides.join('\n');
  if (cmap) {
    const miss = [...new Set([...body].filter((c) => c.codePointAt(0) >= 0x1fa70 && !cmap.has(c.codePointAt(0))))];
    if (miss.length) console.warn(`  ! hafta ${w}: yeni (Emoji 13+) simgeler, eski Windows'ta görünmeyebilir: ${miss.join(' ')}`);
  }
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Robo ile Kodlama · ${w}. hafta: ${title}</title>
<style>
${fontCss}
${css}
${sahneCss}
</style>
</head>
<body>
<div id="deck">
${body}
<div id="note"></div>
<div id="menu"><h3>📚 Nereye gidelim? <span style="font-size:24px;opacity:.7">(M ile aç/kapat)</span></h3><div class="grp"></div></div>
<div id="bar">
  <button class="nav" id="prev" title="Geri (←)">‹</button>
  <button class="nav" id="menubtn" title="Dersler (M)" style="font-size:28px">☰</button>
  <div id="dots"></div>
  <button class="nav" id="notebtn" title="Öğretmen notu (N)" style="font-size:26px">📝</button>
  <button class="nav" id="fs" title="Tam ekran (F)"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
  <button class="nav" id="next" title="İleri (→ ya da Boşluk)">›</button>
</div>
</div>
<script>
${sahneJs.replace(/<\/script/gi, '<\\/script')}
</script>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
</body>
</html>
`;
  const file = path.join(OUT, `hafta-${w}.html`);
  fs.writeFileSync(file, html);
  console.log(`hafta-${w}.html  ${slides.length} slayt  ${(html.length / 1024).toFixed(0)} KB`);
}
