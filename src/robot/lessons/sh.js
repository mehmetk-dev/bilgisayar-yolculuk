// Scratch bölümleri için kısa yardımcılar
import { BACKDROPS } from '../sahne/costumes.js';

// Kukla tanımı: sp('Kedi', 'kedi', -150, 0, { dir: 90, rot: 'all', scripts: [[...]] })
export const sp = (name, costume, x = 0, y = 0, o = {}) => ({ name, costume, x, y, ...o });

// Hikâye adımlarında küçük dekor resmi
export const bdPic = (k, w = 300) => `<div class="bdpic" style="width:${w}px">${BACKDROPS[k].svg}</div>`;

// Hikâyelerde blok resmi: blk('motion', '10 adım git')
const COL = { motion: '#4c97ff', looks: '#9966ff', sound: '#cf63cf', events: '#ffbf00', control: '#ffab19', sensing: '#5cb1d6', pen: '#0fbd8c', vars: '#ff8c1a', operators: '#59c059' };
export const blk = (cat, text, hat) => `<span class="chips${hat ? ' hat' : ''}${cat === 'events' || cat === 'control' ? ' dk' : ''}" style="--k:${COL[cat]}">${text}</span>`;

// Sık kullanılan hedef denetimleri
export const near = (a, x, y, r = 25) => Math.hypot(a.x - x, a.y - y) <= r;

// Kalem çizgilerinin ölçüsü: toplam uzunluk, genişlik, yükseklik, kapalı mı
export function shape(lines) {
  if (!lines.length) return { len: 0, w: 0, h: 0, closed: false, n: 0 };
  let len = 0;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const l of lines) {
    len += Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
    x1 = Math.min(x1, l.x1, l.x2); x2 = Math.max(x2, l.x1, l.x2);
    y1 = Math.min(y1, l.y1, l.y2); y2 = Math.max(y2, l.y1, l.y2);
  }
  const a = lines[0];
  const b = lines[lines.length - 1];
  return { len, w: x2 - x1, h: y2 - y1, n: lines.length, closed: Math.hypot(a.x1 - b.x2, a.y1 - b.y2) < 6 };
}

// Notalar sırayla çalındı mı? (arada başka notalar olabilir)
export function played(notes, seq) {
  let k = 0;
  for (const n of notes) if (n === seq[k]) { k++; if (k === seq.length) return true; }
  return false;
}
