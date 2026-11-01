// Kullanım: node sunum/yetiskin-kursu/kaynak/pdf.mjs [ad ...]   (ad verilmezse hafta1..hafta15, ek-guvenlik ve donanım dosyaları)
// Brave (headless) ile kaynak/<ad>.html dosyasını yetiskin-kursu/PDF/Bilgisayar-Isletmenligi-<ad>.pdf olarak yazdırır.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = createRequire(path.join(dir, '..', '..', '..', 'package.json'))('puppeteer-core');
const names = process.argv.slice(2).length ? process.argv.slice(2) : [...Array.from({ length: 15 }, (_, i) => `hafta${i + 1}`), 'ek-guvenlik', 'donanim', 'donanim-notlar'];

const browser = await puppeteer.launch({ executablePath: '/usr/bin/brave', headless: 'new', args: ['--no-sandbox'] });
for (const n of names) {
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, n + '.html'), { waitUntil: 'load' });
  await page.evaluate('document.fonts.ready');
  const out = path.join(dir, '..', 'PDF', `Bilgisayar-Isletmenligi-${n}.pdf`);
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  console.log(out);
  await page.close();
}
await browser.close();
