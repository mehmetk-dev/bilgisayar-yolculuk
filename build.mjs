// Tek dosyalık, internetsiz çalışan HTML üretir: dist/bilgisayarin-icine-yolculuk.html
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const res = await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  minify: process.argv.includes('--dev') ? false : true,
  write: false,
  target: ['es2020'],
  legalComments: 'none',
  charset: 'utf8',
});
let js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = fs.readFileSync('src/index.html', 'utf8');
const out = html.replace('<!--APP-->', () => `<script>\n/* three.js (MIT) dahil */\n${js}\n</script>`);
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/bilgisayarin-icine-yolculuk.html', out);
console.log('dist/bilgisayarin-icine-yolculuk.html', (out.length / 1024).toFixed(0) + ' KB');
