// İşlemcinin iç yapısı için öğretici SVG şeması (ölçekli değildir, gerçek yonga görüntüsü değildir).
import { CPU_SCHEMA } from './content.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function box(x, y, w, h, fill, label, sub = '', { stroke = '#0b0e12', fs = 18, dash = false, txt = '#0b0e12' } = {}) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${dash ? 'stroke-dasharray="8 6"' : ''}/>
  <text x="${x + w / 2}" y="${y + h / 2 + (sub ? -4 : 6)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${txt}">${esc(label)}</text>
  ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 18}" text-anchor="middle" font-size="${fs * 0.72}" fill="${txt}">${esc(sub)}</text>` : ''}</g>`;
}

export function cpuSchemaSVG(era, level = 'k') {
  const d = CPU_SCHEMA[era];
  const W = 900, H = 520;
  const C = { core: '#ffb067', cache: '#7fd1ff', l3: '#5fb0e6', mc: '#8ee69a', gpu: '#c9a3ff', io: '#ffe07a', die: '#2a313b', sub: '#1f5a32' };
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif">`;
  s += `<rect x="0" y="0" width="${W}" height="${H}" fill="#11151b"/>`;
  // paket alt tabanı
  s += `<rect x="40" y="40" width="${W - 80}" height="${H - 120}" rx="18" fill="${C.sub}" stroke="#3b8a55" stroke-width="3"/>`;
  s += `<text x="60" y="${H - 92}" font-size="16" fill="#cfe9d6">İşlemci paketi (taban)</text>`;
  const coreBlock = (x, y, w, h, n, label = 'Çekirdek', sub = '', cache = 'L1 + L2') => {
    const cols = n <= 1 ? 1 : n <= 4 ? 2 : 4;
    const rows = Math.ceil(n / cols);
    const cw = (w - (cols + 1) * 10) / cols, ch = (h - (rows + 1) * 10) / rows;
    let o = '';
    for (let i = 0; i < n; i++) {
      const cx = x + 10 + (i % cols) * (cw + 10), cy = y + 10 + Math.floor(i / cols) * (ch + 10);
      o += box(cx, cy, cw, ch * 0.68, C.core, `${label} ${n > 1 ? i + 1 : ''}`.trim(), sub, { fs: n > 4 ? 14 : 18 });
      o += box(cx, cy + ch * 0.7, cw, ch * 0.3, C.cache, n > 4 ? 'L1+L2' : cache, '', { fs: n > 4 ? 12 : 14 });
    }
    return o;
  };
  if (!d.chiplets) {
    const dx = 120, dy = 70, dw = 560, dh = 300;
    s += `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" rx="10" fill="${C.die}" stroke="#9aa6b5" stroke-width="3"/>`;
    s += `<text x="${dx + 12}" y="${dy + 26}" font-size="16" fill="#cfd6df">Yonga (silisyum)</text>`;
    if (era === '1990' || era === '2000') {
      s += coreBlock(dx + 20, dy + 40, era === '2000' ? 300 : 260, 230, 1, 'Çekirdek', era === '2000' ? 'HT: 2 iş parçacığı' : '', 'L1 önbellek');
      if (era === '2000') s += box(dx + 340, dy + 50, 190, 220, C.cache, 'L2 önbellek', d.l2);
      else s += box(dx + 300, dy + 50, 230, 100, C.io, 'Sistem veri yolu', '66 MHz');
      if (era === '1990') s += box(dx + 300, dy + 170, 230, 100, '#9fb0c4', 'Kayan nokta birimi', 'FPU');
    } else {
      s += coreBlock(dx + 20, dy + 40, 330, 240, 4);
      s += box(dx + 365, dy + 50, 175, 95, C.l3, 'L3 önbellek', d.l3, { fs: 16 });
      s += box(dx + 365, dy + 155, 85, 115, C.gpu, 'Grafik', '', { fs: 15 });
      s += box(dx + 458, dy + 155, 82, 115, C.mc, 'Bellek', 'denet.', { fs: 14 });
    }
    // dış bileşenler
    if (d.ext.length) {
      let y = 80;
      for (const e of d.ext) {
        s += box(W - 205, y, 165, 90, '#3a4250', e.split(' ')[0], (e.split(' ').slice(1).join(' ') + ' · ' + (era === '1990' && e.startsWith('L2') ? 'anakartta' : 'yonga setinde')).replace(/^ · /, ''), { txt: '#fff', dash: true, stroke: '#ffd166', fs: 17 });
        s += `<line x1="${dx + dw}" y1="${y + 45}" x2="${W - 205}" y2="${y + 45}" stroke="#ffd166" stroke-width="3" stroke-dasharray="6 6"/>`;
        y += 120;
      }
      s += `<text x="${W - 200}" y="${H - 92}" font-size="15" fill="#ffd166">işlemcinin DIŞINDA</text>`;
    }
  } else {
    // yonga parçacıkları: çekirdek yongası (CCD) + G/Ç yongası (IOD)
    const ccd = { x: 90, y: 80, w: 360, h: 290 };
    const iod = { x: 500, y: 110, w: 330, h: 240 };
    s += `<rect x="${ccd.x}" y="${ccd.y}" width="${ccd.w}" height="${ccd.h}" rx="10" fill="${C.die}" stroke="#9aa6b5" stroke-width="3"/>`;
    s += `<text x="${ccd.x + 10}" y="${ccd.y + 24}" font-size="16" fill="#cfd6df">Çekirdek yongası (CCD)</text>`;
    s += coreBlock(ccd.x + 10, ccd.y + 32, ccd.w - 20, 170, 8);
    s += box(ccd.x + 20, ccd.y + 210, ccd.w - 40, 62, C.l3, 'L3 önbellek (paylaşımlı)', d.l3, { fs: 16 });
    s += `<rect x="${iod.x}" y="${iod.y}" width="${iod.w}" height="${iod.h}" rx="10" fill="${C.die}" stroke="#9aa6b5" stroke-width="3"/>`;
    s += `<text x="${iod.x + 10}" y="${iod.y + 24}" font-size="16" fill="#cfd6df">G/Ç yongası (IOD)</text>`;
    s += box(iod.x + 15, iod.y + 36, 145, 90, C.mc, 'Bellek', 'denetleyicisi (DDR5)', { fs: 15 });
    s += box(iod.x + 170, iod.y + 36, 145, 90, C.io, 'PCIe 5.0', 'denetleyicisi', { fs: 15 });
    s += box(iod.x + 15, iod.y + 136, 145, 90, C.gpu, 'Tümleşik', 'grafik', { fs: 15 });
    s += box(iod.x + 170, iod.y + 136, 145, 90, '#9fb0c4', 'USB / G/Ç', '', { fs: 15 });
    s += `<line x1="${ccd.x + ccd.w}" y1="230" x2="${iod.x}" y2="230" stroke="#ffd166" stroke-width="5"/>`;
    s += `<text x="${(ccd.x + ccd.w + iod.x) / 2}" y="220" text-anchor="middle" font-size="13" fill="#ffd166">bağlantı</text>`;
  }
  s += `<rect x="0" y="${H - 52}" width="${W}" height="52" fill="#ffd166"/>`;
  s += `<text x="${W / 2}" y="${H - 20}" text-anchor="middle" font-size="19" font-weight="700" fill="#111">ÖĞRETİCİ ŞEMA – gerçek yonga fotoğrafı ya da ölçekli çizim değildir</text>`;
  s += '</svg>';
  return s;
}

export function cpuSchemaFacts(era, level) {
  const d = CPU_SCHEMA[era];
  const rows = level === 'k'
    ? [['Çekirdek', d.cores], ['Aynı anda iş', d.threads], ['Saat hızı', d.clock]]
    : [['Çekirdek / iş parçacığı', `${d.cores} / ${d.threads}`], ['Saat hızı', d.clock], ['L1', d.l1], ['L2', d.l2], ['L3', d.l3], ['Bellek denetleyicisi', d.mc], ['Grafik', d.gpu], ['Üretim süreci', d.process], ['Transistör (yaklaşık)', d.transistors]];
  return { title: d.title, rows };
}
