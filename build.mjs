// Tek dosyalık, internetsiz çalışan HTML sayfaları üretir:
//   dist/index.html (+ dersler.html): ana sayfa, adım adım bilgisayar dersleri
//   dist/bilgisayar.html (+ bilgisayarin-icine-yolculuk.html): 3B bilgisayar
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const dev = process.argv.includes('--dev');

async function page(entry, htmlFile, outFiles, cssDir) {
  const res = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    minify: !dev,
    write: false,
    target: ['es2020'],
    legalComments: 'none',
    charset: 'utf8',
  });
  const js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  let html = fs.readFileSync(htmlFile, 'utf8');
  // Stil dosyaları ad sırasıyla (00-…, 10-…) sayfanın içine gömülür
  if (cssDir) {
    const css = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css')).sort().map((f) => fs.readFileSync(`${cssDir}/${f}`, 'utf8')).join('\n');
    html = html.replace('<!--CSS-->', () => css);
  }
  const out = html.replace('<!--APP-->', () => `<script>\n${js}\n</script>`);
  for (const f of outFiles) fs.writeFileSync(f, out);
  console.log(outFiles.join(', '), (out.length / 1024).toFixed(0) + ' KB');
}

fs.mkdirSync('dist', { recursive: true });
// Eski adresler (dersler.html, bilgisayarin-icine-yolculuk.html) de çalışmaya devam etsin diye kopyaları yazılır
await page('src/main.js', 'src/index.html', ['dist/bilgisayar.html', 'dist/bilgisayarin-icine-yolculuk.html']);
await page('src/dersler/app.js', 'src/dersler/index.html', ['dist/index.html', 'dist/dersler.html'], 'src/dersler/css');
