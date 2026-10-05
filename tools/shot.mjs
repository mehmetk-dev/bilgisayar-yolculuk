// Kalite kontrol: Brave (headless) ile ekran görüntüsü. Kullanım: node tools/shot.mjs senaryo.json
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const scen = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const file = 'file://' + path.resolve('dist/bilgisayarin-icine-yolculuk.html');
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/brave', headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox', '--window-size=1600,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: scen.w || 1600, height: scen.h || 900 });
const logs = [];
page.on('console', (m) => logs.push(m.type() + ': ' + m.text()));
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.stack));
await page.goto(file, { waitUntil: 'load' });
try { await page.waitForFunction('window.APP && window.APP.S.ready', { timeout: 90000 }); }
catch (e) { console.log('ZAMAN AŞIMI\n' + logs.join('\n')); await page.screenshot({ path: 'shots/_fail.png' }); await browser.close(); process.exit(1); }
await new Promise((r) => setTimeout(r, 1500));
for (const st of scen.steps) {
  if (st.js) await page.evaluate('{' + st.js + '}');
  await new Promise((r) => setTimeout(r, st.wait ?? 2500));
  if (st.shot) { await page.screenshot({ path: 'shots/' + st.shot + '.png' }); console.log('shot', st.shot); }
}
console.log(logs.filter((l) => !l.includes('GPU stall')).join('\n'));
await browser.close();
