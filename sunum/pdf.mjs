// Kullanım: node sunum/pdf.mjs [ad ...]   (ad verilmezse hafta2..hafta8 ve ek-guvenlik)
// Brave (headless) ile sunum/<ad>.html dosyasını sunum/Bilgisayar-Isletmenligi-<ad>.pdf olarak yazdırır.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = createRequire(path.join(dir, '..', 'package.json'))('puppeteer-core');
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['hafta2', 'hafta3', 'hafta4', 'hafta5', 'hafta6', 'hafta7', 'hafta8', 'ek-guvenlik'];

const browser = await puppeteer.launch({ executablePath: '/usr/bin/brave', headless: 'new', args: ['--no-sandbox'] });
for (const n of names) {
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, n + '.html'), { waitUntil: 'load' });
  await page.evaluate('document.fonts.ready');
  const out = path.join(dir, `Bilgisayar-Isletmenligi-${n}.pdf`);
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  console.log(out);
  await page.close();
}
await browser.close();
