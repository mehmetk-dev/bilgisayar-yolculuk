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
